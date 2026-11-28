import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { createEventRsvpRecord, readDb } from "@/lib/db";
import { rsvpSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const session = getServerSession();
  const db = readDb();

  const rsvps = slug ? db.rsvps.filter((r) => r.eventSlug === slug) : db.rsvps;
  const userRegistered =
    Boolean(slug && session) &&
    rsvps.some(
      (r) => r.email.toLowerCase() === session?.email.toLowerCase()
    );

  return NextResponse.json({
    count: rsvps.length,
    userRegistered,
    rsvps: rsvps.map((r) => ({
      id: r.id,
      eventSlug: r.eventSlug,
      name: r.name,
      university: r.university,
      createdAt: r.createdAt,
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = getServerSession();
  try {
    const raw = await req.json();
    const parsed = rsvpSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid RSVP payload." },
        { status: 400 }
      );
    }

    const db = readDb();
    const event = db.events.find(
      (e) =>
        e.slug === parsed.data.eventSlug &&
        e.status !== "Pending Approval" &&
        e.status !== "Rejected"
    );
    if (!event) {
      return NextResponse.json(
        { error: "Public event not found or awaiting approval." },
        { status: 404 }
      );
    }

    const name = session?.name || parsed.data.name?.trim() || "";
    const email = session?.email || parsed.data.email?.trim() || "";
    const university =
      (session ? "AXON Verified Member" : parsed.data.university?.trim()) ||
      "UET Lahore";

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required to reserve a seat." },
        { status: 400 }
      );
    }

    const result = createEventRsvpRecord({
      eventSlug: event.slug,
      eventTitle: event.title,
      name,
      email,
      university,
      memberId: session?.memberId,
    });

    return NextResponse.json(result, {
      status: result.alreadyRegistered ? 200 : 201,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process event RSVP." },
      { status: 400 }
    );
  }
}
