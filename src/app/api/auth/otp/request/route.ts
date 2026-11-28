import { NextRequest, NextResponse } from "next/server";
import { generateSixDigitOtp, hashOtp } from "@/lib/auth";
import { findMemberByEmail, saveOtpChallenge } from "@/lib/db";
import { sendOtpEmail } from "@/lib/email";
import { otpRequestSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = otpRequestSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Valid email is required." },
        { status: 400 }
      );
    }

    const cleanEmail = parsed.data.email.toLowerCase();
    const member = findMemberByEmail(cleanEmail);
    if (!member) {
      return NextResponse.json(
        {
          error:
            "No AXON member or pending application was found for that email. Apply at /join first.",
        },
        { status: 404 }
      );
    }

    const code = generateSixDigitOtp();
    const codeHash = hashOtp(cleanEmail, code);
    saveOtpChallenge(cleanEmail, codeHash);

    const emailResult = await sendOtpEmail(cleanEmail, code);
    const showDevPreview = !process.env.RESEND_API_KEY;

    return NextResponse.json({
      ok: true,
      email: cleanEmail,
      recipientName: member.name,
      role: member.rbacRole,
      sentVia: emailResult.provider,
      ...(showDevPreview ? { devOtpPreview: code } : {}),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to dispatch verification code." },
      { status: 400 }
    );
  }
}
