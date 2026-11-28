import { NextRequest, NextResponse } from "next/server";
import { readDb, verifyCredentialQuery } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code") || "";
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
