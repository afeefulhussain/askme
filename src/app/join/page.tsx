import React from "react";
import type { Metadata } from "next";
import { UNIVERSITY_CHAPTERS, WINGS } from "@/data/axonData";
import JoinPortalClient from "@/components/JoinPortalClient";

export const metadata: Metadata = {
  title: "Join AXON Inductions",
  description:
    "Centralized onboarding portal for General Member Engineers, Campus Ambassadors, Research Fellows, and prospective University Chapter Leads across Pakistan.",
  alternates: { canonical: "https://askme.pk/join" },
};

interface JoinPageProps {
  searchParams: {
    wing?: string;
  };
}

export default function JoinPage({ searchParams }: JoinPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="border-b border-void-border pb-10 mb-12">
        <div className="text-xs font-mono uppercase tracking-widest text-cyan-axon mb-3">
          ADMISSIONS & INDUCTIONS // COHORT 2026
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight">
          Join the AXON Network
        </h1>
        <p className="mt-4 text-base text-slate-300 font-sans leading-relaxed">
          AXON inducts student engineers, designers, media strategists,
          operations leads, and prospective university chapter coordinators
          across our 11 wings. Together We Transmit.
        </p>
      </div>

      <JoinPortalClient
        wings={WINGS}
        chapters={UNIVERSITY_CHAPTERS}
        initialWing={searchParams.wing}
      />
    </div>
  );
}
