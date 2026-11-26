"use client";

import React, { useState } from "react";
import { Check, Copy, FileDown, QrCode, X } from "lucide-react";
import QrCodeSvg from "@/components/QrCodeSvg";

interface PortfolioActionsProps {
  username: string;
  memberName: string;
}

export default function PortfolioActions({
  username,
  memberName,
}: PortfolioActionsProps) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/u/${username}`
      : `https://axon.org.pk/u/${username}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-xs no-print relative">
      <button
        type="button"
        onClick={handleCopy}
        className="px-3 py-1.5 bg-void-subtle border border-void-border hover:border-cyan-axon text-slate-200 rounded flex items-center gap-1.5 transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-circuit-green" />
            <span className="text-circuit-green">Link Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-cyan-axon" />
            <span>Copy Share URL</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => setShowQr((s) => !s)}
        className="px-3 py-1.5 bg-void-subtle border border-void-border hover:border-cyan-axon text-slate-200 rounded flex items-center gap-1.5 transition-colors"
      >
        <QrCode className="w-3.5 h-3.5 text-cyan-axon" />
        <span>Share QR</span>
      </button>

      <button
        type="button"
        onClick={() => window.print()}
        className="px-3 py-1.5 bg-cyan-axon text-void-500 hover:bg-cyan-300 font-bold rounded flex items-center gap-1.5 transition-colors"
        title="Compile recruiter-ready Resume / CV PDF"
      >
        <FileDown className="w-3.5 h-3.5" />
        <span>Export CV / PDF</span>
      </button>

      {showQr && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-void-card border border-void-border rounded-xl p-6 max-w-xs w-full text-center relative shadow-2xl">
            <button
              type="button"
              onClick={() => setShowQr(false)}
              className="absolute right-3 top-3 text-slate-400 hover:text-white"
              aria-label="Close QR dialog"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-[10px] text-cyan-axon uppercase tracking-widest mb-1">
              SHAREABLE PORTFOLIO QR
            </div>
            <div className="font-serif text-lg font-bold text-white mb-4">
              {memberName}
            </div>
            <div className="inline-block p-3 bg-white rounded-lg shadow">
              <QrCodeSvg value={shareUrl} size={160} />
            </div>
            <div className="mt-3 text-[11px] text-slate-400 break-all">
              {shareUrl}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
