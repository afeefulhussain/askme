import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowLeft, ArrowUpRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { EVENTS, AxonEvent } from "@/data/axonData";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return EVENTS.map((event) => ({
    slug: event.slug,
  }));
}

export default function EventDetailPage({ params }: PageProps) {
  const event = EVENTS.find((e) => e.slug === params.slug);

  if (!event) {
    notFound();
  }

  // Schema.org Event JSON-LD as defined in Blueprint Section 4
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: `${event.date}T18:00:00+05:00`,
    eventAttendanceMode: event.isVirtual
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus:
      event.status === "Completed"
        ? "https://schema.org/EventMovedOnline"
        : "https://schema.org/EventScheduled",
    location: event.isVirtual
      ? {
          "@type": "VirtualLocation",
          url: `https://axon.org.pk/events/${event.slug}`,
        }
      : {
          "@type": "Place",
          name: event.location,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Lahore",
            addressRegion: "Punjab",
            addressCountry: "PK",
          },
        },
    description: event.description,
    organizer: {
      "@type": "Organization",
      name: "AXON",
      url: "https://axon.org.pk",
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />

      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-axon mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Event Directory</span>
      </Link>

      <div className="border-b border-void-border pb-8 mb-10">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs mb-4">
          <span className="px-2.5 py-0.5 rounded bg-circuit-green/20 text-circuit-green border border-circuit-green/40 font-bold">
            {event.status.toUpperCase()}
          </span>
          <span className="text-slate-400">{event.category}</span>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-axon font-semibold">UET LAHORE CHAPTER</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight">
          {event.title}
        </h1>

        <div className="mt-6 flex flex-wrap gap-6 font-mono text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-axon" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-axon" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-axon" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8 font-sans">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white mb-3">
              Session Overview & Mandate
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {event.description}
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-white mb-4">
              Technical Syllabus & Breakdown
            </h2>
            <div className="space-y-3 font-mono text-xs">
              {event.curriculum.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded bg-void-card border border-void-border flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-void-subtle border border-cyan-axon/40 text-cyan-axon flex items-center justify-center text-[10px] shrink-0 font-bold">
                    0{idx + 1}
                  </span>
                  <span className="text-slate-200 mt-0.5">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Speaker Card */}
          <div className="p-6 rounded-xl bg-void-card border border-void-border font-mono text-xs">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">
              SESSION INSTRUCTOR
            </div>
            <div className="font-serif text-xl font-bold text-white">
              {event.speaker.name}
            </div>
            <div className="text-cyan-axon mt-0.5">{event.speaker.title}</div>
            <div className="text-slate-400 mt-2 text-[11px]">
              {event.speaker.organization}
            </div>
          </div>

          {/* Registration / RSVP Action Card */}
          <div className="p-6 rounded-xl bg-void-subtle border border-cyan-axon/40 font-mono text-xs">
            <div className="text-white font-serif font-bold text-lg mb-2">
              Registration & Access
            </div>
            <p className="text-slate-300 text-[11px] mb-4">
              AXON members receive automatic reservation. Non-member students must verify university enrollment.
            </p>
            {event.status === "Completed" ? (
              <div className="p-3 text-center rounded bg-void-400 border border-void-border text-slate-400">
                Session Completed & Archived
              </div>
            ) : (
              <Link
                href="/join?track=event&id="
                className="w-full py-3 bg-cyan-axon text-void-500 font-bold uppercase rounded hover:bg-cyan-300 text-center block transition-all shadow"
              >
                Reserve Seat (Free)
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
