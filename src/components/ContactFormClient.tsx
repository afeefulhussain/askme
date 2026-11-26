"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactFormClient() {
  const [sentId, setSentId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    subject: "Institutional Partnership",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to send inquiry.");
      } else {
        setSentId(data.inquiry?.id || "DISPATCHED");
      }
    } catch {
      setError("Network error while sending inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sentId) {
    return (
      <div className="p-10 rounded-2xl bg-void-card border border-circuit-green/50 text-center">
        <CheckCircle2 className="w-12 h-12 text-circuit-green mx-auto mb-4" />
        <div className="font-mono text-xs text-cyan-axon mb-2">
          DISPATCH REF: {sentId.toUpperCase()}
        </div>
        <h3 className="font-serif text-2xl font-bold text-white mb-2">
          Inquiry Dispatched to Secretariat
        </h3>
        <p className="text-sm font-sans text-slate-300 max-w-md mx-auto mb-6">
          Your message has been logged for the AXON Corporate Relations and
          Executive Directorate. A liaison officer will respond to{" "}
          <span className="text-cyan-axon">{formData.email}</span>.
        </p>
        <button
          type="button"
          onClick={() => {
            setSentId(null);
            setFormData({
              name: "",
              organization: "",
              email: "",
              subject: "Institutional Partnership",
              message: "",
            });
          }}
          className="px-6 py-2.5 bg-void-subtle border border-void-border text-xs font-mono uppercase text-slate-200 rounded hover:border-slate-500"
        >
          Send Another Note
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 rounded-xl bg-void-card border border-void-border space-y-6 font-mono text-xs"
    >
      {error && (
        <div className="p-3 rounded bg-red-500/10 border border-red-500/40 text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

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
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="e.g. partner@organization.com"
            className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-2">
            ORGANIZATION / COMPANY
          </label>
          <input
            type="text"
            value={formData.organization}
            onChange={(e) =>
              setFormData({ ...formData, organization: e.target.value })
            }
            placeholder="e.g. Technology Firm, Venture Studio, University"
            className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-2">NATURE OF INQUIRY</label>
          <select
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
          >
            <option value="Institutional Partnership">
              University Chapter Incubation
            </option>
            <option value="Corporate Sponsorship">
              Event / Hackathon Sponsorship
            </option>
            <option value="Speaker / Workshop Lead">
              Technical Speaker Proposal
            </option>
            <option value="Talent Recruitment">
              Recruitment / Member Hiring
            </option>
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
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          placeholder="Outline your proposal, timeline, or inquiry..."
          className="w-full bg-void-400 border border-void-border rounded px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon text-xs font-sans"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="px-8 py-3.5 bg-cyan-axon hover:bg-cyan-300 text-void-500 font-bold uppercase rounded transition-all flex items-center gap-2 disabled:opacity-60"
      >
        <span>
          {submitting ? "Dispatching..." : "Dispatch Institutional Note"}
        </span>
        <Send className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}
