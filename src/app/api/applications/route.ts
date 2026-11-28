import { NextRequest, NextResponse } from "next/server";
import {
  canAccessAdmin,
  canApproveApplications,
  getServerSession,
  isSuperAdmin,
} from "@/lib/auth";
import {
  createApplication,
  paginateItems,
  readDb,
  reviewApplication,
} from "@/lib/db";
import { sendOnboardingWelcomeEmail } from "@/lib/email";
import { enqueueEmailDispatchJob } from "@/lib/jobs";
import type { PortalRole } from "@/lib/types";
import { applicationReviewSchema, applicationSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = getServerSession();
  if (!session || !canAccessAdmin(session.rbacRole)) {
    return NextResponse.json(
      { error: "Unauthorized: Leadership access required." },
      { status: 403 }
    );
  }

  const params = req.nextUrl.searchParams;
  const q = (params.get("q") || "").trim().toLowerCase();
  const status = (params.get("status") || "all").trim().toLowerCase();
  const page = Number(params.get("page") || "1") || 1;
  const limit = Number(params.get("limit") || "10") || 10;

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

  if (status !== "all") {
    apps = apps.filter((a) => a.status.toLowerCase() === status);
  }
  if (q) {
    apps = apps.filter((a) =>
      [a.name, a.email, a.university, a.preferredWing, a.rollNumber || "", a.department || ""]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }

  const paged = paginateItems(apps, page, limit);
  return NextResponse.json({
    applications: paged.items,
    total: paged.total,
    page: paged.page,
    limit: paged.limit,
    totalPages: paged.totalPages,
  });
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
      rollNumber: d.rollNumber,
      department: d.department,
      university: d.university,
      roleType: d.roleType,
      preferredWing: d.preferredWing || "technical",
      githubUsername: d.githubUsername || "",
      linkedin: d.linkedin,
      avatarUrl: d.avatarUrl,
      skillsInput: d.skillsInput,
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
  if (!session || !canApproveApplications(session.rbacRole)) {
    return NextResponse.json(
      {
        error:
          "Access Denied: All membership approvals and official wing/role appointments are routed exclusively to the Super Admin (President).",
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

    const safeRole: PortalRole = parsed.data.assignedRole || "APPROVED_MEMBER";

    const updated = reviewApplication({
      id: parsed.data.id,
      decision: parsed.data.decision,
      assignedWing: parsed.data.assignedWing || target.preferredWing,
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
      const issuedPassword = updated.issuedInitialPassword;
      enqueueEmailDispatchJob(
        `Welcome email -> ${updated.email} (${updated.generatedMemberId})`,
        () =>
          sendOnboardingWelcomeEmail({
            email: updated.email,
            name: updated.name,
            memberId: updated.generatedMemberId!,
            wingName: updated.preferredWing,
            username: updated.generatedUsername!,
            initialPassword: issuedPassword,
          })
      );
    }

    return NextResponse.json({ application: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to review application." },
      { status: 400 }
    );
  }
}
