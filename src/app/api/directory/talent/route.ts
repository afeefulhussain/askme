import { NextRequest, NextResponse } from "next/server";
import { queryTalentDirectory } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const q = params.get("q") || "";
  const wing = params.get("wing") || "all";
  const internshipOnly = params.get("internshipOnly") === "true";
  const page = Number(params.get("page") || "1") || 1;
  const limit = Number(params.get("limit") || "12") || 12;

  const result = queryTalentDirectory({
    q,
    wing,
    internshipOnly,
    page,
    limit,
  });

  return NextResponse.json(result);
}
