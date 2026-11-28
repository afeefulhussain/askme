import React from "react";
import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import ContactFormClient from "@/components/ContactFormClient";

export const metadata: Metadata = {
  title: "Contact & Institutional Partnerships",
  description:
    "Official AXON channel for university chapter incubation, corporate sponsorships, technical speakers, and inquiries originating at IMAC UET Lahore.",
  alternates: { canonical: "https://askme.pk/contact" },
};

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl border-b border-void-border pb-10 mb-12">
        <div className="text-xs font-mono uppercase tracking-widest text-cyan-axon mb-3">
          INSTITUTIONAL LIAISON // CORPORATE INQUIRIES
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight">
          Partner with AXON
        </h1>
        <p className="mt-4 text-base text-slate-300 font-sans leading-relaxed">
          For university chapter incubation, corporate sponsorship of
          hackathons, technical speaker invitations, and laboratory research
          collaborations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="space-y-6 font-mono text-xs">
          <div className="p-6 rounded-xl bg-void-card border border-void-border space-y-4">
            <div className="text-white font-semibold uppercase text-[11px] border-b border-void-border/60 pb-2">
              Secretariat Headquarters
            </div>

            <div className="flex items-start gap-3 text-slate-300">
              <MapPin className="w-4 h-4 text-cyan-axon shrink-0 mt-0.5" />
              <div className="font-sans leading-relaxed">
                <strong>
                  Innovation & Manufacturing Auxiliary Center (IMAC)
                </strong>
                <br />
                University of Engineering & Technology (UET)
                <br />
                G.T. Road, Lahore, 54890, Pakistan
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <Mail className="w-4 h-4 text-cyan-axon shrink-0" />
              <a
                href="mailto:axon@askme.pk"
                className="hover:text-cyan-axon text-cyan-axon font-mono"
              >
                axon@askme.pk
              </a>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-void-card border border-void-border space-y-3 font-sans text-xs text-slate-400">
            <div className="text-white font-mono font-semibold uppercase text-[11px] border-b border-void-border/60 pb-2">
              Official Domain & Secretariat Routing
            </div>
            <p>
              Canonical Web Portal:{" "}
              <strong className="text-slate-200 font-mono">
                https://askme.pk
              </strong>
            </p>
            <p>
              Official Secretariat Dispatch:{" "}
              <strong className="text-slate-200 font-mono">
                axon@askme.pk
              </strong>
            </p>
            <p className="text-[11px] text-slate-400">
              All official student credentials and certificates carry
              verification signatures originating from this address space.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <ContactFormClient />
        </div>
      </div>
    </div>
  );
}
