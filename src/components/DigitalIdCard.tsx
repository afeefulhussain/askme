"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, QrCode, Download, ExternalLink, Cpu, CheckCircle } from "lucide-react";
import { AxonMember } from "@/data/axonData";

interface DigitalIdCardProps {
  member: AxonMember;
}

export default function DigitalIdCard({ member }: DigitalIdCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Physical-Style Institutional ID Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#141B28] via-[#0D121D] to-[#080B12] border-2 border-void-border/90 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-slate-100 p-6 transition-all hover:border-cyan-axon/50">
        {/* Subtle decorative security micro-hologram header */}
        <div className="flex items-center justify-between border-b border-void-border/70 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-void-500 border border-void-border flex items-center justify-center font-mono font-bold text-cyan-axon shadow-inner">
              AX
            </div>
            <div>
              <div className="font-serif font-bold text-base tracking-tight text-white">
                AXON NETWORK
              </div>
              <div className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">
                INSTITUTIONAL MEMBER CREDENTIAL
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-circuit-green/20 text-circuit-green border border-circuit-green/30 text-[10px] font-mono font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-circuit-green animate-pulse"></span>
              <span>VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Member Photo & Primary Metadata */}
        <div className="flex gap-4 items-start mb-5">
          {/* Photo Frame */}
          <div className="relative shrink-0">
            <div className="w-24 h-28 rounded-lg overflow-hidden border border-void-border bg-void-500 shadow-md">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-full object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-void-400 border border-void-border p-1 rounded-full text-cyan-axon shadow">
              <Cpu className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 font-mono">
            <div className="text-[10px] text-slate-400 tracking-wider">MEMBER IDENTITY</div>
            <h4 className="font-serif text-lg font-bold text-white truncate leading-tight mt-0.5">
              {member.name}
            </h4>

            <div className="mt-2 space-y-1 text-xs">
              <div>
                <span className="text-slate-400 text-[10px]">ROLE: </span>
                <span className="text-cyan-axon font-semibold">{member.role}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">DIRECTORATE: </span>
                <span className="text-slate-200 text-[11px] block truncate">{member.wing}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">CHAPTER: </span>
                <span className="text-slate-300 text-[11px] block truncate">{member.chapter}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer: ID, Barcode, & Live QR Code */}
        <div className="border-t border-void-border/70 pt-4 flex items-center justify-between gap-4 font-mono">
          <div>
            <div className="text-[10px] text-slate-400">CREDENTIAL ID</div>
            <div className="text-white font-bold text-sm tracking-widest text-cyan-axon">
              {member.memberId}
            </div>
            <div className="text-[9px] text-slate-400 mt-1">
              VALIDITY: 2026 – 2028 // IMAC-01
            </div>
          </div>

          {/* Live QR Box linking to verification */}
          <Link
            href={`/verify?code=${member.memberId}`}
            className="group/qr shrink-0 flex flex-col items-center p-2 rounded bg-white text-void-500 shadow hover:opacity-90 transition-opacity"
            title="Scan to verify official credential"
          >
            {/* SVG Representation of QR Code */}
            <div className="w-12 h-12 flex items-center justify-center">
              <QrCode className="w-11 h-11 text-void-500" />
            </div>
            <span className="text-[8px] font-bold tracking-tight text-void-500 group-hover/qr:underline">
              SCAN TO VERIFY
            </span>
          </Link>
        </div>

        {/* Security Guilloche Micro-Stripe */}
        <div className="mt-4 pt-2 border-t border-void-border/40 flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span>SECURE CRYPTO RECORD</span>
          <span>AUTHO-SEAL: 0x8F4D92...</span>
        </div>
      </div>

      {/* Action Controls for Member */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleExport}
          disabled={downloading}
          className="flex-1 py-2.5 px-4 bg-void-card border border-void-border hover:border-cyan-axon text-slate-200 hover:text-white text-xs font-mono font-medium rounded flex items-center justify-center gap-2 transition-all"
        >
          {downloadSuccess ? (
            <>
              <CheckCircle className="w-4 h-4 text-circuit-green" />
              <span className="text-circuit-green">Exported (PNG/PDF)</span>
            </>
          ) : downloading ? (
            <>
              <div className="w-4 h-4 border-2 border-cyan-axon border-t-transparent rounded-full animate-spin" />
              <span>Rendering Hi-Res ID...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-cyan-axon" />
              <span>Export High-Res ID Card</span>
            </>
          )}
        </button>

        <Link
          href={`/u/${member.username}`}
          className="py-2.5 px-4 bg-cyan-axon text-void-500 hover:bg-cyan-300 font-mono text-xs font-bold uppercase rounded flex items-center justify-center gap-1.5 transition-all shadow-sm"
        >
          <span>View Public Portfolio</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
