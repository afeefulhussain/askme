import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE_OPTIONS,
  sanitizeSessionMember,
  signSession,
  verifyPassword,
} from "@/lib/auth";
import { appendAuditLog, findMemberByEmail } from "@/lib/db";
import type { SessionUser } from "@/lib/types";
import { passwordLoginSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = passwordLoginSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ||
            "Valid @askme.pk / registered email and password are required.",
        },
        { status: 400 }
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const member = findMemberByEmail(email);

    if (!member) {
      return NextResponse.json(
        { error: "Invalid login credentials." },
        { status: 401 }
      );
    }

    if (member.rbacRole === "PENDING_APPLICANT") {
      return NextResponse.json(
        {
          error:
            "Application pending Super Admin approval. Use Email OTP to check status until approved.",
        },
        { status: 403 }
      );
    }

    if (!verifyPassword(parsed.data.password, member.passwordHash)) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
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
      "PASSWORD_PORTAL_SIGNIN",
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
      { error: "Failed to authenticate credentials." },
      { status: 400 }
    );
  }
}
