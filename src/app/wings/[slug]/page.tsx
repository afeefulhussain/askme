import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Calendar, Github, Star } from "lucide-react";
import { EVENTS, WINGS } from "@/data/axonData";
import { readDb } from "@/lib/db";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return WINGS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const wing = WINGS.find((w) => w.slug === params.slug);
  if (!wing) return { title: "Directorate Not Found" };
  return {
    title: wing.name,
    description: `${wing.tagline} ${wing.mandate}`,
    alternates: { canonical: `https://axon.org.pk/wings/${wing.slug}` },
  };
}

export default function WingDetailPage({ params }: PageProps) {
  const wing = WINGS.find((w) => w.slug === params.slug);
  if (!wing) notFound();

  const db = readDb();
  const wingProjects = db.projects.filter(
    (p) => p.wingId === wing.id && p.status === "Verified & Active"
  );
  const wingEvents = EVENTS.filter((e) => e.wingId === wing.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link
        href="/wings"
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-axon mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to 11 Directorates Index</span>
      </Link>

      <div className="border-b border-void-border pb-8 mb-10">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs mb-4">
          <span className="px-2.5 py-0.5 rounded bg-void-card border border-void-border text-cyan-axon font-bold">
            {wing.code}
          </span>
          <span className="text-circuit-green uppercase font-semibold">
            STATUS: {wing.status}
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">
            {wing.initiativesCount} Active Initiatives
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight">
          {wing.name}
        </h1>
        <p className="mt-3 font-mono text-sm text-cyan-axon">{wing.tagline}</p>
        <p className="mt-4 text-base text-slate-300 font-sans leading-relaxed max-w-3xl">
          {wing.mandate}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4 font-mono text-xs">
          <Link
            href={`/join?wing=${wing.id}`}
            className="px-6 py-3 bg-cyan-axon text-void-500 font-bold uppercase rounded hover:bg-cyan-300 transition-colors flex items-center gap-2"
          >
            <span>Apply to Join {wing.code}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href={`/u/${wing.leadUsername}`}
            className="px-5 py-3 bg-void-card border border-void-border text-slate-200 hover:border-cyan-axon rounded transition-colors"
          >
            Director: {wing.lead} →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 font-mono text-xs">
        <div className="p-6 rounded-xl bg-void-card border border-void-border">
          <h2 className="text-white uppercase text-[11px] font-bold mb-3">
            Technical Focus & Research Pillars
          </h2>
          <div className="flex flex-wrap gap-2">
            {wing.focus.map((f) => (
              <span
                key={f}
                className="px-3 py-1 bg-void-400 border border-void-border text-slate-200 rounded"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-void-card border border-void-border">
          <h2 className="text-white uppercase text-[11px] font-bold mb-3">
            Approved Engineering Toolchains
          </h2>
          <div className="flex flex-wrap gap-2">
            {wing.tools.map((t) => (
              <span
                key={t}
                className="px-3 py-1 bg-void-subtle border border-void-border text-cyan-axon rounded"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {wingProjects.length > 0 && (
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-white mb-4">
            Verified Directorate Repositories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wingProjects.map((p) => (
              <div
                key={p.id}
                className="p-6 rounded-xl bg-void-card border border-void-border flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between font-mono text-xs text-slate-400 mb-2">
                    <span>{p.author.name}</span>
                    <span className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-3.5 h-3.5" />
                      {p.stars}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2">
                    <Link
                      href={`/projects/${p.slug}`}
                      className="hover:text-cyan-axon"
                    >
                      {p.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-300 font-sans mb-4">
                    {p.summary}
                  </p>
                </div>
                <a
                  href={p.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-cyan-axon hover:underline inline-flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Inspect on GitHub</span>
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {wingEvents.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl font-bold text-white mb-4">
            Directorate Workshops & Symposia
          </h2>
          <div className="space-y-4">
            {wingEvents.map((e) => (
              <Link
                key={e.id}
                href={`/events/${e.slug}`}
                className="block p-5 rounded-xl bg-void-card border border-void-border hover:border-cyan-axon/50 transition-colors"
              >
                <div className="flex items-center justify-between font-mono text-xs text-slate-400 mb-1">
                  <span className="text-circuit-green">{e.status}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-axon" />
                    {e.date}
                  </span>
                </div>
                <div className="font-serif text-lg font-bold text-white">
                  {e.title}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
