import { NextRequest, NextResponse } from "next/server";
import {
  canAccessDashboard,
  getServerSession,
  sanitizePublicMember,
  sanitizeSessionMember,
} from "@/lib/auth";
import { getMemberByUsername, updateMemberPortfolio } from "@/lib/db";
import { portfolioUpdateSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  const session = getServerSession();
  const target = username || session?.username;

  if (!target) {
    return NextResponse.json(
      { error: "Username is required." },
      { status: 400 }
    );
  }

  const member = getMemberByUsername(target);
  if (!member) {
    return NextResponse.json({ error: "Member not found." }, { status: 404 });
  }

  // Strip internal reporting lines and never leak passwordHash
  const isOwnerOrCouncil =
    session &&
    (session.username === member.username ||
      session.rbacRole === "SUPER_ADMIN" ||
      session.rbacRole === "ADVISOR");

  if (isOwnerOrCouncil) {
    return NextResponse.json({ member: sanitizeSessionMember(member) });
  }

  return NextResponse.json({ member: sanitizePublicMember(member) });
}

export async function PUT(req: NextRequest) {
  const session = getServerSession();
  if (!session || !canAccessDashboard(session.rbacRole)) {
    return NextResponse.json(
      { error: "Only approved AXON members may edit their portfolio." },
      { status: 403 }
    );
  }

  try {
    const raw = await req.json();
    const parsed = portfolioUpdateSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ||
            "Invalid portfolio update fields.",
        },
        { status: 400 }
      );
    }

    const updated = updateMemberPortfolio(session.username, parsed.data);
    if (!updated) {
      return NextResponse.json(
        { error: "Member profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ member: sanitizeSessionMember(updated) });
  } catch {
    return NextResponse.json(
      { error: "Failed to update portfolio." },
      { status: 400 }
    );
  }
}
