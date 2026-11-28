import { NextRequest, NextResponse } from "next/server";
import { canUploadCertificateCsv, getServerSession } from "@/lib/auth";
import { enqueueBulkCertificateImportJob } from "@/lib/jobs";
import type { VerifiedCertificate } from "@/lib/types";

export const dynamic = "force-dynamic";

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  cells.push(current.trim());
  return cells;
}

const VALID_CERT_TYPES = new Set<VerifiedCertificate["type"]>([
  "Leadership Appointment",
  "Workshop Speaker",
  "Technical Distinction",
  "Hackathon Winner",
  "Event Attendance",
]);

export async function GET() {
  const session = getServerSession();
  if (!session || !canUploadCertificateCsv(session.rbacRole, session.wingId)) {
    return NextResponse.json(
      {
        error:
          "Access Denied: Technical Wing leadership or Super Admin required for CSV template.",
      },
      { status: 403 }
    );
  }

  const csvTemplate = [
    "recipientName,eventOrRole,issueDate,certCode,type,memberId",
    '"Muhammad Ali","AXON Systems Workshop Attendance","2026-11-20","AXN-CERT-9501","Event Attendance",""',
    '"Sara Khan","National Embedded Hackathon Finalist","2026-11-20","AXN-CERT-9502","Technical Distinction",""',
  ].join("\n");

  return new NextResponse(csvTemplate, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="axon-certificates-template.csv"',
    },
  });
}

export async function POST(req: NextRequest) {
  const session = getServerSession();
  if (!session || !canUploadCertificateCsv(session.rbacRole, session.wingId)) {
    return NextResponse.json(
      {
        error:
          "Access Denied: Only the Technical Wing Director/Co-Director or Super Admin may bulk upload CSV certificates.",
      },
      { status: 403 }
    );
  }

  try {
    let csvText = "";
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json(
          { error: "CSV file is required." },
          { status: 400 }
        );
      }
      csvText = await file.text();
    } else {
      const body = (await req.json()) as { csvText?: string };
      csvText = body.csvText || "";
    }

    const lines = csvText
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      return NextResponse.json(
        { error: "CSV must contain a header row and at least one data row." },
        { status: 400 }
      );
    }

    const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
    const idxName = headers.findIndex((h) =>
      ["recipientname", "recipient_name", "name"].includes(h)
    );
    const idxRole = headers.findIndex((h) =>
      ["eventorrole", "event_or_role", "event", "role", "citation"].includes(h)
    );
    const idxDate = headers.findIndex((h) =>
      ["issuedate", "issue_date", "date"].includes(h)
    );
    const idxCode = headers.findIndex((h) =>
      ["certcode", "cert_code", "serial", "serialid"].includes(h)
    );
    const idxType = headers.findIndex((h) => h === "type");
    const idxMember = headers.findIndex((h) =>
      ["memberid", "member_id"].includes(h)
    );

    if (idxName < 0 || idxRole < 0) {
      return NextResponse.json(
        {
          error:
            "CSV header must include 'recipientName' and 'eventOrRole' columns.",
        },
        { status: 400 }
      );
    }

    const rows: Array<{
      recipientName: string;
      eventOrRole: string;
      issueDate?: string;
      certCode?: string;
      memberId?: string;
      type?: VerifiedCertificate["type"];
    }> = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCsvLine(lines[i]);
      const recipientName = cols[idxName] || "";
      const eventOrRole = cols[idxRole] || "";
      if (!recipientName || !eventOrRole) continue;

      const rawType = idxType >= 0 ? cols[idxType] : "";
      const certType = VALID_CERT_TYPES.has(
        rawType as VerifiedCertificate["type"]
      )
        ? (rawType as VerifiedCertificate["type"])
        : "Event Attendance";

      rows.push({
        recipientName,
        eventOrRole,
        issueDate: idxDate >= 0 ? cols[idxDate] : undefined,
        certCode: idxCode >= 0 ? cols[idxCode] : undefined,
        memberId: idxMember >= 0 ? cols[idxMember] : undefined,
        type: certType,
      });
    }

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "No valid certificate rows were found in the CSV." },
        { status: 400 }
      );
    }

    const { job, previewCount } = enqueueBulkCertificateImportJob(
      rows,
      session.name,
      session.rbacRole
    );

    return NextResponse.json(
      {
        queued: true,
        count: previewCount,
        job,
        message: `Queued ${previewCount} certificate records for background processing (${job.id}).`,
      },
      { status: 202 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to parse certificate CSV upload." },
      { status: 400 }
    );
  }
}
