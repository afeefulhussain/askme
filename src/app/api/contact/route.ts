import { NextRequest, NextResponse } from "next/server";
import { canAccessAdmin, getServerSession } from "@/lib/auth";
import { createInquiryRecord, readDb } from "@/lib/db";
import { sendContactRoutingEmail } from "@/lib/email";
import { contactSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getServerSession();
  if (!session || !canAccessAdmin(session.rbacRole)) {
    return NextResponse.json(
      { error: "Unauthorized: Leadership access required." },
      { status: 403 }
    );
  }
  const db = readDb();
  return NextResponse.json({ inquiries: db.inquiries });
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ||
            "Name, valid email, and message are required.",
        },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const inquiry = createInquiryRecord({
      name: d.name,
      organization: d.organization,
      email: d.email,
      subject: d.subject,
      message: d.message,
    });

    const emailResult = await sendContactRoutingEmail({
      name: d.name,
      organization: d.organization,
      email: d.email,
      subject: d.subject,
      message: d.message,
    });

    return NextResponse.json(
      { inquiry, routedVia: emailResult.provider },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to dispatch inquiry." },
      { status: 400 }
    );
  }
}
