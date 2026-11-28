import React from "react";

export default function SkeletonGrid({
  variant = "grid",
}: {
  variant?: "grid" | "table" | "detail" | "dashboard";
}) {
  if (variant === "detail") {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div className="h-4 w-36 rounded bg-void-card animate-pulse" />
        <div className="space-y-4 border-b border-void-border pb-8">
          <div className="h-5 w-48 rounded bg-void-card animate-pulse" />
          <div className="h-12 w-full max-w-2xl rounded bg-void-card animate-pulse" />
          <div className="h-4 w-80 rounded bg-void-card animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-[16/10] w-full rounded-xl bg-void-card border border-void-border animate-pulse" />
            <div className="h-28 w-full rounded-xl bg-void-card animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-44 w-full rounded-xl bg-void-card border border-void-border animate-pulse" />
            <div className="h-56 w-full rounded-xl bg-void-card border border-void-border animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "dashboard" || variant === "table") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-void-border pb-6">
          <div className="space-y-2">
            <div className="h-4 w-52 rounded bg-void-card animate-pulse" />
            <div className="h-8 w-80 rounded bg-void-card animate-pulse" />
          </div>
          <div className="h-9 w-40 rounded bg-void-card animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-void-card border border-void-border animate-pulse"
            />
          ))}
        </div>
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 rounded-xl bg-void-card border border-void-border animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="max-w-4xl border-b border-void-border pb-10 space-y-4">
        <div className="h-4 w-48 rounded bg-void-card animate-pulse" />
        <div className="h-12 w-full max-w-xl rounded bg-void-card animate-pulse" />
        <div className="h-16 w-full max-w-2xl rounded bg-void-card animate-pulse" />
      </div>
      <div className="h-12 w-full rounded-xl bg-void-card border border-void-border animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-72 rounded-xl bg-void-card border border-void-border animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
