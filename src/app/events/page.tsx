"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, User, ArrowUpRight, Search } from "lucide-react";
import { EVENTS, AxonEvent } from "@/data/axonData";

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Technical Workshop", "Symposium", "Bootcamp"];

  const filteredEvents = EVENTS.filter((event) => {
    const matchesCategory =
      activeCategory === "All" || event.category === activeCategory;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Editorial Header */}
      <div className="max-w-4xl border-b border-void-border pb-12 mb-10">
        <div className="text-xs font-mono uppercase tracking-widest text-cyan-axon mb-3">
          ACADEMIC CALENDAR // MASTERCLASSES
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight">
          Webinars, Technical Workshops & Symposia
        </h1>
        <p className="mt-6 text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
          Open and closed-cohort technical sessions hosted by AXON directorates and guest industry practitioners. Hosted both in-person at IMAC UET Lahore and streamed globally to partner university chapters.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 font-mono text-xs">
        {/* Category tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-void-card border border-void-border rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeCategory === cat
                  ? "bg-cyan-axon text-void-500 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic or speaker..."
            className="w-full bg-void-card border border-void-border rounded px-3 py-2 pl-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredEvents.map((evt) => (
          <article
            key={evt.id}
            className="bg-void-card border border-void-border hover:border-slate-600 rounded-xl p-6 sm:p-8 flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-xs mb-4">
                <span
                  className={`px-2.5 py-0.5 rounded border text-[11px] font-semibold ${
                    evt.status === "Registrations Open"
                      ? "bg-circuit-green/20 text-circuit-green border-circuit-green/40"
                      : evt.status === "Completed"
                      ? "bg-slate-800 text-slate-400 border-slate-700"
                      : "bg-cyan-axon/20 text-cyan-axon border-cyan-axon/30"
                  }`}
                >
                  {evt.status.toUpperCase()}
                </span>
                <span className="text-slate-400">{evt.category}</span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-white mb-3 hover:text-cyan-axon transition-colors">
                <Link href={`/events/${evt.slug}`}>{evt.title}</Link>
              </h2>

              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-6">
                {evt.description}
              </p>

              {/* Speaker Card */}
              <div className="p-3.5 rounded bg-void-subtle border border-void-border font-mono text-xs mb-6">
                <div className="text-[10px] text-slate-400 uppercase">LEAD SPEAKER / INSTRUCTOR</div>
                <div className="font-medium text-white mt-0.5">{evt.speaker.name}</div>
                <div className="text-[11px] text-cyan-axon">{evt.speaker.title}</div>
                <div className="text-[10px] text-slate-400 mt-1">{evt.speaker.organization}</div>
              </div>
            </div>

            {/* Event Footer */}
            <div className="pt-4 border-t border-void-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
              <div className="space-y-1 text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-cyan-axon" />
                  <span>{evt.date} // {evt.time}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate max-w-[240px]">{evt.location}</span>
                </div>
              </div>

              <Link
                href={`/events/${evt.slug}`}
                className="px-4 py-2 bg-void-subtle border border-void-border hover:border-cyan-axon text-slate-200 hover:text-white rounded font-medium transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Details & Curriculum</span>
                <ArrowUpRight className="w-3 h-3 text-cyan-axon" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
