import { NextRequest, NextResponse } from "next/server";
import {
  canAccessAdmin,
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
import type { BlogPost } from "@/lib/types";

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
    const list = isSuperAdmin(session.rbacRole)
      ? db.blogs
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
    const body = (await req.json()) as {
      title?: string;
      summary?: string;
      content?: string;
      tags?: string[];
    };

    if (!body.title?.trim() || !body.summary?.trim() || !body.content?.trim()) {
      return NextResponse.json(
        { error: "Title, summary, and content are required." },
        { status: 400 }
      );
    }

    const post = createBlogDraft(member, {
      title: body.title,
      summary: body.summary,
      content: body.content,
      tags: body.tags || [],
    });

    return NextResponse.json({ blog: post }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to save blog draft." },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = getServerSession();
  if (!session || !canAccessAdmin(session.rbacRole)) {
    return NextResponse.json(
      { error: "Unauthorized: Wing Director or Super Admin access required." },
      { status: 403 }
    );
  }

  try {
    const body = (await req.json()) as {
      id?: string;
      status?: BlogPost["status"];
    };
    if (!body.id || !body.status) {
      return NextResponse.json(
        { error: "Blog ID and status are required." },
        { status: 400 }
      );
    }

    const updated = moderateBlogRecord(body.id, body.status);
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
