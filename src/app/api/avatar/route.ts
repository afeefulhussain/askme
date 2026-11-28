import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sanitizeHexColor(raw: string | null): string {
  if (!raw) return "#00F0FF";
  return /^#[0-9a-fA-F]{6}$/.test(raw.trim()) ? raw.trim() : "#00F0FF";
}

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name") || "AXON Member";
  const id = req.nextUrl.searchParams.get("id") || "AXN-26";
  const accent = sanitizeHexColor(req.nextUrl.searchParams.get("accent"));

  const initials = escapeXml(
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AX"
  );
  const safeId = escapeXml(id.slice(0, 18));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240" fill="none">
  <rect width="240" height="240" rx="20" fill="#0A0D14"/>
  <rect x="8" y="8" width="224" height="224" rx="16" fill="#0D121D" stroke="#1E2738" stroke-width="2"/>
  <path d="M0 60 H240 M0 120 H240 M0 180 H240 M60 0 V240 M120 0 V240 M180 0 V240" stroke="#141C2B" stroke-width="1"/>
  <circle cx="120" cy="108" r="54" fill="#0A0D14" stroke="${accent}" stroke-width="2.5"/>
  <text x="120" y="123" text-anchor="middle" fill="#F8FAFC" font-family="Georgia, serif" font-weight="bold" font-size="42" letter-spacing="2">${initials}</text>
  <rect x="44" y="182" width="152" height="28" rx="6" fill="#0A0D14" stroke="#1E2738" stroke-width="1.5"/>
  <text x="120" y="200" text-anchor="middle" fill="${accent}" font-family="monospace" font-weight="bold" font-size="13" letter-spacing="1">${safeId}</text>
</svg>`;

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
