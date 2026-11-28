import crypto from "crypto";
import { cookies } from "next/headers";
import type { SessionUser } from "@/lib/types";

export {
  canAccessDashboard,
  canSubmitProjects,
  canSubmitBlogs,
  canAccessAdmin,
  isSuperAdmin,
  canCreateEventProposal,
  canApproveEventsAndContent,
  canUploadCertificateCsv,
  canViewFinanceAndAudit,
  formatRbacLabel,
} from "@/lib/rbac";

const SESSION_COOKIE_NAME = "axon_session";

function getSecret(): string {
  return (
    process.env.AXON_SESSION_SECRET ||
    "axon-imac-uet-lahore-dev-secret-change-in-production"
  );
}

export function generateSixDigitOtp(): string {
  return String(crypto.randomInt(100000, 999999));
}

export function hashOtp(email: string, code: string): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(`${email.trim().toLowerCase()}:${code.trim()}`)
    .digest("hex");
}

export function verifyOtpHash(
  email: string,
  code: string,
  expectedHash: string
): boolean {
  const actual = Buffer.from(hashOtp(email, code));
  const expected = Buffer.from(expectedHash);
  return (
    actual.length === expected.length && crypto.timingSafeEqual(actual, expected)
  );
}

export function signSession(user: SessionUser): string {
  const payload = Buffer.from(JSON.stringify(user), "utf8").toString(
    "base64url"
  );
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(
  token: string | undefined
): SessionUser | null {
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
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};
