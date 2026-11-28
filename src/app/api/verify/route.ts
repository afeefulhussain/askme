import { NextRequest, NextResponse } from "next/server";
import {
  queryCertificates,
  readDb,
  verifyCredentialQuery,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const code = params.get("code") || "";

  // Server-side paginated directory/registry search (?q=&type=&status=&page=&limit=)
  if (!code.trim() && (params.has("q") || params.has("page") || params.has("limit"))) {
    const q = params.get("q") || "";
    const type = params.get("type") || "all";
    const status = params.get("status") || "all";
    const page = Number(params.get("page") || "1") || 1;
    const limit = Number(params.get("limit") || "12") || 12;

    const paged = queryCertificates({ q, type, status, page, limit });
    return NextResponse.json({
      found: paged.items.length > 0,
      matches: paged.items,
      total: paged.total,
      page: paged.page,
      limit: paged.limit,
      totalPages: paged.totalPages,
    });
  }

  if (!code.trim()) {
    return NextResponse.json(
      { error: "Verification serial code, Member ID, or name is required." },
      { status: 400 }
    );
  }

  const clean = code.trim().toUpperCase();
  const db = readDb();
  const matches = db.certificates.filter(
    (c) =>
      c.certCode.toUpperCase() === clean ||
      (c.memberId && c.memberId.toUpperCase() === clean) ||
      c.recipientName.toUpperCase().includes(clean)
  );

  const record = matches[0] || verifyCredentialQuery(code);
  if (!record) {
    return NextResponse.json(
      { found: false, record: null, matches: [] },
      { status: 404 }
    );
  }

  return NextResponse.json({
    found: true,
    record,
    matches: matches.length > 0 ? matches : [record],
  });
}
