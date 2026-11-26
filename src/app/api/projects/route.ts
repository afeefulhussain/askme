import { NextRequest, NextResponse } from "next/server";
import {
  canAccessAdmin,
  canSubmitProjects,
  getServerSession,
  isSuperAdmin,
} from "@/lib/auth";
import {
  createProjectRecord,
  getMemberByUsername,
  moderateProjectRecord,
  readDb,
} from "@/lib/db";
import { fetchGitHubRepoMetadata } from "@/lib/github";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = getServerSession();
  const scope = req.nextUrl.searchParams.get("scope");
  const db = readDb();

  if (scope === "mine" && session) {
    return NextResponse.json({
      projects: db.projects.filter(
        (p) => p.author.username === session.username
      ),
    });
  }

  if (scope === "all" && session && canAccessAdmin(session.rbacRole)) {
    const list = isSuperAdmin(session.rbacRole)
      ? db.projects
      : db.projects.filter((p) => p.wingId === session.wingId);
    return NextResponse.json({ projects: list });
  }

  return NextResponse.json({
    projects: db.projects.filter((p) => p.status === "Verified & Active"),
  });
}

export async function POST(req: NextRequest) {
  const session = getServerSession();
  if (!session || !canSubmitProjects(session.rbacRole)) {
    return NextResponse.json(
      {
        error:
          "Access Denied: Only authenticated, admin-approved AXON members may link GitHub repositories.",
      },
      { status: 403 }
    );
  }

  const member = getMemberByUsername(session.username);
  if (!member) {
    return NextResponse.json(
      { error: "Member profile not found." },
      { status: 404 }
    );
  }

  try {
    const body = (await req.json()) as {
      githubRepo?: string;
      title?: string;
      summary?: string;
      architecture?: string;
      liveDemoUrl?: string;
      wingId?: string;
      techStack?: string[];
    };

    if (!body.githubRepo?.trim()) {
      return NextResponse.json(
        { error: "GitHub repository URL is required." },
        { status: 400 }
      );
    }

    const synced = await fetchGitHubRepoMetadata(body.githubRepo);
    if (!synced) {
      return NextResponse.json(
        {
          error:
            "Invalid GitHub repository URL. Format: https://github.com/owner/repo",
        },
        { status: 400 }
      );
    }

    const project = createProjectRecord(member, {
      title: body.title?.trim() || `${synced.title}: ${synced.description.slice(0, 60)}`,
      summary: body.summary?.trim() || synced.description,
      architecture:
        body.architecture?.trim() ||
        `Repository ${synced.fullName} synced via GitHub REST API (${synced.primaryLanguage}, ${synced.stars} stars).`,
      githubRepo: synced.htmlUrl,
      liveDemoUrl: body.liveDemoUrl?.trim() || synced.homepage || undefined,
      techStack:
        body.techStack && body.techStack.length > 0
          ? body.techStack
          : synced.languages,
      stars: synced.stars,
      forks: synced.forks,
      primaryLanguage: synced.primaryLanguage,
      wingId: body.wingId || member.wingId,
    });

    return NextResponse.json({ project, synced }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to sync and publish project." },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = getServerSession();
  if (!session || !canAccessAdmin(session.rbacRole)) {
    return NextResponse.json(
      { error: "Unauthorized: Wing Director or Super Admin required." },
      { status: 403 }
    );
  }

  try {
    const body = (await req.json()) as {
      id?: string;
      status?: Project["status"];
    };
    if (!body.id || !body.status) {
      return NextResponse.json(
        { error: "Project ID and status are required." },
        { status: 400 }
      );
    }

    const updated = moderateProjectRecord(body.id, body.status);
    if (!updated) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }
    return NextResponse.json({ project: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to moderate project." },
      { status: 400 }
    );
  }
}
