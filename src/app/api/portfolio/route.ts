import { NextRequest, NextResponse } from "next/server";
import { canAccessDashboard, getServerSession } from "@/lib/auth";
import { getMemberByUsername, updateMemberPortfolio } from "@/lib/db";
import type { PortfolioTheme } from "@/lib/types";

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

  return NextResponse.json({ member });
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
    const body = (await req.json()) as {
      headline?: string;
      bio?: string;
      githubUsername?: string;
      linkedin?: string;
      graduationYear?: number;
      internshipAvailable?: boolean;
      themePreference?: PortfolioTheme;
      isPublic?: boolean;
      skills?: {
        languages: string[];
        frameworks: string[];
        systems: string[];
      };
    };

    const updated = updateMemberPortfolio(session.username, body);
    if (!updated) {
      return NextResponse.json(
        { error: "Member profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ member: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to update portfolio." },
      { status: 400 }
    );
  }
}
