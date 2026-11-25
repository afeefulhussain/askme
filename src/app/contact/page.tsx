"use client";

import React, { useState } from "react";
import { Mail, MapPin, Building2, Send, CheckCircle2, ShieldCheck } from "lucide-react";
import { AXON_ORG_METADATA } from "@/data/axonData";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    subject: "Institutional Partnership / Sponsorship",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Editorial Header */}
      <div className="max-w-4xl border-b border-void-border pb-10 mb-12">
        <div className="text-xs font-mono uppercase tracking-widest text-cyan-axon mb-3">
          INSTITUTIONAL LIAISON // CORPORATE INQUIRIES
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white leading-tight">
          Partner with AXON
        </h1>
        <p className="mt-4 text-base text-slate-300 font-sans leading-relaxed">
          For university chapter incubation, corporate sponsorship of hackathons, technical speaker invitations, and laboratory research collaborations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact info details */}
        <div className="space-y-6 font-mono text-xs">
          <div className="p-6 rounded-xl bg-void-card border border-void-border space-y-4">
            <div className="text-white font-semibold uppercase text-[11px] border-b border-void-border/60 pb-2">
              Secretariat Headquarters
            </div>

            <div className="flex items-start gap-3 text-slate-300">
              <MapPin className="w-4 h-4 text-cyan-axon shrink-0 mt-0.5" />
              <div className="font-sans leading-relaxed">
                <strong>Innovation & Manufacturing Auxiliary Center (IMAC)</strong>
                <br />
                University of Engineering & Technology (UET)
                <br />
                G.T. Road, Lahore, 54890, Pakistan
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <Mail className="w-4 h-4 text-cyan-axon shrink-0" />
              <a href="mailto:axon@askme.pk" className="hover:text-cyan-axon text-cyan-axon font-mono">
                axon@askme.pk
              </a>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-void-card border border-void-border space-y-3 font-sans text-xs text-slate-400">
            <div className="text-white font-mono font-semibold uppercase text-[11px] border-b border-void-border/60 pb-2">
              Official Domains & Routing
            </div>
            <p>
              Primary Institutional Domain: <strong className="text-slate-200 font-mono">axon.org.pk</strong>
            </p>
            <p>
              Communications Gateway: <strong className="text-slate-200 font-mono">askme.pk</strong>
            </p>
            <p className="text-[11px] text-slate-400">
              All official student credentials and certificates carry verification signatures originating from this address space.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          {sent ? (
            <div className="p-10 rounded-2xl bg-void-card border border-circuit-green/50 text-center">
              <CheckCircle2 className="w-12 h-12 text-circuit-green mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-bold text-white mb-2">
                Inquiry Dispatched
              </h3>
              <p className="text-sm font-sans text-slate-300 max-w-md mx-auto mb-6">
                Your dispatch has been delivered to the AXON Corporate Relations and Executive Directorate. A liaison officer will reply to <span className="text-cyan-axon">{formData.email}</span>.
              </p>
              <button
                onClick={() => setSent(false)}
                className="px-6 py-2.5 bg-void-subtle border border-void-border text-xs font-mono uppercase text-slate-200 rounded hover:border-slate-500"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 rounded-xl bg-void-card border border-void-border space-y-6 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-300 mb-2">YOUR NAME *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Salman / Sarah Jenkins"
                    className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. partner@organization.com"
                    className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2">ORGANIZATION / COMPANY</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. Technology Firm, Venture Studio, University"
                    className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2">NATURE OF INQUIRY</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
                  >
                    <option value="Institutional Partnership">University Chapter Incubation</option>
                    <option value="Corporate Sponsorship">Event / Hackathon Sponsorship</option>
                    <option value="Speaker / Workshop Lead">Technical Speaker Proposal</option>
                    <option value="Talent Recruitment">Recruitment / Member Hiring</option>
                    <option value="General Inquiry">General Executive Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-2">MESSAGE *</label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Outline your proposal, timeline, or inquiry..."
                  className="w-full bg-void-400 border border-void-border rounded px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs font-sans"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 bg-cyan-axon hover:bg-cyan-300 text-void-500 font-bold uppercase rounded transition-all flex items-center gap-2"
              >
                <span>Dispatch Institutional Note</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
