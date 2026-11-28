import { NextRequest, NextResponse } from "next/server";
import {
  canAccessAdmin,
  canApproveEventsAndContent,
  canCreateEventProposal,
  getServerSession,
  isSuperAdmin,
} from "@/lib/auth";
import {
  appendAuditLog,
  createEventProposal,
  moderateEventRecord,
  readDb,
} from "@/lib/db";
import { eventCreateSchema, eventModerationSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = getServerSession();
  const scope = req.nextUrl.searchParams.get("scope");
  const db = readDb();

  if (scope === "all" && session && canAccessAdmin(session.rbacRole)) {
    const events = isSuperAdmin(session.rbacRole) || session.rbacRole === "ADVISOR"
      ? db.events
      : session.rbacRole === "CORE_LEAD"
      ? db.events.filter(
          (e) =>
            session.supervisedWings.includes(e.wingId) ||
            e.submittedBy === session.name
        )
      : db.events.filter((e) => e.wingId === session.wingId);
    return NextResponse.json({ events });
  }

  return NextResponse.json({
    events: db.events.filter(
      (e) => e.status !== "Pending Approval" && e.status !== "Rejected"
    ),
  });
}

export async function POST(req: NextRequest) {
  const session = getServerSession();
  if (!session || !canCreateEventProposal(session.rbacRole)) {
    return NextResponse.json(
      {
        error:
          "Access Denied: Only Core Team Leads, Advisor, or Super Admin may submit event proposals.",
      },
      { status: 403 }
    );
  }

  try {
    const raw = await req.json();
    const parsed = eventCreateSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid event proposal." },
        { status: 400 }
      );
    }

    const d = parsed.data;
    if (
      session.rbacRole === "CORE_LEAD" &&
      session.supervisedWings.length > 0 &&
      !session.supervisedWings.includes(d.wingId)
    ) {
      return NextResponse.json(
        {
          error:
            "Core Team Leads may only submit event proposals for their supervised wings.",
        },
        { status: 403 }
      );
    }

    const event = createEventProposal(
      session.name,
      {
        title: d.title,
        category: d.category,
        date: d.date,
        time: d.time,
        location: d.location,
        isVirtual: d.isVirtual,
        wingId: d.wingId,
        capacity: d.capacity,
        speakerName: d.speakerName,
        speakerTitle: d.speakerTitle,
        speakerOrg: d.speakerOrg,
        description: d.description,
        curriculum: d.curriculum,
      },
      false
    );

    appendAuditLog(
      session.name,
      session.rbacRole,
      "EVENT_PROPOSAL_SUBMITTED",
      `${event.title} (${event.status})`
    );

    return NextResponse.json({ event }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit event proposal." },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = getServerSession();
  if (!session || !canApproveEventsAndContent(session.rbacRole)) {
    return NextResponse.json(
      {
        error:
          "Access Denied: Only the Super Admin may approve or reject event proposals.",
      },
      { status: 403 }
    );
  }

  try {
    const raw = await req.json();
    const parsed = eventModerationSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid moderation payload." },
        { status: 400 }
      );
    }

    const updated = moderateEventRecord(
      parsed.data.id,
      parsed.data.status,
      session.name,
      session.rbacRole
    );
    if (!updated) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    return NextResponse.json({ event: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to moderate event proposal." },
      { status: 400 }
    );
  }
}
