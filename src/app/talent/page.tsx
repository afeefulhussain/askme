import React from "react";
import type { Metadata } from "next";
import { WINGS } from "@/data/axonData";
import { getPublicMembers } from "@/lib/db";
import { sanitizePublicMember } from "@/lib/rbac";
import TalentDirectoryClient from "@/components/TalentDirectoryClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Member Directory & Talent Discovery",
  description:
    "Open recruiter-facing directory of vetted AXON student engineers, wing directors, and researchers filterable by skill stack, graduation year, and internship availability.",
  alternates: { canonical: "https://askme.pk/talent" },
};

export default function TalentPage() {
  const members = getPublicMembers().map(sanitizePublicMember);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl border-b border-void-border pb-12 mb-10">
        <div className="text-xs font-mono uppercase tracking-widest text-cyan-axon mb-3">
          RECRUITER DISCOVERY // VERIFIED PORTFOLIOS
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight">
          AXON Member Directory & Talent Discovery
        </h1>
        <p className="mt-6 text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
          Browse verified AXON member engineers across all 11 operational
          directorates. Every profile carries an anchored Credential ID,
          GitHub-synced projects, and Director Endorsements.
        </p>
      </div>

      <TalentDirectoryClient members={members} wings={WINGS} />
    </div>
  );
}
