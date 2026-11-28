import { NextRequest, NextResponse } from "next/server";
import { canAccessAdmin, getServerSession } from "@/lib/auth";
import { listBackgroundJobs } from "@/lib/jobs";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = getServerSession();
  if (!session || !canAccessAdmin(session.rbacRole)) {
    return NextResponse.json(
      { error: "Unauthorized: Leadership access required." },
      { status: 403 }
    );
  }

  const limit = Number(req.nextUrl.searchParams.get("limit") || "20") || 20;
  return NextResponse.json({ jobs: listBackgroundJobs(Math.min(50, limit)) });
}
