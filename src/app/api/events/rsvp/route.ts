import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { createEventRsvpRecord, readDb } from "@/lib/db";
import { EVENTS } from "@/data/axonData";

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
    const body = (await req.json()) as {
      eventSlug?: string;
      name?: string;
      email?: string;
      university?: string;
    };

    const event = EVENTS.find((e) => e.slug === body.eventSlug);
    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    // Supports One-Click RSVP when authenticated (Blueprint Section 10)
    const name = session?.name || body.name?.trim() || "";
    const email = session?.email || body.email?.trim() || "";
    const university =
      (session ? "AXON Verified Member" : body.university?.trim()) || "UET Lahore";

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
