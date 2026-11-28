import { NextRequest, NextResponse } from "next/server";
import { canAccessAdmin, getServerSession } from "@/lib/auth";
import {
  addDirectorEndorsement,
  appendAuditLog,
  getMemberByUsername,
  readDb,
} from "@/lib/db";
import { endorsementSchema } from "@/lib/validation";

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
      {
        error:
          "Only Executive Council or Directorate leadership may award endorsements.",
      },
      { status: 403 }
    );
  }

  try {
    const raw = await req.json();
    const parsed = endorsementSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ||
            "Recipient, badge title, and note are required.",
        },
        { status: 400 }
      );
    }

    const recipient = getMemberByUsername(parsed.data.recipientUsername);
    if (!recipient) {
      return NextResponse.json(
        { error: "Target member not found." },
        { status: 404 }
      );
    }

    const issuer = getMemberByUsername(session.username);
    const endorsement = addDirectorEndorsement({
      recipientUsername: recipient.username,
      directorName: session.name,
      directorRole: issuer?.designation || "Directorate Lead",
      wingId: session.wingId,
      badgeTitle: parsed.data.badgeTitle,
      note: parsed.data.note,
    });

    appendAuditLog(
      session.name,
      session.rbacRole,
      "ENDORSEMENT_AWARDED",
      `${recipient.name}: ${parsed.data.badgeTitle}`
    );

    return NextResponse.json({ endorsement }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to award endorsement." },
      { status: 400 }
    );
  }
}
