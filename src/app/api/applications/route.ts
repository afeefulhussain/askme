import { NextRequest, NextResponse } from "next/server";
import { canAccessAdmin, getServerSession, isSuperAdmin } from "@/lib/auth";
import { createApplication, readDb, reviewApplication } from "@/lib/db";
import { sendOnboardingWelcomeEmail } from "@/lib/email";
import type { PortalRole } from "@/lib/types";
import { applicationReviewSchema, applicationSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getServerSession();
  if (!session || !canAccessAdmin(session.rbacRole)) {
    return NextResponse.json(
      { error: "Unauthorized: Leadership access required." },
      { status: 403 }
    );
  }

  const db = readDb();
  let apps = db.applications;
  if (!isSuperAdmin(session.rbacRole) && session.rbacRole !== "ADVISOR") {
    if (session.rbacRole === "CORE_LEAD") {
      apps = db.applications.filter((a) =>
        session.supervisedWings.includes(a.preferredWing)
      );
    } else {
      apps = db.applications.filter((a) => a.preferredWing === session.wingId);
    }
  }

  return NextResponse.json({ applications: apps });
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = applicationSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ||
            "Name, email, university, and technical statement are required.",
        },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const app = createApplication({
      name: d.name,
      email: d.email,
      university: d.university,
      roleType: d.roleType,
      preferredWing: d.preferredWing || "technical",
      githubUsername: d.githubUsername || "",
      statement: d.statement,
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
      {
        error:
          "Unauthorized: Executive Council or Wing Directorate access required.",
      },
      { status: 403 }
    );
  }

  try {
    const raw = await req.json();
    const parsed = applicationReviewSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ||
            "Valid application ID and decision are required.",
        },
        { status: 400 }
      );
    }

    const db = readDb();
    const target = db.applications.find((a) => a.id === parsed.data.id);
    if (!target) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      );
    }

    if (!isSuperAdmin(session.rbacRole)) {
      const allowed =
        session.rbacRole === "CORE_LEAD"
          ? session.supervisedWings.includes(target.preferredWing)
          : target.preferredWing === session.wingId;
      if (!allowed) {
        return NextResponse.json(
          {
            error:
              "You may only review applications assigned to your wing supervision scope.",
          },
          { status: 403 }
        );
      }
    }

    const safeRole: PortalRole =
      isSuperAdmin(session.rbacRole) && parsed.data.assignedRole
        ? parsed.data.assignedRole
        : "APPROVED_MEMBER";

    const updated = reviewApplication({
      id: parsed.data.id,
      decision: parsed.data.decision,
      assignedWing: isSuperAdmin(session.rbacRole)
        ? parsed.data.assignedWing
        : target.preferredWing,
      assignedRole: safeRole,
      actorName: session.name,
      actorRole: session.rbacRole,
    });

    if (
      updated &&
      updated.status === "Approved" &&
      updated.generatedMemberId &&
      updated.generatedUsername
    ) {
      await sendOnboardingWelcomeEmail({
        email: updated.email,
        name: updated.name,
        memberId: updated.generatedMemberId,
        wingName: updated.preferredWing,
        username: updated.generatedUsername,
      });
    }

    return NextResponse.json({ application: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to review application." },
      { status: 400 }
    );
  }
}
