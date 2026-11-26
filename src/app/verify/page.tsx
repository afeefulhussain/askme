import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ShieldCheck, FileCheck } from "lucide-react";
import VerificationEngine from "@/components/VerificationEngine";

export const metadata: Metadata = {
  title: "Credential Verification Registry",
  description:
    "Official AXON verification portal for validating student member credentials, workshop certificates, and leadership appointments originating at IMAC UET Lahore.",
  alternates: { canonical: "https://axon.org.pk/verify" },
};

interface VerifyPageProps {
  searchParams: {
    code?: string;
    id?: string;
  };
}

export default function VerifyPage({ searchParams }: VerifyPageProps) {
  const code = searchParams.code || searchParams.id || "";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-void-card border border-void-border text-xs font-mono text-cyan-axon uppercase mb-4">
          <ShieldCheck className="w-4 h-4" />
          <span>CRYPTOGRAPHIC VERIFICATION REGISTRY</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white">
          Institutional Credential & Member Verification
        </h1>

        <p className="mt-4 text-sm text-slate-300 font-sans leading-relaxed">
          Verify the authenticity of AXON credentials, student identification
          badges, and technical certifications issued by the Executive Council
          and IMAC Directorate at UET Lahore.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="text-center text-xs font-mono text-slate-500">
            Initializing Engine...
          </div>
        }
      >
        <VerificationEngine initialCode={code} />
      </Suspense>

      <div className="mt-16 p-6 rounded-lg bg-void-card/60 border border-void-border font-mono text-xs text-slate-400">
        <div className="text-white font-semibold uppercase text-[11px] mb-2 flex items-center gap-2">
          <FileCheck className="w-3.5 h-3.5 text-circuit-green" />
          <span>Institutional Verification Standards</span>
        </div>
        <p className="text-[11px] font-sans leading-relaxed text-slate-400">
          All issued AXON certificates and Digital Member IDs are
          cryptographically hashed and logged within the central IMAC database.
          Certificates that have been revoked or invalidated clearly display an
          official REVOKED flag. Employers requiring direct academic
          confirmation may contact{" "}
          <span className="text-cyan-axon">axon@askme.pk</span>.
        </p>
      </div>
    </div>
  );
}
