import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Engineering Insights & Publications",
  description:
    "Peer-reviewed engineering monographs, distributed systems research, and technical tutorials authored by AXON engineers at IMAC UET Lahore.",
  alternates: { canonical: "https://askme.pk/blogs" },
};

export default function BlogsPage() {
  const db = readDb();
  const publishedBlogs = db.blogs.filter((b) => b.status === "Published");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl border-b border-void-border pb-12 mb-12">
        <div className="text-xs font-mono uppercase tracking-widest text-cyan-axon mb-3">
          TECHNICAL PUBLICATIONS // RESEARCH ESSAYS
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight">
          AXON Engineering Monographs & Technical Insights
        </h1>
        <p className="mt-6 text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
          In-depth technical papers, architecture retrospectives, and systems
          programming tutorials authored by AXON research fellows and
          directorate leads.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {publishedBlogs.map((post) => (
          <article
            key={post.id}
            className="p-8 rounded-xl bg-void-card border border-void-border hover:border-slate-600 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 font-mono text-xs text-slate-400 mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-axon" />
                  <span>{post.publishedAt}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <h2 className="font-serif text-2xl font-bold text-white mb-3 hover:text-cyan-axon transition-colors">
                <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
              </h2>

              <p className="text-sm text-slate-300 font-sans leading-relaxed mb-6">
                {post.summary}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded bg-void-subtle border border-void-border font-mono text-[11px] text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-void-border/70 flex items-center justify-between font-mono text-xs">
              <Link
                href={`/u/${post.author.username}`}
                className="text-slate-300 hover:text-white"
              >
                By {post.author.name}
              </Link>

              <Link
                href={`/blogs/${post.slug}`}
                className="text-cyan-axon hover:underline flex items-center gap-1"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
