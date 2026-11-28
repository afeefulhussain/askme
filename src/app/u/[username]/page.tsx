import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Star,
  GitFork,
  CheckCircle2,
  BadgeCheck,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { getMemberByUsername, readDb } from "@/lib/db";
import { fetchGitHubUserSummary } from "@/lib/github";
import PortfolioActions from "@/components/PortfolioActions";
import type { PortfolioTheme } from "@/lib/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    username: string;
  };
}

const THEME_ACCENTS: Record<
  PortfolioTheme,
  { border: string; accentText: string; badgeBg: string }
> = {
  "obsidian-cyan": {
    border: "border-cyan-axon/30",
    accentText: "text-cyan-axon",
    badgeBg: "bg-cyan-axon/10 border-cyan-axon/40 text-cyan-axon",
  },
  "imac-emerald": {
    border: "border-circuit-green/40",
    accentText: "text-circuit-green",
    badgeBg: "bg-circuit-green/10 border-circuit-green/40 text-circuit-green",
  },
  "editorial-slate": {
    border: "border-slate-500/40",
    accentText: "text-slate-200",
    badgeBg: "bg-slate-700/30 border-slate-500/50 text-slate-200",
  },
  "monolith-amber": {
    border: "border-amber-500/40",
    accentText: "text-amber-400",
    badgeBg: "bg-amber-500/10 border-amber-500/40 text-amber-400",
  },
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const member = getMemberByUsername(params.username);
  if (!member) return { title: "Portfolio Not Found" };
  return {
    title: `${member.name} (${member.memberId})`,
    description: `${member.headline} — Verified AXON Member (${member.wing}, ${member.chapter}).`,
    alternates: { canonical: `https://askme.pk/u/${member.username}` },
    openGraph: {
      title: `${member.name} | AXON Verified Portfolio`,
      description: member.headline,
      url: `https://askme.pk/u/${member.username}`,
      images: [
        {
          url: `/api/og?username=${encodeURIComponent(member.username)}`,
          width: 1200,
          height: 630,
          alt: `${member.name} — AXON Verified Portfolio`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${member.name} | AXON Verified Portfolio`,
      description: member.headline,
      images: [`/api/og?username=${encodeURIComponent(member.username)}`],
    },
  };
}

export default async function StudentPortfolioPage({ params }: PageProps) {
  const member = getMemberByUsername(params.username);

  if (!member || member.rbacRole === "PENDING_APPLICANT") {
    notFound();
  }

  const db = readDb();
  const theme =
    THEME_ACCENTS[member.themePreference] || THEME_ACCENTS["obsidian-cyan"];

  const memberProjects = db.projects.filter(
    (p) =>
      p.author.username.toLowerCase() === member.username.toLowerCase() &&
      p.status === "Verified & Active"
  );

  const memberCertificates = db.certificates.filter(
    (c) =>
      c.status === "Active" &&
      (c.recipientName.toLowerCase() === member.name.toLowerCase() ||
        c.memberId === member.memberId)
  );

  const memberBlogs = db.blogs.filter(
    (b) =>
      b.author.username.toLowerCase() === member.username.toLowerCase() &&
      b.status === "Published"
  );

  const memberEndorsements = db.endorsements.filter(
    (e) => e.recipientUsername.toLowerCase() === member.username.toLowerCase()
  );

  const githubSummary = await fetchGitHubUserSummary(
    member.githubUsername,
    member.skills.languages
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* 1. EDITORIAL HERO & VERIFIED MEMBER BADGE */}
      <div
        className={`p-8 sm:p-12 rounded-2xl bg-void-card border ${theme.border} relative overflow-hidden shadow-2xl mb-12`}
      >
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 text-cyan-axon/[0.03] pointer-events-none">
          <ShieldCheck className="w-80 h-80" />
        </div>

        <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
          <div className="relative shrink-0">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden border-2 border-void-border bg-void-500 shadow-xl">
              <img
                src={member.avatar}
                alt={member.name}
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>
            {member.internshipAvailable && (
              <div className="absolute -bottom-2 -right-2 bg-circuit-green text-void-500 px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-void-500 animate-pulse"></span>
                <span>Available</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 font-mono">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-circuit-green/10 border border-circuit-green/40 text-circuit-green text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>VERIFIED AXON MEMBER</span>
                </span>
                <span className="text-slate-600">/</span>
                <span className={`${theme.accentText} text-xs font-bold`}>
                  ID: {member.memberId}
                </span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-400 text-xs">{member.chapter}</span>
              </div>

              <PortfolioActions
                username={member.username}
                memberName={member.name}
              />
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              {member.name}
            </h1>

            <p className="mt-2 text-sm sm:text-base text-slate-300 font-sans max-w-2xl leading-relaxed">
              {member.headline}
            </p>

            <p className="mt-4 text-xs sm:text-sm text-slate-400 font-sans leading-relaxed max-w-3xl">
              {member.bio}
            </p>

            {/* Direct Social & Contact Bar */}
            <div className="mt-6 pt-6 border-t border-void-border/70 flex flex-wrap items-center gap-3 text-xs">
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-void-subtle border border-void-border hover:border-slate-500 text-slate-200 rounded flex items-center gap-2 transition-colors"
              >
                <Github className={`w-4 h-4 ${theme.accentText}`} />
                <span>GitHub (@{member.githubUsername})</span>
              </a>

              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-void-subtle border border-void-border hover:border-slate-500 text-slate-200 rounded flex items-center gap-2 transition-colors"
                >
                  <Linkedin className={`w-4 h-4 ${theme.accentText}`} />
                  <span>LinkedIn</span>
                </a>
              )}

              <a
                href={`mailto:${member.email}`}
                className="px-3.5 py-1.5 bg-void-subtle border border-void-border hover:border-slate-500 text-slate-200 rounded flex items-center gap-2 transition-colors"
              >
                <Mail className={`w-4 h-4 ${theme.accentText}`} />
                <span>{member.email}</span>
              </a>

              <Link
                href={`/verify?code=${encodeURIComponent(member.memberId)}`}
                className="px-3.5 py-1.5 bg-void-subtle border border-circuit-green/40 text-circuit-green rounded hover:bg-circuit-green/10 flex items-center gap-1.5 transition-colors no-print"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Credential</span>
              </Link>

              {member.resumeUrl && (
                <a
                  href={member.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-void-subtle border border-cyan-axon/40 text-cyan-axon rounded hover:bg-cyan-axon/10 flex items-center gap-1.5 transition-colors no-print"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Resume PDF</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. STRUCTURED TECH STACK MATRIX + LIVE GITHUB LANGUAGE BREAKDOWN */}
      <section className="mb-12">
        <div
          className={`text-xs font-mono uppercase tracking-widest ${theme.accentText} mb-3`}
        >
          ENGINEERING CAPABILITIES & GITHUB TELEMETRY
        </div>
        <h2 className="font-serif text-2xl font-bold text-white mb-6">
          Technical Stack & Language Distribution
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-xs">
          <div className="p-6 rounded-xl bg-void-card border border-void-border">
            <div className="text-slate-400 uppercase text-[11px] mb-3">
              Languages
            </div>
            <div className="flex flex-wrap gap-2">
              {member.skills.languages.map((lang) => (
                <span
                  key={lang}
                  className="px-2.5 py-1 rounded bg-void-subtle border border-void-border text-white"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-void-card border border-void-border">
            <div className="text-slate-400 uppercase text-[11px] mb-3">
              Frameworks & Runtimes
            </div>
            <div className="flex flex-wrap gap-2">
              {member.skills.frameworks.map((fw) => (
                <span
                  key={fw}
                  className={`px-2.5 py-1 rounded border ${theme.badgeBg}`}
                >
                  {fw}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-void-card border border-void-border">
            <div className="text-slate-400 uppercase text-[11px] mb-3">
              Systems & Infrastructure
            </div>
            <div className="flex flex-wrap gap-2">
              {member.skills.systems.map((sys) => (
                <span
                  key={sys}
                  className="px-2.5 py-1 rounded bg-void-subtle border border-void-border text-slate-300"
                >
                  {sys}
                </span>
              ))}
            </div>
          </div>

          {/* Live GitHub Activity & Top Languages Widget (Blueprint Section 10) */}
          <div className="p-6 rounded-xl bg-void-card border border-void-border">
            <div className="flex items-center justify-between text-slate-400 uppercase text-[11px] mb-3">
              <span>GitHub Telemetry</span>
              <span className="text-[10px] text-circuit-green">
                {githubSummary.syncedLive ? "LIVE" : "CACHED"}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 mb-3">
              {githubSummary.publicRepos} Public Repos •{" "}
              {githubSummary.totalStars}★
            </div>
            <div className="space-y-2">
              {githubSummary.topLanguages.map((lang) => (
                <div key={lang.name}>
                  <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                    <span>{lang.name}</span>
                    <span>{lang.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded bg-void-400 overflow-hidden">
                    <div
                      className="h-full bg-cyan-axon"
                      style={{ width: `${Math.max(8, lang.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. DIRECTOR ENDORSEMENTS & CONTRIBUTION BADGES (Blueprint Section 10) */}
      {memberEndorsements.length > 0 && (
        <section className="mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-circuit-green mb-3">
            DIRECTORATE RECOGNITION
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-6">
            Director Endorsements & Contribution Badges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memberEndorsements.map((end) => (
              <div
                key={end.id}
                className="p-6 rounded-xl bg-void-card border border-circuit-green/30 font-mono text-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 text-circuit-green font-bold">
                    <BadgeCheck className="w-4 h-4" />
                    <span>{end.badgeTitle}</span>
                  </span>
                  <span className="text-slate-400">{end.awardedAt}</span>
                </div>
                <p className="text-slate-300 font-sans text-xs leading-relaxed mb-3">
                  &quot;{end.note}&quot;
                </p>
                <div className="text-[11px] text-slate-400">
                  Endorsed by <strong className="text-white">{end.directorName}</strong> ({end.directorRole})
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. GITHUB-SYNCED FEATURED PROJECTS */}
      <section className="mb-12">
        <div className="text-xs font-mono uppercase tracking-widest text-circuit-green mb-3">
          VERIFIED WORK
        </div>
        <h2 className="font-serif text-2xl font-bold text-white mb-6">
          Featured GitHub Repositories
        </h2>

        {memberProjects.length === 0 ? (
          <div className="p-6 rounded-xl bg-void-card border border-void-border text-xs font-mono text-slate-400">
            No public projects linked yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memberProjects.map((project) => (
              <div
                key={project.id}
                className="p-6 rounded-xl bg-void-card border border-void-border hover:border-slate-600 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-xs text-slate-400 mb-3">
                    <span className="text-circuit-green flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>AXON Verified</span>
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Star className="w-3.5 h-3.5 text-yellow-500" />
                        {project.stars}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <GitFork className="w-3.5 h-3.5" />
                        {project.forks}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-white mb-2">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="hover:text-cyan-axon"
                    >
                      {project.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
                    {project.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-void-subtle border border-void-border text-[10px] font-mono text-slate-300 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-void-border/70 flex items-center justify-between font-mono text-xs">
                  <a
                    href={project.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-white flex items-center gap-1.5"
                  >
                    <Github className="w-3.5 h-3.5 text-cyan-axon" />
                    <span>GitHub Repository</span>
                  </a>

                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-axon hover:underline flex items-center gap-1"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. AUTO-LINKED VERIFIED CREDENTIALS */}
      <section className="mb-12">
        <div
          className={`text-xs font-mono uppercase tracking-widest ${theme.accentText} mb-3`}
        >
          INSTITUTIONAL RECORD
        </div>
        <h2 className="font-serif text-2xl font-bold text-white mb-6">
          Verified AXON Credentials & Awards
        </h2>

        <div className="space-y-4">
          {memberCertificates.map((cert) => (
            <div
              key={cert.certCode}
              className="p-6 rounded-xl bg-void-card border border-circuit-green/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-circuit-green/20 text-circuit-green font-bold text-[10px]">
                    {cert.status.toUpperCase()}
                  </span>
                  <span className="text-slate-400">{cert.type}</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-cyan-axon">{cert.certCode}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white font-sans">
                  {cert.eventOrRole}
                </h3>
                <div className="text-slate-400 text-[11px] mt-1">
                  Issued by: {cert.issuerAuthority} on {cert.issueDate}
                </div>
              </div>

              <Link
                href={`/verify?code=${encodeURIComponent(cert.certCode)}`}
                className="px-4 py-2 bg-void-subtle border border-void-border hover:border-cyan-axon text-slate-200 rounded text-center shrink-0 no-print"
              >
                Inspect Official Audit Record
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PUBLISHED AXON BLOG POSTS */}
      {memberBlogs.length > 0 && (
        <section className="mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">
            PUBLICATIONS
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-6">
            Authored Technical Monographs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memberBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className="p-6 rounded-xl bg-void-card border border-void-border hover:border-cyan-axon/50 transition-colors"
              >
                <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-axon" />
                  <span>{blog.publishedAt}</span>
                  <span>•</span>
                  <span>{blog.readTime}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-2">
                  {blog.title}
                </h3>
                <p className="text-xs text-slate-400 font-sans line-clamp-2">
                  {blog.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 7. EDUCATION & EXPERIENCE TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">
            TRACK RECORD
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-6">
            Experience & Leadership Timeline
          </h2>

          <div className="space-y-4">
            {member.timeline.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-void-card border border-void-border"
              >
                <div className={`font-mono text-xs ${theme.accentText} mb-1`}>
                  {item.year}
                </div>
                <h3 className="font-serif text-lg font-bold text-white font-sans">
                  {item.role}
                </h3>
                <div className="text-xs font-mono text-slate-400 mb-2">
                  {item.organization}
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">
            ACADEMICS
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-6">
            Education
          </h2>
          <div className="space-y-4">
            {member.education.map((edu, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-void-card border border-void-border font-mono text-xs"
              >
                <div className="flex items-center gap-2 text-cyan-axon mb-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>{edu.period}</span>
                </div>
                <div className="font-serif text-base font-bold text-white font-sans">
                  {edu.degree}
                </div>
                <div className="text-slate-400 mt-1 font-sans">
                  {edu.institution}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
