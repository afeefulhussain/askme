import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { getMemberByUsername } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getServerSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null, member: null });
  }
  const member = getMemberByUsername(session.username);
  return NextResponse.json({
    authenticated: true,
    user: session,
    member,
  });
}
