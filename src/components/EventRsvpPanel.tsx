"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Users, Zap } from "lucide-react";
import type { SessionUser } from "@/lib/types";

interface EventRsvpPanelProps {
  eventSlug: string;
  eventTitle: string;
  status: string;
  capacity: number;
}

export default function EventRsvpPanel({
  eventSlug,
  eventTitle,
  status,
  capacity,
}: EventRsvpPanelProps) {
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [count, setCount] = useState(0);
  const [registered, setRegistered] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("UET Lahore");

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { authenticated: boolean; user: SessionUser | null }) => {
        if (d.authenticated && d.user) setSessionUser(d.user);
      })
      .catch(() => {});

    fetch(`/api/events/rsvp?slug=${encodeURIComponent(eventSlug)}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((d: { count: number; userRegistered: boolean }) => {
        setCount(d.count || 0);
        setRegistered(Boolean(d.userRegistered));
      })
      .catch(() => {});
  }, [eventSlug]);

  const submitRsvp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/events/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventSlug,
          eventTitle,
          name: sessionUser ? sessionUser.name : name,
          email: sessionUser ? sessionUser.email : email,
          university: sessionUser ? "AXON Verified Member" : university,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reserve seat.");
      } else {
        setRegistered(true);
        if (!data.alreadyRegistered) {
          setCount((c) => c + 1);
        }
      }
    } catch {
      setError("Network error while reserving seat.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 rounded-xl bg-void-subtle border border-cyan-axon/40 font-mono text-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="text-white font-serif font-bold text-lg">
          Registration & Access
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] text-slate-300">
          <Users className="w-3 h-3 text-cyan-axon" />
          <span>
            {count} / {capacity}
          </span>
        </span>
      </div>

      {status === "Completed" ? (
        <div className="p-3 text-center rounded bg-void-400 border border-void-border text-slate-400 mt-3">
          Session Completed & Archived
        </div>
      ) : registered ? (
        <div className="mt-3 p-4 rounded-lg bg-circuit-green/10 border border-circuit-green/40 text-circuit-green space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Seat Reserved & Confirmed</span>
          </div>
          <p className="text-[11px] font-sans text-slate-300">
            Your registration for <strong>{eventTitle}</strong> is confirmed in
            the AXON event registry.
          </p>
        </div>
      ) : sessionUser ? (
        <div className="mt-3 space-y-3">
          <p className="text-slate-300 text-[11px] font-sans leading-relaxed">
            Signed in as{" "}
            <strong className="text-white">{sessionUser.name}</strong> (
            {sessionUser.memberId}). Reserve your seat instantly without
            re-entering details.
          </p>
          {error && <div className="text-red-400 text-[11px]">{error}</div>}
          <button
            type="button"
            disabled={submitting}
            onClick={() => submitRsvp()}
            className="w-full py-3 bg-cyan-axon text-void-500 font-bold uppercase rounded hover:bg-cyan-300 transition-all shadow flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>
              {submitting ? "Confirming..." : "One-Click Member RSVP"}
            </span>
          </button>
        </div>
      ) : (
        <form onSubmit={submitRsvp} className="mt-3 space-y-3">
          <p className="text-slate-300 text-[11px] font-sans">
            AXON members can{" "}
            <Link href="/login" className="text-cyan-axon underline">
              sign in for One-Click RSVP
            </Link>
            , or register directly below:
          </p>

          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="University Email"
            className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
          />
          <input
            type="text"
            required
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            placeholder="University / Institution"
            className="w-full bg-void-400 border border-void-border rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
          />
          {error && <div className="text-red-400 text-[11px]">{error}</div>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-cyan-axon text-void-500 font-bold uppercase rounded hover:bg-cyan-300 transition-all shadow disabled:opacity-60"
          >
            {submitting ? "Reserving..." : "Reserve Seat (Free)"}
          </button>
        </form>
      )}
    </div>
  );
}
