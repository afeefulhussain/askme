import { NextRequest, NextResponse } from "next/server";
import { canAccessAdmin, getServerSession, isSuperAdmin } from "@/lib/auth";
import { createApplication, readDb, reviewApplication } from "@/lib/db";
import type { RbacRole } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getServerSession();
  if (!session || !canAccessAdmin(session.rbacRole)) {
    return NextResponse.json(
      { error: "Unauthorized: Admin or Wing Director role required." },
      { status: 403 }
    );
  }

  const db = readDb();
  const apps = isSuperAdmin(session.rbacRole)
    ? db.applications
    : db.applications.filter((a) => a.preferredWing === session.wingId);

  return NextResponse.json({ applications: apps });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      university?: string;
      roleType?: string;
      preferredWing?: string;
      githubUsername?: string;
      statement?: string;
    };

    if (!body.name?.trim() || !body.email?.trim() || !body.university?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and university are required." },
        { status: 400 }
      );
    }

    const app = createApplication({
      name: body.name,
      email: body.email,
      university: body.university,
      roleType: body.roleType || "General Member Engineer",
      preferredWing: body.preferredWing || "systems-infra",
      githubUsername: body.githubUsername || "",
      statement: body.statement || "",
    });

    return NextResponse.json({ application: app }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit membership application." },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = getServerSession();
  if (!session || !canAccessAdmin(session.rbacRole)) {
    return NextResponse.json(
      { error: "Unauthorized: Executive Council or Wing Director access required." },
      { status: 403 }
    );
  }

  try {
    const body = (await req.json()) as {
      id?: string;
      decision?: "Approved" | "Rejected";
      assignedWing?: string;
      assignedRole?: RbacRole;
    };

    if (!body.id || !body.decision) {
      return NextResponse.json(
        { error: "Application ID and decision are required." },
        { status: 400 }
      );
    }

    const db = readDb();
    const target = db.applications.find((a) => a.id === body.id);
    if (!target) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    // Wing Director can only moderate their assigned wing (Blueprint Section 8.8)
    if (
      !isSuperAdmin(session.rbacRole) &&
      target.preferredWing !== session.wingId
    ) {
      return NextResponse.json(
        { error: "Wing Directors may only review applications for their own wing." },
        { status: 403 }
      );
    }

    // Only Super Admin can assign Wing Director or Super Admin roles
    const safeRole: RbacRole =
      isSuperAdmin(session.rbacRole) && body.assignedRole
        ? body.assignedRole
        : "approved_member";

    const updated = reviewApplication({
      id: body.id,
      decision: body.decision,
      assignedWing: isSuperAdmin(session.rbacRole)
        ? body.assignedWing
        : session.wingId,
      assignedRole: safeRole,
    });

    return NextResponse.json({ application: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to review application." },
      { status: 400 }
    );
  }
}
