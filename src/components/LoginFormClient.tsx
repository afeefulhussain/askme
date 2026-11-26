"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Github, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";

type TierOption =
  | "approved_member"
  | "wing_director"
  | "super_admin"
  | "pending_applicant";

const DEMO_EMAILS: Record<TierOption, string> = {
  approved_member: "mahnoor@axon.org.pk",
  wing_director: "talha@axon.org.pk",
  super_admin: "irfan@axon.org.pk",
  pending_applicant: "daniyal@uet.edu.pk",
};

export default function LoginFormClient() {
  const router = useRouter();
  const [tier, setTier] = useState<TierOption>("approved_member");
  const [email, setEmail] = useState(DEMO_EMAILS.approved_member);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectTier = (nextTier: TierOption) => {
    setTier(nextTier);
    setEmail(DEMO_EMAILS[nextTier]);
    setError(null);
  };

  const performLogin = async (overrideTier?: TierOption, overrideEmail?: string) => {
    setLoading(true);
    setError(null);
    const chosenTier = overrideTier || tier;
    const chosenEmail = overrideEmail || email;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: chosenEmail, tier: chosenTier }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Authentication failed.");
        setLoading(false);
        return;
      }

      window.dispatchEvent(new Event("axon-auth-changed"));
      const role = data.user?.rbacRole;

      if (role === "super_admin" || role === "wing_director") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch {
      setError("Network error during authentication.");
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin();
  };

  return (
    <div className="p-8 rounded-2xl bg-void-card border border-void-border shadow-2xl font-mono text-xs">
      <div className="text-center mb-8">
        <div className="w-10 h-10 rounded bg-void-500 border border-void-border flex items-center justify-center font-bold text-cyan-axon mx-auto mb-3">
          AX
        </div>
        <h1 className="font-serif text-2xl font-bold text-white font-sans">
          AXON Member & Council Portal
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          HMAC-Signed RBAC Session Authentication
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/40 text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-300 mb-2 uppercase text-[11px]">
            Select RBAC Access Tier (Blueprint 8.8)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: "approved_member", label: "Approved Member" },
                { id: "wing_director", label: "Wing Director" },
                { id: "super_admin", label: "Super Admin" },
                { id: "pending_applicant", label: "Pending Applicant" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => selectTier(opt.id)}
                className={`py-2 px-2 rounded border text-center text-[11px] transition-colors ${
                  tier === opt.id
                    ? "bg-cyan-axon text-void-500 border-cyan-axon font-bold"
                    : "bg-void-400 border-void-border text-slate-300 hover:border-slate-500"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
            Institutional Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="irfan@axon.org.pk"
            className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
            Passkey / Password
          </label>
          <input
            type="password"
            defaultValue="axon-imac-passkey"
            className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-cyan-axon hover:bg-cyan-300 text-void-500 font-bold uppercase rounded transition-all flex items-center justify-center gap-2 mt-2 shadow disabled:opacity-60"
        >
          <span>
            {loading
              ? "Authenticating..."
              : `Sign In (${tier.replace("_", " ")})`}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-void-border/60 text-center">
        <div className="text-slate-400 text-[11px] mb-3">
          Or authenticate via Linked GitHub Identity
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => performLogin("super_admin", "irfan@axon.org.pk")}
          className="w-full py-2.5 bg-void-subtle border border-void-border hover:border-slate-500 text-slate-200 rounded flex items-center justify-center gap-2 transition-colors"
        >
          <Github className="w-4 h-4 text-cyan-axon" />
          <span>Continue with GitHub OAuth (irfanullah)</span>
        </button>
      </div>

      <div className="mt-6 pt-4 border-t border-void-border/40 text-center text-slate-500 text-[10px] flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-circuit-green" />
        <span>AXON IMAC Identity Provider // HttpOnly Session Cookie</span>
      </div>
    </div>
  );
}
