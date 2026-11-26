import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE_OPTIONS,
  signSession,
} from "@/lib/auth";
import { findMemberByEmailOrRole } from "@/lib/db";
import type { SessionUser } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      email?: string;
      tier?: string;
      provider?: string;
    };

    const email = (body.email || "").trim();
    const tier = body.tier || "approved_member";

    const member = findMemberByEmailOrRole(
      email ||
        (tier === "super_admin"
          ? "irfan@axon.org.pk"
          : tier === "wing_director"
          ? "talha@axon.org.pk"
          : tier === "pending_applicant"
          ? "daniyal@uet.edu.pk"
          : "mahnoor@axon.org.pk"),
      tier
    );

    if (!member) {
      return NextResponse.json(
        {
          error:
            "Account not recognized. Use an inducted member email, a pending application email, or select a verified demo access tier.",
        },
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
      avatar: member.avatar,
    };

    const token = signSession(sessionUser);
    const res = NextResponse.json({ user: sessionUser, member });
    res.cookies.set(SESSION_COOKIE_OPTIONS.name, token, {
      httpOnly: SESSION_COOKIE_OPTIONS.httpOnly,
      sameSite: SESSION_COOKIE_OPTIONS.sameSite,
      path: SESSION_COOKIE_OPTIONS.path,
      maxAge: SESSION_COOKIE_OPTIONS.maxAge,
    });
    return res;
  } catch {
    return NextResponse.json(
      { error: "Invalid authentication payload." },
      { status: 400 }
    );
  }
}
