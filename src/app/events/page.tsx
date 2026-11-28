import React from "react";
import type { Metadata } from "next";
import { readDb } from "@/lib/db";
import EventsDirectoryClient from "@/components/EventsDirectoryClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events, Webinars & Workshops",
  description:
    "Filterable directory of AXON technical workshops, bootcamps, webinars, and engineering symposia hosted at IMAC UET Lahore and online.",
  alternates: { canonical: "https://askme.pk/events" },
};

export default function EventsPage() {
  const db = readDb();
  const publicEvents = db.events.filter(
    (e) => e.status !== "Pending Approval" && e.status !== "Rejected"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl border-b border-void-border pb-12 mb-10">
        <div className="text-xs font-mono uppercase tracking-widest text-cyan-axon mb-3">
          ACADEMIC CALENDAR // MASTERCLASSES
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight">
          Webinars, Technical Workshops & Symposia
        </h1>
        <p className="mt-6 text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
          Open and closed-cohort technical sessions hosted by AXON directorates
          and guest industry practitioners. Hosted both in-person at IMAC UET
          Lahore and streamed globally to partner university chapters.
        </p>
      </div>

      <EventsDirectoryClient events={publicEvents} />
    </div>
  );
}
