import { NextRequest, NextResponse } from "next/server";
import {
  canAccessAdmin,
  canUploadCertificateCsv,
  getServerSession,
  isSuperAdmin,
} from "@/lib/auth";
import {
  appendAuditLog,
  issueCertificateRecord,
  readDb,
  toggleCertificateStatus,
} from "@/lib/db";
import { certificateCreateSchema } from "@/lib/validation";

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
  if (!session || !canUploadCertificateCsv(session.rbacRole, session.wingId)) {
    return NextResponse.json(
      {
        error:
          "Unauthorized: Only Technical Directorate leadership or Super Admin may issue credentials.",
      },
      { status: 403 }
    );
  }

  try {
    const raw = await req.json();
    const parsed = certificateCreateSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ||
            "Recipient name and citation are required.",
        },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const certificate = issueCertificateRecord({
      recipientName: d.recipientName,
      eventOrRole: d.eventOrRole,
      memberId: d.memberId,
      issueDate: d.issueDate,
      certCode: d.certCode,
      issuerAuthority: isSuperAdmin(session.rbacRole)
        ? "AXON Executive Council & IMAC Directorate"
        : "AXON Technical Directorate & Executive Council",
      type: d.type || "Technical Distinction",
    });

    appendAuditLog(
      session.name,
      session.rbacRole,
      "CERTIFICATE_ISSUED",
      `${certificate.certCode} -> ${certificate.recipientName}`
    );

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
  if (!session || !canUploadCertificateCsv(session.rbacRole, session.wingId)) {
    return NextResponse.json(
      {
        error:
          "Unauthorized: Technical Directorate leadership or Super Admin required.",
      },
      { status: 403 }
    );
  }

  try {
    const body = (await req.json()) as { certCode?: string };
    if (!body.certCode?.trim()) {
      return NextResponse.json(
        { error: "Certificate code is required." },
        { status: 400 }
      );
    }

    const updated = toggleCertificateStatus(
      body.certCode,
      session.name,
      session.rbacRole
    );
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
