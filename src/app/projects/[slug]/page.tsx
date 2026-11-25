import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, GitFork, Github, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PROJECTS } from "@/data/axonData";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return PROJECTS.map((proj) => ({
    slug: proj.slug,
  }));
}

export default function ProjectDetailPage({ params }: PageProps) {
  const project = PROJECTS.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-axon mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Projects Directory</span>
      </Link>

      <div className="border-b border-void-border pb-8 mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs mb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-circuit-green">
              <CheckCircle2 className="w-4 h-4" />
              <span>{project.status}</span>
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300">{project.author.wing}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{project.stars} stars</span>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <GitFork className="w-4 h-4" />
              <span>{project.forks} forks</span>
            </span>
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight">
          {project.title}
        </h1>

        <p className="mt-4 text-base text-slate-300 font-sans leading-relaxed max-w-3xl">
          {project.summary}
        </p>

        <div className="mt-6 flex flex-wrap gap-4 font-mono text-xs">
          <a
            href={project.githubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-void-card border border-void-border hover:border-cyan-axon text-white rounded flex items-center gap-2 transition-colors"
          >
            <Github className="w-4 h-4 text-cyan-axon" />
            <span>View Upstream GitHub Repository</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-cyan-axon text-void-500 font-bold uppercase rounded hover:bg-cyan-300 transition-colors flex items-center gap-2"
            >
              <span>Live Demonstration</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white mb-3">
              System Architecture & Design Brief
            </h2>
            <div className="p-6 bg-void-card border border-void-border rounded-lg text-sm text-slate-300 font-sans leading-relaxed">
              {project.architecture}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-white mb-3">
              Core Technologies & Languages
            </h2>
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 bg-void-card border border-void-border text-slate-200 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Author Bio Card */}
        <div>
          <div className="p-6 bg-void-card border border-void-border rounded-xl font-mono text-xs">
            <div className="text-[10px] text-slate-400 uppercase mb-3">
              VERIFIED AXON MEMBER AUTHOR
            </div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={project.author.avatar}
                alt={project.author.name}
                className="w-12 h-12 rounded-full object-cover border border-void-border"
              />
              <div>
                <div className="font-serif text-lg font-bold text-white">
                  {project.author.name}
                </div>
                <div className="text-cyan-axon text-[11px] font-mono">
                  {project.author.memberId}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-sans mb-4">
              Member engineer at AXON {project.author.wing}. Author of verified open-source components.
            </p>

            <Link
              href={`/u/${project.author.username}`}
              className="w-full py-2.5 bg-void-subtle border border-void-border hover:border-cyan-axon text-center block text-slate-200 rounded transition-colors text-xs"
            >
              View Full Student Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
