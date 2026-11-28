import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Github,
  Star,
  GitFork,
  CheckCircle2,
} from "lucide-react";
import { AXON_ORG_METADATA, WINGS } from "@/data/axonData";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const db = readDb();
  const upcomingEvents = db.events
    .filter(
      (e) =>
        e.status !== "Completed" &&
        e.status !== "Pending Approval" &&
        e.status !== "Rejected"
    )
    .slice(0, 2);
  const featuredProjects = db.projects
    .filter((p) => p.status === "Verified & Active")
    .slice(0, 3);
  const featuredPosts = db.blogs
    .filter((b) => b.status === "Published")
    .slice(0, 2);

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION: Editorial, Authoritative, Minimalist */}
      <section className="relative border-b border-void-border pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-wrap items-center gap-3 mb-6 font-mono text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-void-card border border-void-border text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-circuit-green"></span>
            <span>ORIGIN // IMAC, UET LAHORE</span>
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">TOGETHER WE TRANSMIT</span>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-axon">11 SPECIALIZED WINGS</span>
        </div>

        <div className="max-w-4xl">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.15]">
            An independent umbrella network advancing{" "}
            <span className="italic font-normal text-cyan-axon">
              high-calibre engineering
            </span>
            , applied research, and student leadership.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-3xl">
            Originating at the{" "}
            <strong className="text-white font-semibold">
              Innovation & Manufacturing Auxiliary Center (IMAC), UET Lahore
            </strong>
            , AXON serves as a structured incubator and multi-university
            umbrella network. We operate 11 specialized directorates spanning
            distributed systems, hardware fabrication, applied AI, offensive
            cyber, and peer-reviewed technical research.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 font-mono text-xs">
            <Link
              href="/join"
              className="px-6 py-3.5 bg-cyan-axon text-void-500 font-bold uppercase tracking-wider rounded hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)] flex items-center gap-2"
            >
              <span>Join AXON Inductions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/wings"
              className="px-6 py-3.5 bg-void-card border border-void-border text-slate-200 hover:text-white hover:border-slate-500 font-medium uppercase tracking-wider rounded transition-colors flex items-center gap-2"
            >
              <span>Explore 11 Directorates</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              href="/contact"
              className="px-5 py-3.5 text-slate-400 hover:text-white uppercase tracking-wider transition-colors"
            >
              Partner / Sponsor
            </Link>
          </div>
        </div>

        {/* Real-Time Impact Metric Strip */}
        <div className="mt-16 pt-8 border-t border-void-border/80 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono">
          <div className="border-l-2 border-cyan-axon pl-4">
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {AXON_ORG_METADATA.metrics.activeMembers}
            </div>
            <div className="text-[11px] text-slate-400 uppercase mt-0.5">
              Active Member Engineers
            </div>
          </div>

          <div className="border-l-2 border-void-border pl-4">
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {WINGS.length}
            </div>
            <div className="text-[11px] text-slate-400 uppercase mt-0.5">
              Operational Wings
            </div>
          </div>

          <div className="border-l-2 border-void-border pl-4">
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {AXON_ORG_METADATA.metrics.totalAttendees}
            </div>
            <div className="text-[11px] text-slate-400 uppercase mt-0.5">
              Total Workshop Attendees
            </div>
          </div>

          <div className="border-l-2 border-void-border pl-4">
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {AXON_ORG_METADATA.metrics.codeRepositories}
            </div>
            <div className="text-[11px] text-slate-400 uppercase mt-0.5">
              Verified Open-Source Repos
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 11 DIRECTORATES SHOWCASE */}
      <section className="py-20 border-b border-void-border bg-void-card/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-cyan-axon mb-2">
                ORGANIZATIONAL ARCHITECTURE
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white">
                AXON&apos;s 11 Operational Directorates
              </h2>
            </div>
            <p className="mt-4 md:mt-0 text-sm font-sans text-slate-400 max-w-md">
              Each wing operates with dedicated research labs, directorate
              heads, student engineering teams, and institutional mandates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WINGS.slice(0, 6).map((wing) => (
              <div
                key={wing.id}
                className="bg-void-card border border-void-border hover:border-cyan-axon/40 p-6 rounded-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                    <span className="text-cyan-axon font-semibold">
                      {wing.code}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-circuit-green"></span>
                      {wing.status}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-cyan-axon transition-colors">
                    <Link href={`/wings/${wing.slug}`}>{wing.name}</Link>
                  </h3>

                  <p className="mt-2 text-xs text-slate-400 font-sans leading-relaxed">
                    {wing.tagline}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {wing.focus.slice(0, 3).map((f) => (
                      <span
                        key={f}
                        className="px-2 py-0.5 bg-void-subtle border border-void-border text-[10px] font-mono text-slate-300 rounded"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-void-border/60 flex items-center justify-between text-xs font-mono">
                  <Link
                    href={`/u/${wing.leadUsername}`}
                    className="text-slate-400 hover:text-white"
                  >
                    Dir: {wing.lead}
                  </Link>
                  <Link
                    href={`/wings/${wing.slug}`}
                    className="text-cyan-axon hover:underline flex items-center gap-1"
                  >
                    <span>Charter</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/wings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-void-card border border-void-border hover:border-cyan-axon text-xs font-mono uppercase tracking-wider text-slate-200 rounded transition-all"
            >
              <span>Explore all 11 directorates & future spin-off wings</span>
              <ArrowRight className="w-4 h-4 text-cyan-axon" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. TECHNICAL WORKSHOPS & MASTERCLASSES */}
      <section className="py-20 border-b border-void-border max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-circuit-green mb-2">
              ACADEMIC SESSIONS & WEBINARS
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white">
              Upcoming Workshops & Event Archives
            </h2>
          </div>
          <Link
            href="/events"
            className="mt-4 md:mt-0 text-xs font-mono uppercase tracking-wider text-cyan-axon hover:underline flex items-center gap-1"
          >
            <span>Full Event Directory</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {upcomingEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-void-card border border-void-border p-6 sm:p-8 rounded-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs mb-3">
                  <span className="px-2 py-0.5 rounded bg-circuit-green/10 text-circuit-green border border-circuit-green/30 font-semibold">
                    {evt.status.toUpperCase()}
                  </span>
                  <span className="text-slate-400">{evt.category}</span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-white leading-snug">
                  <Link href={`/events/${evt.slug}`} className="hover:text-cyan-axon">
                    {evt.title}
                  </Link>
                </h3>

                <p className="mt-3 text-sm text-slate-400 font-sans leading-relaxed">
                  {evt.description}
                </p>

                <div className="mt-5 p-3 rounded bg-void-subtle border border-void-border/70 flex items-center justify-between font-mono text-xs">
                  <div>
                    <div className="text-slate-400 text-[10px]">INSTRUCTOR</div>
                    <div className="text-white font-medium">
                      {evt.speaker.name}
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    {evt.speaker.title}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-void-border/70 flex flex-col sm:flex-row sm:items-center justify-between font-mono text-xs gap-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-4 h-4 text-cyan-axon" />
                  <span>
                    {evt.date} {"//"} {evt.time}
                  </span>
                </div>
                <Link
                  href={`/events/${evt.slug}`}
                  className="px-4 py-2 bg-cyan-axon text-void-500 font-bold uppercase rounded hover:bg-cyan-300 transition-colors text-center"
                >
                  View Syllabus & RSVP
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. GITHUB-SYNCED STUDENT PROJECTS SHOWCASE */}
      <section className="py-20 border-b border-void-border bg-void-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-cyan-axon mb-2">
                VERIFIED CODEBASES
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white">
                Member Engineering Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="mt-4 md:mt-0 text-xs font-mono uppercase tracking-wider text-cyan-axon hover:underline flex items-center gap-1"
            >
              <span>Explore All Repositories</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-void-card border border-void-border p-6 rounded-lg flex flex-col justify-between hover:border-slate-600 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                    <span className="flex items-center gap-1 text-circuit-green">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{project.status}</span>
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

                  <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                    {project.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-void-subtle border border-void-border text-[10px] font-mono text-cyan-axon rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-void-border/70 flex items-center justify-between text-xs font-mono">
                  <Link
                    href={`/u/${project.author.username}`}
                    className="flex items-center gap-2 text-slate-300 hover:text-white"
                  >
                    <img
                      src={project.author.avatar}
                      alt={project.author.name}
                      width={20}
                      height={20}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span>{project.author.name}</span>
                  </Link>

                  <a
                    href={project.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Repo</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. VERIFICATION UTILITY CALLOUT */}
      <section className="py-16 border-b border-void-border max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-xl border border-void-border bg-gradient-to-r from-void-card via-void-subtle to-void-card p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-axon uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>DISCREET VERIFICATION ENGINE</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Recruiter & Institutional Credential Verification
            </h2>
            <p className="mt-2 text-sm text-slate-400 font-sans leading-relaxed">
              Every certificate, workshop distinction, and member identification
              issued under AXON&apos;s IMAC UET charter is cryptographically
              anchored. Instantly authenticate candidate claims with a single
              code lookup.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 font-mono text-xs w-full md:w-auto">
            <Link
              href="/verify"
              className="px-6 py-3.5 bg-void-card border border-cyan-axon/60 hover:border-cyan-axon text-cyan-axon hover:text-white font-semibold uppercase tracking-wider rounded transition-colors text-center"
            >
              Search Certificate Registry
            </Link>
            <Link
              href="/verify?code=AXN-26-313"
              className="px-6 py-3.5 bg-void-subtle border border-void-border text-slate-300 hover:text-white font-medium uppercase tracking-wider rounded transition-colors text-center"
            >
              Test Audit (AXN-26-313)
            </Link>
          </div>
        </div>
      </section>

      {/* 6. TECHNICAL RESEARCH & BLOGS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">
              PUBLICATIONS & ESSAYS
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white">
              Engineering Insights & Architecture
            </h2>
          </div>
          <Link
            href="/blogs"
            className="mt-4 md:mt-0 text-xs font-mono uppercase tracking-wider text-cyan-axon hover:underline flex items-center gap-1"
          >
            <span>All Articles</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredPosts.map((post) => (
            <article
              key={post.id}
              className="p-6 rounded-lg bg-void-card border border-void-border hover:border-slate-600 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 font-mono text-xs text-slate-400 mb-3">
                  <span>{post.publishedAt}</span>
                  <span className="text-slate-600">•</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-white hover:text-cyan-axon transition-colors">
                  <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="mt-3 text-sm text-slate-400 font-sans leading-relaxed">
                  {post.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono text-slate-300 px-2 py-0.5 bg-void-subtle border border-void-border rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-void-border/60 flex items-center justify-between font-mono text-xs">
                <Link
                  href={`/u/${post.author.username}`}
                  className="text-slate-300 hover:text-cyan-axon"
                >
                  By {post.author.name} ({post.author.role.split(",")[0]})
                </Link>
                <Link
                  href={`/blogs/${post.slug}`}
                  className="text-cyan-axon hover:underline flex items-center gap-1"
                >
                  <span>Read Paper</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
