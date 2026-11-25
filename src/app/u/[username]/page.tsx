import React from "react";
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
  Calendar,
  Building,
  Award,
  Share2,
  Copy,
} from "lucide-react";
import {
  MEMBERS_PORTFOLIOS,
  PROJECTS,
  CERTIFICATES_DATABASE,
  BLOGS,
} from "@/data/axonData";

interface PageProps {
  params: {
    username: string;
  };
}

export async function generateStaticParams() {
  return Object.keys(MEMBERS_PORTFOLIOS).map((username) => ({
    username,
  }));
}

export default function StudentPortfolioPage({ params }: PageProps) {
  const member = MEMBERS_PORTFOLIOS[params.username.toLowerCase()];

  if (!member) {
    notFound();
  }

  // Get member's projects
  const memberProjects = PROJECTS.filter(
    (p) => p.author.username.toLowerCase() === member.username.toLowerCase()
  );

  // Get member's verified credentials
  const memberCertificates = CERTIFICATES_DATABASE.filter(
    (c) =>
      c.recipientName.toLowerCase().includes(member.name.toLowerCase()) ||
      c.memberId === member.memberId
  );

  // Get member's blogs
  const memberBlogs = BLOGS.filter(
    (b) => b.author.username.toLowerCase() === member.username.toLowerCase()
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* 1. EDITORIAL HERO & VERIFIED MEMBER BADGE */}
      <div className="p-8 sm:p-12 rounded-2xl bg-void-card border border-void-border relative overflow-hidden shadow-2xl mb-12">
        {/* Background micro watermark */}
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 text-cyan-axon/[0.03] pointer-events-none">
          <ShieldCheck className="w-80 h-80" />
        </div>

        <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
          {/* Avatar with status frame */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden border-2 border-void-border bg-void-500 shadow-xl">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-circuit-green text-void-500 px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow">
              <span className="w-1.5 h-1.5 rounded-full bg-void-500 animate-pulse"></span>
              <span>Available</span>
            </div>
          </div>

          {/* Member Details */}
          <div className="flex-1 min-w-0 font-mono">
            {/* Verified badge strip */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-circuit-green/10 border border-circuit-green/40 text-circuit-green text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>VERIFIED AXON MEMBER</span>
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-cyan-axon text-xs font-bold">
                ID: {member.memberId}
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400 text-xs">{member.chapter}</span>
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
            <div className="mt-6 pt-6 border-t border-void-border/70 flex flex-wrap items-center gap-4 text-xs">
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-void-subtle border border-void-border hover:border-slate-500 text-slate-200 rounded flex items-center gap-2 transition-colors"
              >
                <Github className="w-4 h-4 text-cyan-axon" />
                <span>GitHub Profile</span>
              </a>

              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-void-subtle border border-void-border hover:border-slate-500 text-slate-200 rounded flex items-center gap-2 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-cyan-axon" />
                <span>LinkedIn</span>
              </a>

              <a
                href={`mailto:${member.email}`}
                className="px-3.5 py-1.5 bg-void-subtle border border-void-border hover:border-slate-500 text-slate-200 rounded flex items-center gap-2 transition-colors"
              >
                <Mail className="w-4 h-4 text-cyan-axon" />
                <span>{member.email}</span>
              </a>

              <Link
                href={`/verify?code=${member.memberId}`}
                className="px-3.5 py-1.5 bg-void-subtle border border-circuit-green/40 text-circuit-green rounded hover:bg-circuit-green/10 flex items-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Credential Status</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STRUCTURED TECH STACK MATRIX */}
      <section className="mb-12">
        <div className="text-xs font-mono uppercase tracking-widest text-cyan-axon mb-3">
          ENGINEERING CAPABILITIES
        </div>
        <h2 className="font-serif text-2xl font-bold text-white mb-6">
          Technical Stack & Toolchains
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="p-6 rounded-xl bg-void-card border border-void-border">
            <div className="text-slate-400 uppercase text-[11px] mb-3">
              Programming Languages
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
                  className="px-2.5 py-1 rounded bg-void-subtle border border-void-border text-cyan-axon"
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
        </div>
      </section>

      {/* 3. GITHUB-SYNCED FEATURED PROJECTS */}
      <section className="mb-12">
        <div className="text-xs font-mono uppercase tracking-widest text-circuit-green mb-3">
          VERIFIED WORK
        </div>
        <h2 className="font-serif text-2xl font-bold text-white mb-6">
          Featured GitHub Repositories
        </h2>

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
                  <Link href={`/projects/${project.slug}`} className="hover:text-cyan-axon">
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
      </section>

      {/* 4. AUTO-LINKED VERIFIED CREDENTIALS */}
      <section className="mb-12">
        <div className="text-xs font-mono uppercase tracking-widest text-cyan-axon mb-3">
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
                href={`/verify?code=${cert.certCode}`}
                className="px-4 py-2 bg-void-subtle border border-void-border hover:border-cyan-axon text-slate-200 rounded text-center shrink-0"
              >
                Inspect Official Audit Record
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. EXPERIENCE & LEADERSHIP TIMELINE */}
      <section className="mb-12">
        <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">
          TRACK RECORD
        </div>
        <h2 className="font-serif text-2xl font-bold text-white mb-6">
          Experience & Engineering Timeline
        </h2>

        <div className="space-y-6">
          {member.timeline.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-void-card border border-void-border flex flex-col sm:flex-row items-start justify-between gap-4"
            >
              <div>
                <div className="font-mono text-xs text-cyan-axon mb-1">
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
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
