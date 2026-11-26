import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";
import { WINGS, EVENTS } from "@/data/axonData";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = readDb();
  return NextResponse.json({
    status: "operational",
    node: "IMAC-UET-LAHORE-01",
    directorates: WINGS.length,
    events: EVENTS.length,
    members: Object.keys(db.members).length,
    certificates: db.certificates.length,
    projects: db.projects.length,
    timestamp: new Date().toISOString(),
  });
}
