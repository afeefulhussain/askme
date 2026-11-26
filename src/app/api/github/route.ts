import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubRepoMetadata } from "@/lib/github";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url") || "";
  if (!url.trim()) {
    return NextResponse.json(
      { error: "GitHub repository URL parameter 'url' is required." },
      { status: 400 }
    );
  }

  const metadata = await fetchGitHubRepoMetadata(url);
  if (!metadata) {
    return NextResponse.json(
      { error: "Invalid GitHub repository format. Expected github.com/owner/repo" },
      { status: 400 }
    );
  }

  return NextResponse.json({ metadata });
}
