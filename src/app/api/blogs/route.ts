import { NextRequest, NextResponse } from "next/server";
import {
  canAccessAdmin,
  canApproveEventsAndContent,
  canSubmitBlogs,
  getServerSession,
  isSuperAdmin,
} from "@/lib/auth";
import {
  createBlogDraft,
  getMemberByUsername,
  moderateBlogRecord,
  readDb,
} from "@/lib/db";
import { blogCreateSchema, blogModerationSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = getServerSession();
  const scope = req.nextUrl.searchParams.get("scope");
  const db = readDb();

  if (scope === "mine" && session) {
    return NextResponse.json({
      blogs: db.blogs.filter((b) => b.author.username === session.username),
    });
  }

  if (scope === "all" && session && canAccessAdmin(session.rbacRole)) {
    const list =
      isSuperAdmin(session.rbacRole) || session.rbacRole === "ADVISOR"
        ? db.blogs
        : session.rbacRole === "CORE_LEAD"
        ? db.blogs.filter((b) => session.supervisedWings.includes(b.wingId))
        : db.blogs.filter((b) => b.wingId === session.wingId);
    return NextResponse.json({ blogs: list });
  }

  return NextResponse.json({
    blogs: db.blogs.filter((b) => b.status === "Published"),
  });
}

export async function POST(req: NextRequest) {
  const session = getServerSession();
  if (!session || !canSubmitBlogs(session.rbacRole)) {
    return NextResponse.json(
      { error: "Only approved AXON members may submit technical articles." },
      { status: 403 }
    );
  }

  const member = getMemberByUsername(session.username);
  if (!member) {
    return NextResponse.json({ error: "Member not found." }, { status: 404 });
  }

  try {
    const raw = await req.json();
    const parsed = blogCreateSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ||
            "Title, summary, and article content are required.",
        },
        { status: 400 }
      );
    }

    const post = createBlogDraft(member, {
      title: parsed.data.title,
      summary: parsed.data.summary,
      content: parsed.data.content,
      tags: parsed.data.tags,
    });

    return NextResponse.json({ blog: post }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit article for review." },
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
          "Access Denied: Only the Super Admin may approve or reject articles for publication.",
      },
      { status: 403 }
    );
  }

  try {
    const raw = await req.json();
    const parsed = blogModerationSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ||
            "Blog ID and valid moderation status are required.",
        },
        { status: 400 }
      );
    }

    const updated = moderateBlogRecord(
      parsed.data.id,
      parsed.data.status,
      session.name,
      session.rbacRole
    );
    if (!updated) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }
    return NextResponse.json({ blog: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to moderate article." },
      { status: 400 }
    );
  }
}
