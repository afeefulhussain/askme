"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, CheckCircle2, AlertCircle, Search, Hash, Calendar, Building, Award, User, RefreshCw } from "lucide-react";
import { CERTIFICATES_DATABASE, VerifiedCertificate } from "@/data/axonData";

interface VerificationEngineProps {
  initialCode?: string;
}

export default function VerificationEngine({ initialCode = "" }: VerificationEngineProps) {
  const [query, setQuery] = useState(initialCode);
  const [result, setResult] = useState<VerifiedCertificate | null | "not_found">(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialCode) {
      handleSearch(initialCode);
    }
  }, [initialCode]);

  const handleSearch = (codeToSearch?: string) => {
    const code = (codeToSearch || query).trim().toUpperCase();
    if (!code) return;

    setLoading(true);
    setHasSearched(true);

    setTimeout(() => {
      const match = CERTIFICATES_DATABASE.find(
        (c) =>
          c.certCode.toUpperCase() === code ||
          (c.memberId && c.memberId.toUpperCase() === code) ||
          c.recipientName.toUpperCase().includes(code)
      );

      setResult(match || "not_found");
      setLoading(false);
    }, 350);
  };

  return (
    <div className="w-full">
      {/* Search Input Box */}
      <div className="bg-void-card border border-void-border p-6 rounded-lg shadow-xl">
        <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
          Enter Certificate Verification Code or Member ID
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. AXN-2026-018 or AXN-CERT-9042"
              className="w-full bg-void-400 border border-void-border rounded px-4 py-3 font-mono text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-axon transition-colors"
            />
            <span className="absolute right-3 top-3.5 text-xs font-mono text-slate-500">
              SHA-160
            </span>
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-6 py-3 bg-cyan-axon hover:bg-cyan-300 text-void-500 font-mono text-xs uppercase font-bold tracking-wider rounded transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Verify Record</span>
          </button>
        </div>

        {/* Quick sample chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-500 text-[11px]">Audit Samples:</span>
          {["AXN-2026-018", "AXN-CERT-9042", "AXN-CERT-8819"].map((sample) => (
            <button
              key={sample}
              onClick={() => {
                setQuery(sample);
                handleSearch(sample);
              }}
              className="px-2 py-0.5 bg-void-subtle border border-void-border/80 hover:border-cyan-axon/60 text-slate-300 rounded text-[11px] transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Output */}
      {hasSearched && (
        <div className="mt-8 transition-all">
          {loading ? (
            <div className="p-8 text-center bg-void-card border border-void-border rounded-lg">
              <RefreshCw className="w-6 h-6 text-cyan-axon animate-spin mx-auto mb-2" />
              <div className="text-xs font-mono text-slate-400">
                Querying AXON Institutional Cryptographic Registry...
              </div>
            </div>
          ) : result && result !== "not_found" ? (
            <div className="bg-void-card border border-circuit-green/40 rounded-lg p-6 sm:p-8 relative overflow-hidden shadow-2xl">
              {/* Background watermark badge */}
              <div className="absolute -right-8 -bottom-8 text-circuit-green/[0.04] pointer-events-none">
                <ShieldCheck className="w-64 h-64" />
              </div>

              {/* Status Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-void-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-circuit-green/10 border border-circuit-green flex items-center justify-center text-circuit-green">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-circuit-green/20 text-circuit-green border border-circuit-green/30 font-bold">
                        AUTHENTIC // STATUS: {result.status.toUpperCase()}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {result.type}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                      {result.recipientName}
                    </h3>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <div className="text-slate-400">CREDENTIAL ID</div>
                  <div className="text-cyan-axon font-bold text-sm tracking-wider">
                    {result.certCode}
                  </div>
                </div>
              </div>

              {/* Verification Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 font-mono text-xs border-b border-void-border">
                <div className="space-y-4">
                  <div>
                    <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                      <Award className="w-3.5 h-3.5 text-cyan-axon" />
                      <span>OFFICIAL CITATION / ROLE</span>
                    </div>
                    <div className="text-slate-200 font-sans text-sm font-medium">
                      {result.eventOrRole}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                      <Building className="w-3.5 h-3.5 text-cyan-axon" />
                      <span>ISSUER AUTHORITY</span>
                    </div>
                    <div className="text-slate-300">
                      {result.issuerAuthority}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-axon" />
                      <span>DATE OF OFFICIAL ISSUANCE</span>
                    </div>
                    <div className="text-slate-200">
                      {result.issueDate}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                      <Hash className="w-3.5 h-3.5 text-cyan-axon" />
                      <span>CRYPTOGRAPHIC AUDIT HASH</span>
                    </div>
                    <div className="text-slate-400 text-[11px] break-all select-all bg-void-400 p-2 rounded border border-void-border/70">
                      {result.hash}
                    </div>
                  </div>
                </div>
              </div>

              {/* Institutional Footer Seal */}
              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-circuit-green"></span>
                  <span>RECORD PERMANENTLY ANCHORED IN AXON IMAC ARCHIVES</span>
                </div>
                <div className="text-slate-400">
                  UET LAHORE CHAPTER // NODE 01
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-void-card border border-red-500/30 rounded-lg p-6 sm:p-8 text-center">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <h3 className="text-lg font-serif font-bold text-white mb-2">
                Credential Record Not Found
              </h3>
              <p className="text-xs font-mono text-slate-400 max-w-md mx-auto mb-4">
                The identifier <span className="text-white font-bold">&quot;{query}&quot;</span> does not match any active certificate or member identity in the AXON verification registry.
              </p>
              <div className="text-[11px] font-mono text-slate-400">
                If you believe this is an administrative discrepancy, contact the AXON Executive Council at{" "}
                <a href="mailto:axon@askme.pk" className="text-cyan-axon underline">
                  axon@askme.pk
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
