import { NextRequest, NextResponse } from "next/server";
import { canResetPasswords, getServerSession } from "@/lib/auth";
import { setMemberPasswordHash } from "@/lib/db";
import { adminPasswordResetSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

/**
 * Self-service password resets are strictly prohibited for regular members,
 * directors, co-directors, and core leads. Only SUPER_ADMIN is permitted.
 */
async function handlePasswordMutation(req: NextRequest) {
  const session = getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (!canResetPasswords(session.rbacRole)) {
    return NextResponse.json(
      {
        error:
          "Forbidden: Password changes and resets are locked to SUPER_ADMIN governance. Contact Afeef Ul Hussain (afeef@askme.pk).",
      },
      { status: 403 }
    );
  }

  try {
    const raw = await req.json();
    const parsed = adminPasswordResetSchema.safeParse({
      username: raw?.username || session.username,
      newPassword: raw?.newPassword,
    });
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ||
            "Valid target username and new password required.",
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
      return NextResponse.json({ error: "Member not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, member: updated });
  } catch {
    return NextResponse.json(
      { error: "Invalid password governance request." },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  return handlePasswordMutation(req);
}

export async function PATCH(req: NextRequest) {
  return handlePasswordMutation(req);
}
