import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { readDb } from "@/lib/db";
import MarkdownArticle from "@/components/MarkdownArticle";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const db = readDb();
  const post = db.blogs.find(
    (b) => b.slug === params.slug && b.status === "Published"
  );
  if (!post) return { title: "Article Not Found" };
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `https://askme.pk/blogs/${post.slug}` },
  };
}

export default function BlogDetailPage({ params }: PageProps) {
  const db = readDb();
  const post = db.blogs.find(
    (b) => b.slug === params.slug && b.status === "Published"
  );

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link
        href="/blogs"
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-axon mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Publications Index</span>
      </Link>

      <div className="border-b border-void-border pb-8 mb-10">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-slate-400 mb-4">
          <span className="text-cyan-axon font-semibold">
            ENGINEERING MONOGRAPH
          </span>
          <span className="text-slate-600">/</span>
          <span>{post.publishedAt}</span>
          <span className="text-slate-600">•</span>
          <span>{post.readTime}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight">
          {post.title}
        </h1>

        <div className="mt-6 pt-4 border-t border-void-border/60 flex items-center gap-3 font-mono text-xs">
          <Link
            href={`/u/${post.author.username}`}
            className="flex items-center gap-2 text-white hover:text-cyan-axon"
          >
            <span className="font-semibold">{post.author.name}</span>
            <span className="text-slate-500">({post.author.role})</span>
          </Link>
        </div>
      </div>

      <p className="text-lg text-slate-200 font-serif italic border-l-2 border-cyan-axon pl-4 py-1 mb-8">
        {post.summary}
      </p>

      <MarkdownArticle content={post.content} />

      <div className="mt-16 pt-8 border-t border-void-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs bg-void-card p-6 rounded-xl">
        <div>
          <div className="text-[10px] text-slate-400 uppercase">
            PUBLISHED UNDER AXON CHARTER
          </div>
          <div className="font-serif text-base font-bold text-white mt-0.5">
            {post.author.name}
          </div>
          <div className="text-slate-400 text-[11px]">{post.author.role}</div>
        </div>

        <Link
          href={`/u/${post.author.username}`}
          className="px-4 py-2 bg-void-subtle border border-void-border hover:border-cyan-axon text-cyan-axon rounded transition-colors"
        >
          View Author Portfolio & Projects
        </Link>
      </div>
    </article>
  );
}
