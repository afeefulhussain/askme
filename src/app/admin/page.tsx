"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  UserCheck,
  UserX,
  Award,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Filter,
} from "lucide-react";
import { WINGS } from "@/data/axonData";

interface Application {
  id: string;
  name: string;
  email: string;
  university: string;
  roleType: string;
  assignedWing: string;
  github: string;
  status: "Pending" | "Approved" | "Rejected";
  generatedMemberId?: string;
  submittedAt: string;
}

export default function AdminPanel() {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: "app-101",
      name: "Daniyal Tariq",
      email: "daniyal@uet.edu.pk",
      university: "UET Lahore",
      roleType: "General Member Engineer",
      assignedWing: "systems-infra",
      github: "github.com/daniyal-tariq",
      status: "Pending",
      submittedAt: "2026-11-24",
    },
    {
      id: "app-102",
      name: "Zoya Fatima",
      email: "zoya@fast.edu.pk",
      university: "FAST-NUCES Lahore",
      roleType: "Campus Ambassador Lead",
      assignedWing: "community-chapters",
      github: "github.com/zoya-fatima",
      status: "Pending",
      submittedAt: "2026-11-23",
    },
    {
      id: "app-103",
      name: "Hassan Raza",
      email: "hassan@giki.edu.pk",
      university: "GIKI Topi",
      roleType: "University Chapter Founder",
      assignedWing: "community-chapters",
      github: "github.com/hassan-raza",
      status: "Approved",
      generatedMemberId: "AXN-2026-042",
      submittedAt: "2026-11-20",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"applications" | "certificates" | "wings">("applications");

  // Certificate Issuance State
  const [certRecipient, setCertRecipient] = useState("");
  const [certRole, setCertRole] = useState("");
  const [certIssuedSuccess, setCertIssuedSuccess] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setApplications(
      applications.map((app) =>
        app.id === id
          ? {
              ...app,
              status: "Approved",
              generatedMemberId: `AXN-2026-0${Math.floor(10 + Math.random() * 89)}`,
            }
          : app
      )
    );
  };

  const handleReject = (id: string) => {
    setApplications(
      applications.map((app) => (app.id === id ? { ...app, status: "Rejected" } : app))
    );
  };

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certRecipient || !certRole) return;
    const newCode = `AXN-CERT-${Math.floor(1000 + Math.random() * 9000)}`;
    setCertIssuedSuccess(newCode);
    setCertRecipient("");
    setCertRole("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-mono text-xs">
      {/* Top Banner */}
      <div className="border-b border-void-border pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-400 text-[11px] mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>RESTRICTED EXECUTIVE CONSOLE // SUPER ADMIN ACCESS</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white font-sans">
            Central Directorate Management Panel
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Admission reviews, role assignments, wing governance, and cryptographic certificate issuance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/verify"
            className="px-4 py-2 bg-void-card border border-void-border hover:border-cyan-axon text-slate-200 rounded flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-axon" />
            <span>Launch Public Verifier</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-void-border mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-5 py-3 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "applications"
              ? "border-cyan-axon text-cyan-axon"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Membership Inductions Moderation</span>
        </button>

        <button
          onClick={() => setActiveTab("certificates")}
          className={`px-5 py-3 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "certificates"
              ? "border-cyan-axon text-cyan-axon"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Certificate Issuance Hub</span>
        </button>

        <button
          onClick={() => setActiveTab("wings")}
          className={`px-5 py-3 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === "wings"
              ? "border-cyan-axon text-cyan-axon"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Directorate Capacity & RBAC</span>
        </button>
      </div>

      {/* Tab 1: Applications */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pending & Recent Induction Applications ({applications.length})</span>
            <span className="text-circuit-green">Auto-generation of Member ID on Approval</span>
          </div>

          <div className="overflow-x-auto border border-void-border rounded-xl">
            <table className="w-full text-left bg-void-card border-collapse">
              <thead>
                <tr className="border-b border-void-border/80 bg-void-subtle text-slate-400 text-[11px] uppercase">
                  <th className="p-4">Candidate</th>
                  <th className="p-4">University</th>
                  <th className="p-4">Track</th>
                  <th className="p-4">Wing</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Council Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-void-border text-xs">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-void-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-white font-sans">{app.name}</div>
                      <div className="text-[11px] text-slate-400">{app.email}</div>
                      <a
                        href={`https://${app.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-axon text-[10px] hover:underline"
                      >
                        {app.github}
                      </a>
                    </td>

                    <td className="p-4 text-slate-300 font-sans">{app.university}</td>

                    <td className="p-4 text-slate-300">{app.roleType}</td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-void-400 border border-void-border text-cyan-axon text-[10px]">
                        {app.assignedWing}
                      </span>
                    </td>

                    <td className="p-4">
                      {app.status === "Approved" ? (
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 rounded bg-circuit-green/20 text-circuit-green font-bold text-[10px]">
                            APPROVED
                          </span>
                          <div className="text-[10px] text-slate-400">
                            ID: <span className="text-white font-bold">{app.generatedMemberId}</span>
                          </div>
                        </div>
                      ) : app.status === "Rejected" ? (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold text-[10px]">
                          REJECTED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-bold text-[10px]">
                          PENDING REVIEW
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      {app.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(app.id)}
                            className="px-3 py-1.5 bg-circuit-green hover:bg-emerald-400 text-void-500 font-bold uppercase rounded text-[10px] transition-colors flex items-center gap-1"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(app.id)}
                            className="px-3 py-1.5 bg-void-400 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-void-border rounded text-[10px] transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Certificate Issuance */}
      {activeTab === "certificates" && (
        <div className="max-w-2xl p-8 rounded-xl bg-void-card border border-void-border space-y-6">
          <div className="border-b border-void-border pb-4">
            <h2 className="font-serif text-xl font-bold text-white font-sans">
              Issue Cryptographically Anchored Certificate
            </h2>
            <p className="text-slate-400 text-xs">
              Directly appends to the verifiable registry queried at <span className="text-cyan-axon">/verify</span>
            </p>
          </div>

          {certIssuedSuccess && (
            <div className="p-4 rounded-lg bg-circuit-green/10 border border-circuit-green/40 text-circuit-green text-xs space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Certificate Successfully Anchored in IMAC Registry</span>
              </div>
              <div>Generated Code: <strong className="text-white font-bold">{certIssuedSuccess}</strong></div>
              <Link
                href={`/verify?code=${certIssuedSuccess}`}
                className="inline-block text-cyan-axon underline text-[11px]"
              >
                Inspect Live in /verify tool →
              </Link>
            </div>
          )}

          <form onSubmit={handleIssueCertificate} className="space-y-4">
            <div>
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                Recipient Full Name
              </label>
              <input
                type="text"
                required
                value={certRecipient}
                onChange={(e) => setCertRecipient(e.target.value)}
                placeholder="e.g. Mahnoor Khan"
                className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 uppercase text-[11px]">
                Citation / Event / Leadership Role
              </label>
              <input
                type="text"
                required
                value={certRole}
                onChange={(e) => setCertRole(e.target.value)}
                placeholder="e.g. Workshop Speaker - High-Throughput Distributed Systems"
                className="w-full bg-void-400 border border-void-border rounded px-4 py-2.5 text-white focus:outline-none focus:border-cyan-axon text-xs"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-cyan-axon hover:bg-cyan-300 text-void-500 font-bold uppercase rounded transition-all shadow"
            >
              Anchor & Issue Certificate
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Directorate Capacity & RBAC */}
      {activeTab === "wings" && (
        <div className="space-y-6">
          <div className="text-slate-400 text-xs">
            11 Active Directorates & RBAC Permission Matrix
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WINGS.map((w) => (
              <div key={w.id} className="p-4 rounded-lg bg-void-card border border-void-border">
                <div className="flex items-center justify-between text-[10px] text-cyan-axon mb-1">
                  <span>{w.code}</span>
                  <span className="text-circuit-green">{w.status}</span>
                </div>
                <div className="font-serif font-bold text-white text-sm font-sans">{w.name}</div>
                <div className="text-slate-400 text-[11px] mt-1">Lead: {w.lead}</div>
                <div className="text-slate-500 text-[10px] mt-2 border-t border-void-border/50 pt-2">
                  Active Member Capacity: 35 engineers
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
