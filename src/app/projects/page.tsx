import React from "react";
import type { Metadata } from "next";
import { WINGS } from "@/data/axonData";
import { readDb } from "@/lib/db";
import ProjectsDirectoryClient from "@/components/ProjectsDirectoryClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Student Engineering Projects",
  description:
    "Open-source systems engines, AI pipelines, and hardware repositories built by verified AXON member engineers and approved for public showcase.",
  alternates: { canonical: "https://askme.pk/projects" },
};

export default function ProjectsPage() {
  const db = readDb();
  const activeProjects = db.projects.filter(
    (p) => p.status === "Verified & Active"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl border-b border-void-border pb-12 mb-10">
        <div className="text-xs font-mono uppercase tracking-widest text-cyan-axon mb-3">
          VERIFIED STUDENT REPOSITORIES // GITHUB SYNC
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight">
          AXON Student Engineering Showcase
        </h1>
        <p className="mt-6 text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
          Open-source software, hardware schematics, and systems engines
          developed exclusively by vetted AXON members. Every project repository
          is linked directly to GitHub with live statistics and author
          verification.
        </p>
      </div>

      <ProjectsDirectoryClient projects={activeProjects} wings={WINGS} />
    </div>
  );
}
