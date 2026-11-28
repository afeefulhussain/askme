import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";
import { WINGS } from "@/data/axonData";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = readDb();
  return NextResponse.json({
    status: "operational",
    domain: "https://askme.pk",
    node: "IMAC-UET-LAHORE-01",
    directorates: WINGS.length,
    events: db.events.filter(
      (e) => e.status !== "Pending Approval" && e.status !== "Rejected"
    ).length,
    members: Object.keys(db.members).length,
    certificates: db.certificates.length,
    projects: db.projects.length,
    supabaseConfigured: isSupabaseConfigured(),
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
    timestamp: new Date().toISOString(),
  });
}
