import { NextRequest, NextResponse } from "next/server";
import { canViewFinanceAndAudit, getServerSession } from "@/lib/auth";
import { moderateFinanceRecord, readDb } from "@/lib/db";
import { financeModerationSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getServerSession();
  if (!session || !canViewFinanceAndAudit(session.rbacRole)) {
    return NextResponse.json(
      { error: "Unauthorized: Finance Auditor or Executive access required." },
      { status: 403 }
    );
  }
  const db = readDb();
  return NextResponse.json({ financeRecords: db.financeRecords });
}

export async function PATCH(req: NextRequest) {
  const session = getServerSession();
  if (!session || !canViewFinanceAndAudit(session.rbacRole)) {
    return NextResponse.json(
      { error: "Unauthorized: Only Finance Auditor or Super Admin may update ledger status." },
      { status: 403 }
    );
  }

  try {
    const raw = await req.json();
    const parsed = financeModerationSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid finance record payload." },
        { status: 400 }
      );
    }

    const updated = moderateFinanceRecord(
      parsed.data.id,
      parsed.data.status,
      session.name,
      session.rbacRole
    );
    if (!updated) {
      return NextResponse.json({ error: "Finance record not found." }, { status: 404 });
    }

    return NextResponse.json({ record: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to update finance record." },
      { status: 400 }
    );
  }
}
