import React from "react";

export default function PortfolioLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0F172A]">
      <div className="border-b border-[#E5E7EB] h-16 px-5 sm:px-8 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E2E8F0] animate-pulse" />
          <div className="h-4 w-32 rounded bg-[#E2E8F0] animate-pulse" />
        </div>
        <div className="h-8 w-24 rounded-full bg-[#E2E8F0] animate-pulse" />
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-16 pb-20 space-y-16">
        <div className="space-y-6">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-full bg-[#E2E8F0] animate-pulse" />
            <div className="space-y-2.5">
              <div className="h-6 w-60 rounded-full bg-[#E2E8F0] animate-pulse" />
              <div className="h-4 w-40 rounded bg-[#E2E8F0] animate-pulse" />
            </div>
          </div>
          <div className="h-12 w-full max-w-2xl rounded-lg bg-[#E2E8F0] animate-pulse" />
          <div className="h-16 w-full max-w-xl rounded-lg bg-[#E2E8F0] animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1].map((idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden"
            >
              <div className="aspect-[16/10] w-full bg-[#E2E8F0] animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-4 w-24 rounded bg-[#E2E8F0] animate-pulse" />
                <div className="h-6 w-3/4 rounded bg-[#E2E8F0] animate-pulse" />
                <div className="h-4 w-full rounded bg-[#E2E8F0] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
