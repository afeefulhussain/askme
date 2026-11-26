import { NextRequest, NextResponse } from "next/server";
import { canAccessAdmin, getServerSession } from "@/lib/auth";
import {
  issueCertificateRecord,
  readDb,
  toggleCertificateStatus,
} from "@/lib/db";
import type { VerifiedCertificate } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getServerSession();
  const db = readDb();

  if (session && canAccessAdmin(session.rbacRole)) {
    return NextResponse.json({ certificates: db.certificates });
  }

  if (session) {
    return NextResponse.json({
      certificates: db.certificates.filter(
        (c) =>
          c.memberId === session.memberId ||
          c.recipientName.toLowerCase() === session.name.toLowerCase()
      ),
    });
  }

  return NextResponse.json(
    { error: "Authentication required." },
    { status: 401 }
  );
}

export async function POST(req: NextRequest) {
  const session = getServerSession();
  if (!session || !canAccessAdmin(session.rbacRole)) {
    return NextResponse.json(
      { error: "Unauthorized: Wing Director or Super Admin required." },
      { status: 403 }
    );
  }

  try {
    const body = (await req.json()) as {
      recipientName?: string;
      eventOrRole?: string;
      memberId?: string;
      type?: VerifiedCertificate["type"];
    };

    if (!body.recipientName?.trim() || !body.eventOrRole?.trim()) {
      return NextResponse.json(
        { error: "Recipient name and citation are required." },
        { status: 400 }
      );
    }

    const certificate = issueCertificateRecord({
      recipientName: body.recipientName,
      eventOrRole: body.eventOrRole,
      memberId: body.memberId,
      issuerAuthority:
        session.rbacRole === "super_admin"
          ? "AXON Executive Council & IMAC Directorate"
          : `${session.wing} Directorate`,
      type: body.type || "Technical Distinction",
    });

    return NextResponse.json({ certificate }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to issue certificate." },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = getServerSession();
  if (!session || !canAccessAdmin(session.rbacRole)) {
    return NextResponse.json(
      { error: "Unauthorized: Admin access required." },
      { status: 403 }
    );
  }

  try {
    const body = (await req.json()) as { certCode?: string };
    if (!body.certCode) {
      return NextResponse.json(
        { error: "Certificate code is required." },
        { status: 400 }
      );
    }

    const updated = toggleCertificateStatus(body.certCode);
    if (!updated) {
      return NextResponse.json(
        { error: "Certificate not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ certificate: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to update certificate status." },
      { status: 400 }
    );
  }
}
