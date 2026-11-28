import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE_OPTIONS,
  sanitizeSessionMember,
  signSession,
  verifyOtpHash,
} from "@/lib/auth";
import {
  appendAuditLog,
  clearOtpChallenge,
  findMemberByEmail,
  getOtpChallenge,
  incrementOtpAttempts,
} from "@/lib/db";
import type { SessionUser } from "@/lib/types";
import { otpVerifySchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = otpVerifySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ||
            "Valid email and 6-digit OTP code are required.",
        },
        { status: 400 }
      );
    }

    const cleanEmail = parsed.data.email.toLowerCase();
    const challenge = getOtpChallenge(cleanEmail);

    if (!challenge || challenge.expiresAt < Date.now()) {
      clearOtpChallenge(cleanEmail);
      return NextResponse.json(
        {
          error:
            "Verification code has expired or was not requested. Request a new code.",
        },
        { status: 400 }
      );
    }

    if (challenge.attempts >= 5) {
      clearOtpChallenge(cleanEmail);
      return NextResponse.json(
        {
          error:
            "Maximum verification attempts exceeded. Request a new 6-digit code.",
        },
        { status: 429 }
      );
    }

    if (!verifyOtpHash(cleanEmail, parsed.data.code, challenge.codeHash)) {
      incrementOtpAttempts(cleanEmail);
      return NextResponse.json(
        { error: "Invalid 6-digit verification code." },
        { status: 401 }
      );
    }

    clearOtpChallenge(cleanEmail);
    const member = findMemberByEmail(cleanEmail);
    if (!member) {
      return NextResponse.json(
        { error: "Member account no longer exists." },
        { status: 404 }
      );
    }

    const sessionUser: SessionUser = {
      username: member.username,
      name: member.name,
      email: member.email,
      memberId: member.memberId,
      rbacRole: member.rbacRole,
      wingId: member.wingId,
      wing: member.wing,
      supervisedWings: member.supervisedWings || [],
      avatar: member.avatar,
    };

    const token = signSession(sessionUser);
    appendAuditLog(
      member.name,
      member.rbacRole,
      "OTP_PORTAL_SIGNIN",
      `${member.memberId} (${member.email})`
    );

    const res = NextResponse.json({
      user: sessionUser,
      member: sanitizeSessionMember(member),
    });
    res.cookies.set(SESSION_COOKIE_OPTIONS.name, token, {
      httpOnly: SESSION_COOKIE_OPTIONS.httpOnly,
      secure: SESSION_COOKIE_OPTIONS.secure,
      sameSite: SESSION_COOKIE_OPTIONS.sameSite,
      path: SESSION_COOKIE_OPTIONS.path,
      maxAge: SESSION_COOKIE_OPTIONS.maxAge,
    });
    return res;
  } catch {
    return NextResponse.json(
      { error: "Invalid OTP verification request." },
      { status: 400 }
    );
  }
}
