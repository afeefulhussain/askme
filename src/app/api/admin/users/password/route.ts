import { NextRequest, NextResponse } from "next/server";
import { canResetPasswords, getServerSession } from "@/lib/auth";
import { setMemberPasswordHash } from "@/lib/db";
import { adminPasswordResetSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const session = getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (!canResetPasswords(session.rbacRole)) {
    return NextResponse.json(
      {
        error:
          "Forbidden: Only the AXON President (SUPER_ADMIN) has authority to set or reset user passwords.",
      },
      { status: 403 }
    );
  }

  try {
    const raw = await req.json();
    const parsed = adminPasswordResetSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ||
            "Valid username and new password (min 8 chars) are required.",
        },
        { status: 400 }
      );
    }

    const updated = setMemberPasswordHash(
      parsed.data.username,
      parsed.data.newPassword,
      session.name,
      session.rbacRole
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Target member account was not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      member: updated,
      message: `Password updated for @${updated.username} (${updated.email}).`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to reset password." },
      { status: 400 }
    );
  }
}
