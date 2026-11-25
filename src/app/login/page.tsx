"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Github, Key, ArrowRight, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 font-mono text-xs">
      <div className="p-8 rounded-2xl bg-void-card border border-void-border shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded bg-void-500 border border-void-border flex items-center justify-center font-bold text-cyan-axon mx-auto mb-3">
            AX
          </div>
          <h1 className="font-serif text-2xl font-bold text-white font-sans">
            AXON Member & Admin Access
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Access Member Dashboard, Digital ID Card, or Council Panel
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
              Access Tier
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("member")}
                className={`py-2 rounded border text-center transition-colors ${
                  role === "member"
                    ? "bg-cyan-axon text-void-500 border-cyan-axon font-bold"
                    : "bg-void-400 border-void-border text-slate-300"
                }`}
              >
                Member Portal
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`py-2 rounded border text-center transition-colors ${
                  role === "admin"
                    ? "bg-cyan-axon text-void-500 border-cyan-axon font-bold"
                    : "bg-void-400 border-void-border text-slate-300"
                }`}
              >
                Council Admin
              </button>
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
              placeholder={role === "admin" ? "council@axon.org.pk" : "irfan@axon.org.pk"}
              className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
              Passkey / Password
            </label>
            <input
              type="password"
              defaultValue="password-placeholder"
              className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-cyan-axon hover:bg-cyan-300 text-void-500 font-bold uppercase rounded transition-all flex items-center justify-center gap-2 mt-2 shadow"
          >
            <span>Authenticate into {role === "admin" ? "Admin Console" : "Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-void-border/60 text-center">
          <div className="text-slate-400 text-[11px] mb-3">Or authenticate with</div>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-2.5 bg-void-subtle border border-void-border hover:border-slate-500 text-slate-200 rounded flex items-center justify-center gap-2 transition-colors"
          >
            <Github className="w-4 h-4 text-cyan-axon" />
            <span>GitHub OAuth 2.0</span>
          </button>
        </div>

        <div className="mt-6 text-center text-slate-500 text-[10px]">
          AXON IMAC Identity Provider // Strict RBAC Protection
        </div>
      </div>
    </div>
  );
}
