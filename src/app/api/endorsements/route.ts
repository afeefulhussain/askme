import { NextRequest, NextResponse } from "next/server";
import { canAccessAdmin, getServerSession } from "@/lib/auth";
import { addDirectorEndorsement, getMemberByUsername, readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  const db = readDb();

  if (username) {
    return NextResponse.json({
      endorsements: db.endorsements.filter(
        (e) => e.recipientUsername.toLowerCase() === username.toLowerCase()
      ),
    });
  }

  return NextResponse.json({ endorsements: db.endorsements });
}

export async function POST(req: NextRequest) {
  const session = getServerSession();
  if (!session || !canAccessAdmin(session.rbacRole)) {
    return NextResponse.json(
      { error: "Only Wing Directors or Executive Council may award endorsements." },
      { status: 403 }
    );
  }

  try {
    const body = (await req.json()) as {
      recipientUsername?: string;
      badgeTitle?: string;
      note?: string;
    };

    if (!body.recipientUsername || !body.badgeTitle?.trim() || !body.note?.trim()) {
      return NextResponse.json(
        { error: "Recipient, badge title, and endorsement note are required." },
        { status: 400 }
      );
    }

    const recipient = getMemberByUsername(body.recipientUsername);
    if (!recipient) {
      return NextResponse.json(
        { error: "Target member not found." },
        { status: 404 }
      );
    }

    const director = getMemberByUsername(session.username);
    const endorsement = addDirectorEndorsement({
      recipientUsername: recipient.username,
      directorName: session.name,
      directorRole: director?.role || "Directorate Lead",
      wingId: session.wingId,
      badgeTitle: body.badgeTitle,
      note: body.note,
    });

    return NextResponse.json({ endorsement }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to award endorsement." },
      { status: 400 }
    );
  }
}
