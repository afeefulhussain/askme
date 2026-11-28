import { NextRequest, NextResponse } from "next/server";
import { canAccessAdmin, getServerSession, isSuperAdmin } from "@/lib/auth";
import {
  appendAuditLog,
  createWingTaskRecord,
  readDb,
  writeDb,
} from "@/lib/db";
import type { WingTask } from "@/lib/types";
import { taskCreateSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

function canManageWing(
  role: string,
  userWingId: string,
  supervisedWings: string[],
  targetWingId: string
): boolean {
  if (role === "SUPER_ADMIN") return true;
  if (role === "CORE_LEAD") return supervisedWings.includes(targetWingId);
  if (role === "DIRECTOR" || role === "CO_DIRECTOR") {
    return userWingId === targetWingId;
  }
  return false;
}

export async function GET() {
  const session = getServerSession();
  if (!session || !canAccessAdmin(session.rbacRole)) {
    return NextResponse.json(
      { error: "Unauthorized: Leadership access required." },
      { status: 403 }
    );
  }

  const db = readDb();
  let tasks = db.wingTasks;

  if (!isSuperAdmin(session.rbacRole) && session.rbacRole !== "ADVISOR") {
    if (session.rbacRole === "CORE_LEAD") {
      tasks = tasks.filter((t) => session.supervisedWings.includes(t.wingId));
    } else if (
      session.rbacRole === "DIRECTOR" ||
      session.rbacRole === "CO_DIRECTOR"
    ) {
      tasks = tasks.filter((t) => t.wingId === session.wingId);
    }
  }

  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const session = getServerSession();
  if (
    !session ||
    !canAccessAdmin(session.rbacRole) ||
    session.rbacRole === "CORE_AUDITOR" ||
    session.rbacRole === "ADVISOR"
  ) {
    return NextResponse.json(
      {
        error:
          "Access Denied: Only Super Admin, Core Leads, Directors, or Co-Directors may assign wing tasks.",
      },
      { status: 403 }
    );
  }

  try {
    const raw = await req.json();
    const parsed = taskCreateSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid task payload." },
        { status: 400 }
      );
    }

    const d = parsed.data;
    if (
      !canManageWing(
        session.rbacRole,
        session.wingId,
        session.supervisedWings,
        d.wingId
      )
    ) {
      return NextResponse.json(
        { error: "You may only create tasks for your assigned wing scope." },
        { status: 403 }
      );
    }

    const task = createWingTaskRecord(d);
    appendAuditLog(
      session.name,
      session.rbacRole,
      "WING_TASK_CREATED",
      `${d.wingId}: ${d.title}`
    );

    return NextResponse.json({ task }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create wing task." },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = getServerSession();
  if (!session || !canAccessAdmin(session.rbacRole)) {
    return NextResponse.json(
      { error: "Unauthorized: Leadership access required." },
      { status: 403 }
    );
  }

  try {
    const body = (await req.json()) as {
      id?: string;
      status?: WingTask["status"];
    };
    if (
      !body.id ||
      !body.status ||
      !["Planned", "In Progress", "Completed"].includes(body.status)
    ) {
      return NextResponse.json(
        { error: "Valid task ID and status are required." },
        { status: 400 }
      );
    }

    const db = readDb();
    const task = db.wingTasks.find((t) => t.id === body.id);
    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    if (
      !canManageWing(
        session.rbacRole,
        session.wingId,
        session.supervisedWings,
        task.wingId
      )
    ) {
      return NextResponse.json(
        { error: "You may only update tasks inside your assigned wing scope." },
        { status: 403 }
      );
    }

    task.status = body.status;
    writeDb(db);
    return NextResponse.json({ task });
  } catch {
    return NextResponse.json(
      { error: "Failed to update wing task." },
      { status: 400 }
    );
  }
}
