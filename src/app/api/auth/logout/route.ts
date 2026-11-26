import { NextResponse } from "next/server";
import { SESSION_COOKIE_OPTIONS } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_OPTIONS.name, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}
