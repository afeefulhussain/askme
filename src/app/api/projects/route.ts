import { NextRequest, NextResponse } from "next/server";
import {
  canAccessAdmin,
  canApproveEventsAndContent,
  canSubmitProjects,
  getServerSession,
  isSuperAdmin,
} from "@/lib/auth";
import {
  createProjectRecord,
  getMemberByUsername,
  moderateProjectRecord,
  paginateItems,
  queryProjects,
  readDb,
} from "@/lib/db";
import { fetchGitHubRepoMetadata } from "@/lib/github";
import { projectCreateSchema, projectModerationSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = getServerSession();
  const params = req.nextUrl.searchParams;
  const scope = params.get("scope");
  const q = params.get("q") || "";
  const wing = params.get("wing") || "all";
  const page = Number(params.get("page") || "1") || 1;
  const limit = Number(params.get("limit") || "12") || 12;
  const db = readDb();

  if (scope === "mine" && session) {
    return NextResponse.json({
      projects: db.projects.filter(
        (p) => p.author.username === session.username
      ),
    });
  }

  if (scope === "all" && session && canAccessAdmin(session.rbacRole)) {
    let list =
      isSuperAdmin(session.rbacRole) || session.rbacRole === "ADVISOR"
        ? db.projects
        : session.rbacRole === "CORE_LEAD"
        ? db.projects.filter((p) => session.supervisedWings.includes(p.wingId))
        : db.projects.filter((p) => p.wingId === session.wingId);

    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter((p) =>
        [p.title, p.author.name, p.primaryLanguage || ""]
          .join(" ")
          .toLowerCase()
          .includes(needle)
      );
    }
    const paged = paginateItems(list, page, limit);
    return NextResponse.json({
      projects: paged.items,
      total: paged.total,
      page: paged.page,
      totalPages: paged.totalPages,
    });
  }

  const paged = queryProjects({
    q,
    wing,
    includeUnapproved: false,
    page,
    limit,
  });

  return NextResponse.json({
    projects: paged.items,
    total: paged.total,
    page: paged.page,
    totalPages: paged.totalPages,
  });
}

export async function POST(req: NextRequest) {
  const session = getServerSession();
  if (!session || !canSubmitProjects(session.rbacRole)) {
    return NextResponse.json(
      {
        error:
          "Access Denied: Only authenticated, approved AXON members may submit projects.",
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
    const raw = await req.json();
    const parsed = projectCreateSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ||
            "GitHub repository URL is required.",
        },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const synced = await fetchGitHubRepoMetadata(d.githubRepo);
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
      title: d.title || `${synced.title}: ${synced.description.slice(0, 60)}`,
      summary: d.summary || synced.description,
      architecture:
        d.architecture ||
        `Repository ${synced.fullName} synced from GitHub (${synced.primaryLanguage}, ${synced.stars} stars).`,
      githubRepo: synced.htmlUrl,
      liveDemoUrl: d.liveDemoUrl || synced.homepage || undefined,
      coverImage: d.coverImage || undefined,
      techStack:
        d.techStack && d.techStack.length > 0 ? d.techStack : synced.languages,
      stars: synced.stars,
      forks: synced.forks,
      primaryLanguage: synced.primaryLanguage,
      wingId: d.wingId || member.wingId,
    });

    return NextResponse.json({ project, synced }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit project for Super Admin review." },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = getServerSession();
  if (!session || !canApproveEventsAndContent(session.rbacRole)) {
    return NextResponse.json(
      {
        error:
          "Access Denied: Only the Super Admin may approve or reject submitted projects.",
      },
      { status: 403 }
    );
  }

  try {
    const raw = await req.json();
    const parsed = projectModerationSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ||
            "Project ID and valid moderation status are required.",
        },
        { status: 400 }
      );
    }

    const updated = moderateProjectRecord(
      parsed.data.id,
      parsed.data.status,
      session.name,
      session.rbacRole
    );
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
