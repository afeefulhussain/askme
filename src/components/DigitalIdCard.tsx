"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import {
  Download,
  ExternalLink,
  Cpu,
  CheckCircle,
  Printer,
} from "lucide-react";
import type {
  AxonMember,
  PublicAxonMember,
  SafeSessionMember,
} from "@/lib/types";
import QrCodeSvg from "@/components/QrCodeSvg";

interface DigitalIdCardProps {
  member: AxonMember | SafeSessionMember | PublicAxonMember;
}

export default function DigitalIdCard({ member }: DigitalIdCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const verifyUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify?code=${encodeURIComponent(member.memberId)}`
      : `https://askme.pk/verify?code=${encodeURIComponent(member.memberId)}`;

  const handleExportPng = async () => {
    setDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1050;
      canvas.height = 660;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background
      const grad = ctx.createLinearGradient(0, 0, 0, 660);
      grad.addColorStop(0, "#141B28");
      grad.addColorStop(0.5, "#0D121D");
      grad.addColorStop(1, "#07090E");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1050, 660);

      // Outer border
      ctx.strokeStyle = "#1E2738";
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, 1010, 620);

      // Header seal
      ctx.fillStyle = "#07090E";
      ctx.fillRect(56, 54, 72, 72);
      ctx.strokeStyle = "#00F0FF";
      ctx.lineWidth = 2;
      ctx.strokeRect(56, 54, 72, 72);

      ctx.fillStyle = "#00F0FF";
      ctx.font = "bold 32px monospace";
      ctx.fillText("AX", 71, 101);

      ctx.fillStyle = "#F8FAFC";
      ctx.font = "bold 28px Georgia, serif";
      ctx.fillText("AXON NETWORK", 148, 86);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "15px monospace";
      ctx.fillText("INSTITUTIONAL MEMBER CREDENTIAL // IMAC NODE 01", 148, 114);

      // Status pill
      ctx.fillStyle = "rgba(16, 185, 129, 0.18)";
      ctx.fillRect(820, 62, 174, 40);
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(820, 62, 174, 40);
      ctx.fillStyle = "#10B981";
      ctx.font = "bold 16px monospace";
      ctx.fillText("● VERIFIED", 848, 88);

      // Divider
      ctx.strokeStyle = "#1E2738";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(56, 152);
      ctx.lineTo(994, 152);
      ctx.stroke();

      // Avatar monogram frame
      ctx.fillStyle = "#101622";
      ctx.fillRect(56, 186, 210, 240);
      ctx.strokeStyle = "#1E2738";
      ctx.strokeRect(56, 186, 210, 240);

      const initials = member.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
      ctx.fillStyle = "#00F0FF";
      ctx.font = "bold 64px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(initials, 161, 324);
      ctx.textAlign = "left";

      // Member Metadata
      ctx.fillStyle = "#94A3B8";
      ctx.font = "15px monospace";
      ctx.fillText("MEMBER IDENTITY", 300, 206);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 40px Georgia, serif";
      ctx.fillText(member.name, 300, 256);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "15px monospace";
      ctx.fillText("ROLE:", 300, 304);
      ctx.fillStyle = "#00F0FF";
      ctx.font = "bold 20px monospace";
      ctx.fillText(member.designation, 360, 304);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "15px monospace";
      ctx.fillText("DIRECTORATE:", 300, 350);
      ctx.fillStyle = "#E2E8F0";
      ctx.font = "20px sans-serif";
      ctx.fillText(member.wing, 300, 378);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "15px monospace";
      ctx.fillText("CHAPTER:", 300, 416);
      ctx.fillStyle = "#CBD5E1";
      ctx.font = "18px sans-serif";
      ctx.fillText(member.chapter, 396, 416);

      // Footer divider
      ctx.strokeStyle = "#1E2738";
      ctx.beginPath();
      ctx.moveTo(56, 464);
      ctx.lineTo(994, 464);
      ctx.stroke();

      // Credential ID
      ctx.fillStyle = "#94A3B8";
      ctx.font = "15px monospace";
      ctx.fillText("CREDENTIAL ID", 56, 508);

      ctx.fillStyle = "#00F0FF";
      ctx.font = "bold 32px monospace";
      ctx.fillText(member.memberId, 56, 550);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "14px monospace";
      ctx.fillText("VALIDITY: 2026 – 2028 // IMAC, UET LAHORE", 56, 588);

      // Real scannable QR code on canvas
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        width: 140,
        margin: 1,
        color: { dark: "#0A0D14", light: "#FFFFFF" },
      });
      const qrImg = new window.Image();
      qrImg.src = qrDataUrl;
      await new Promise<void>((resolve) => {
        qrImg.onload = () => resolve();
        qrImg.onerror = () => resolve();
      });
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(844, 480, 148, 148);
      ctx.drawImage(qrImg, 848, 484, 140, 140);

      const link = document.createElement("a");
      link.download = `AXON-ID-${member.memberId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Physical-Style Institutional ID Card */}
      <div className="print-id-card relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#141B28] via-[#0D121D] to-[#080B12] border-2 border-void-border/90 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-slate-100 p-6 transition-all hover:border-cyan-axon/50">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-void-border/70 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-void-500 border border-void-border flex items-center justify-center p-1 shadow-inner">
              <Image
                src="/assets/axon-mark.svg"
                alt="AXON"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-serif font-bold text-base tracking-tight text-white">
                AXON NETWORK
              </div>
              <div className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">
                TOGETHER WE TRANSMIT // IMAC-01
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
          <div className="relative shrink-0">
            <div className="w-24 h-28 rounded-lg overflow-hidden border border-void-border bg-void-500 shadow-md">
              <Image
                src={member.avatar}
                alt={member.name}
                width={96}
                height={112}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-void-400 border border-void-border p-1 rounded-full text-cyan-axon shadow">
              <Cpu className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex-1 min-w-0 font-mono">
            <div className="text-[10px] text-slate-400 tracking-wider">
              MEMBER IDENTITY
            </div>
            <h4 className="font-serif text-lg font-bold text-white truncate leading-tight mt-0.5">
              {member.name}
            </h4>

            <div className="mt-2 space-y-1 text-xs">
              <div>
                <span className="text-slate-400 text-[10px]">ROLE: </span>
                <span className="text-cyan-axon font-semibold">
                  {member.designation}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">DIRECTORATE: </span>
                <span className="text-slate-200 text-[11px] block truncate">
                  {member.wing}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">CHAPTER: </span>
                <span className="text-slate-300 text-[11px] block truncate">
                  {member.chapter}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer: ID & Live Scannable QR Code */}
        <div className="border-t border-void-border/70 pt-4 flex items-center justify-between gap-4 font-mono">
          <div>
            <div className="text-[10px] text-slate-400">CREDENTIAL ID</div>
            <div className="font-bold text-sm tracking-widest text-cyan-axon">
              {member.memberId}
            </div>
            <div className="text-[9px] text-slate-400 mt-1">
              VALIDITY: 2026 – 2028 // IMAC-01
            </div>
          </div>

          <Link
            href={`/verify?code=${encodeURIComponent(member.memberId)}`}
            className="group/qr shrink-0 flex flex-col items-center p-1.5 rounded bg-white text-void-500 shadow hover:opacity-90 transition-opacity"
            title="Scan QR or click to verify official credential"
          >
            <QrCodeSvg value={verifyUrl} size={58} />
            <span className="text-[7px] font-bold tracking-tight text-void-500 group-hover/qr:underline mt-0.5">
              SCAN TO VERIFY
            </span>
          </Link>
        </div>

        {/* Security Micro-Stripe */}
        <div className="mt-4 pt-2 border-t border-void-border/40 flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span>SECURE CRYPTO RECORD</span>
          <span>IMAC // UET LAHORE</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="mt-4 flex flex-col gap-2 no-print">
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={handleExportPng}
            disabled={downloading}
            className="flex-1 py-2.5 px-4 bg-void-card border border-void-border hover:border-cyan-axon text-slate-200 hover:text-white text-xs font-mono font-medium rounded flex items-center justify-center gap-2 transition-all"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 text-circuit-green" />
                <span className="text-circuit-green">Downloaded PNG</span>
              </>
            ) : downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-cyan-axon border-t-transparent rounded-full animate-spin" />
                <span>Rendering PNG...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-cyan-axon" />
                <span>Export Hi-Res PNG</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="py-2.5 px-4 bg-void-card border border-void-border hover:border-slate-500 text-slate-200 hover:text-white text-xs font-mono font-medium rounded flex items-center justify-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Vector PDF</span>
          </button>
        </div>

        <Link
          href={`/portfolio/${member.username}`}
          className="w-full py-2.5 px-4 bg-cyan-axon text-void-500 hover:bg-cyan-300 font-mono text-xs font-bold uppercase rounded flex items-center justify-center gap-1.5 transition-all shadow-sm"
        >
          <span>View Public Portfolio</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
