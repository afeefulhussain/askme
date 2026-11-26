import crypto from "crypto";
import { cookies } from "next/headers";
import type { SessionUser } from "@/lib/types";
export {
  canAccessDashboard,
  canSubmitProjects,
  canSubmitBlogs,
  canAccessAdmin,
  isSuperAdmin,
  formatRbacLabel,
} from "@/lib/rbac";

const SESSION_COOKIE_NAME = "axon_session";

function getSecret(): string {
  return (
    process.env.AXON_SESSION_SECRET ||
    "axon-imac-uet-lahore-dev-secret-change-in-production"
  );
}

export function signSession(user: SessionUser): string {
  const payload = Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): SessionUser | null {
  if (!token || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  const expectedSig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (
    sigBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(sigBuf, expectedBuf)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as SessionUser;
    if (!parsed.username || !parsed.rbacRole) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getServerSession(): SessionUser | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_OPTIONS = {
  name: SESSION_COOKIE_NAME,
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};
