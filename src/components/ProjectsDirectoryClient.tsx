"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Github,
  Star,
  GitFork,
  ExternalLink,
  CheckCircle2,
  Search,
  Filter,
} from "lucide-react";
import type { Project, Wing } from "@/lib/types";

interface ProjectsDirectoryClientProps {
  projects: Project[];
  wings: Wing[];
}

export default function ProjectsDirectoryClient({
  projects,
  wings,
}: ProjectsDirectoryClientProps) {
  const [selectedWing, setSelectedWing] = useState<string>("All");
  const [selectedStack, setSelectedStack] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const allStacks = Array.from(
    new Set(projects.flatMap((p) => p.techStack))
  ).slice(0, 12);

  const filteredProjects = projects.filter((proj) => {
    const matchesWing = selectedWing === "All" || proj.wingId === selectedWing;
    const matchesStack =
      selectedStack === "All" || proj.techStack.includes(selectedStack);
    const matchesSearch =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.techStack.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesWing && matchesStack && matchesSearch;
  });

  return (
    <>
      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              aria-label="Filter projects by directorate"
              value={selectedWing}
              onChange={(e) => setSelectedWing(e.target.value)}
              className="bg-void-card border border-void-border rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-axon text-xs"
            >
              <option value="All">All Directorates</option>
              {wings.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <select
            aria-label="Filter projects by technology stack"
            value={selectedStack}
            onChange={(e) => setSelectedStack(e.target.value)}
            className="bg-void-card border border-void-border rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-axon text-xs"
          >
            <option value="All">All Tech Stacks</option>
            {allStacks.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="relative min-w-[260px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by tech stack, author, or keyword..."
            className="w-full bg-void-card border border-void-border rounded px-3 py-2 pl-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-void-card border border-void-border rounded-xl font-mono text-xs text-slate-400">
          No verified repositories match your search filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="bg-void-card border border-void-border hover:border-slate-600 rounded-xl p-6 sm:p-8 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs mb-4">
                  <span className="flex items-center gap-1.5 text-circuit-green">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="font-semibold">{project.status}</span>
                  </span>
                  <div className="flex items-center gap-4 text-slate-300">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500" />
                      {project.stars}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <GitFork className="w-3.5 h-3.5" />
                      {project.forks}
                    </span>
                  </div>
                </div>

                <h2 className="font-serif text-2xl font-bold text-white mb-3 hover:text-cyan-axon transition-colors">
                  <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                </h2>

                <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
                  {project.summary}
                </p>

                <div className="p-3 bg-void-subtle rounded border border-void-border/70 text-[11px] font-mono text-slate-400 mb-5">
                  <div className="text-[10px] text-cyan-axon uppercase mb-1">
                    SYSTEM ARCHITECTURE:
                  </div>
                  {project.architecture}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 bg-void-400 border border-void-border text-[11px] font-mono text-slate-300 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-void-border/70 flex items-center justify-between font-mono text-xs">
                <Link
                  href={`/u/${project.author.username}`}
                  className="flex items-center gap-2.5 text-slate-200 hover:text-cyan-axon transition-colors"
                >
                  <img
                    src={project.author.avatar}
                    alt={project.author.name}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full object-cover border border-void-border"
                  />
                  <div>
                    <div className="font-medium text-white">
                      {project.author.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {project.author.memberId}
                    </div>
                  </div>
                </Link>

                <div className="flex items-center gap-3">
                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-cyan-axon flex items-center gap-1"
                    >
                      <span>Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <a
                    href={project.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-void-subtle border border-void-border hover:border-slate-500 text-slate-200 rounded flex items-center gap-1.5"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
