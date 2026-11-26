import { NextRequest, NextResponse } from "next/server";
import { canAccessAdmin, getServerSession } from "@/lib/auth";
import { createInquiryRecord, readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getServerSession();
  if (!session || !canAccessAdmin(session.rbacRole)) {
    return NextResponse.json(
      { error: "Unauthorized: Admin access required." },
      { status: 403 }
    );
  }
  const db = readDb();
  return NextResponse.json({ inquiries: db.inquiries });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name?: string;
      organization?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const inquiry = createInquiryRecord({
      name: body.name,
      organization: body.organization || "Independent",
      email: body.email,
      subject: body.subject || "General Inquiry",
      message: body.message,
    });

    return NextResponse.json({ inquiry }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to dispatch inquiry." },
      { status: 400 }
    );
  }
}
