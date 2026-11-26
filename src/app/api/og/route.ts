import { NextRequest, NextResponse } from "next/server";
import { getMemberByUsername } from "@/lib/db";

export const dynamic = "force-dynamic";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username") || "irfan";
  const member = getMemberByUsername(username);

  const name = escapeXml(member?.name || "AXON Member Engineer");
  const headline = escapeXml(
    member?.headline || "Verified Member — AXON Umbrella Organization"
  );
  const memberId = escapeXml(member?.memberId || "AXN-2026");
  const wing = escapeXml(member?.wing || "IMAC, UET Lahore");
  const skills = escapeXml(
    member?.skills.languages.slice(0, 5).join("  •  ") || "Engineering"
  );
  const safeUser = escapeXml(member?.username || username);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" fill="none">
  <rect width="1200" height="630" fill="#0A0D14"/>
  <rect x="28" y="28" width="1144" height="574" rx="14" fill="#0D121D" stroke="#1E2738" stroke-width="3"/>
  <rect x="76" y="76" width="60" height="60" rx="8" fill="#0A0D14" stroke="#00F0FF" stroke-width="2"/>
  <text x="106" y="116" text-anchor="middle" fill="#00F0FF" font-family="monospace" font-weight="bold" font-size="26">AX</text>
  <text x="158" y="114" fill="#94A3B8" font-family="monospace" font-size="20">AXON VERIFIED PORTFOLIO // ${memberId}</text>
  <rect x="880" y="84" width="244" height="44" rx="6" fill="#10B981" fill-opacity="0.16" stroke="#10B981" stroke-width="1.5"/>
  <text x="1002" y="112" text-anchor="middle" fill="#10B981" font-family="monospace" font-weight="bold" font-size="16">VERIFIED CREDENTIAL</text>
  <text x="76" y="268" fill="#F8FAFC" font-family="Georgia, serif" font-weight="bold" font-size="60">${name}</text>
  <text x="76" y="332" fill="#00F0FF" font-family="sans-serif" font-size="28">${headline.slice(0, 68)}</text>
  <text x="76" y="384" fill="#94A3B8" font-family="monospace" font-size="22">${wing}</text>
  <line x1="76" y1="470" x2="1124" y2="470" stroke="#1E2738" stroke-width="2"/>
  <text x="76" y="532" fill="#CBD5E1" font-family="monospace" font-size="20">${skills}</text>
  <text x="1124" y="532" text-anchor="end" fill="#00F0FF" font-family="monospace" font-size="20">axon.org.pk/u/${safeUser}</text>
</svg>`;

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=300",
    },
  });
}
