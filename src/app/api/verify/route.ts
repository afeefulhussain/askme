import { NextRequest, NextResponse } from "next/server";
import { verifyCredentialQuery } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code") || "";
  if (!code.trim()) {
    return NextResponse.json(
      { error: "Verification code or Member ID is required." },
      { status: 400 }
    );
  }

  const record = verifyCredentialQuery(code);
  if (!record) {
    return NextResponse.json({ found: false, record: null }, { status: 404 });
  }

  return NextResponse.json({ found: true, record });
}
