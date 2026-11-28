"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Copy,
  FileText,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  ShieldCheck,
  Twitter,
  X,
} from "lucide-react";
import type {
  MemberPortfolioProfile,
  MemberPortfolioProject,
} from "@/lib/types";

interface Props {
  profile: MemberPortfolioProfile;
  isDemo?: boolean;
}

function legacyCopy(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.cssText =
    "position:fixed;inset-block-start:-9999px;inset-inline-start:-9999px;opacity:0;";
  document.body.appendChild(textarea);
  const range = document.createRange();
  range.selectNodeContents(textarea);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  textarea.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  selection?.removeAllRanges();
  document.body.removeChild(textarea);
  return ok;
}

export default function PortfolioProfileClient({
  profile,
  isDemo = false,
}: Props) {
  const [selectedProject, setSelectedProject] =
    useState<MemberPortfolioProject | null>(null);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [liveStatusMsg, setLiveStatusMsg] = useState("");
  const copyTimerRef = useRef<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const hasWork = profile.projects.length > 0;
  const hasSkills = profile.skills.length > 0;
  const hasExperience = profile.experience.length > 0;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedProject) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [selectedProject]);

  // Safari < 26.2 fallback for backdrop click light-dismiss + native close sync
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleNativeClose = () => {
      setSelectedProject(null);
    };

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const { clientX: x, clientY: y } = event;
      const rect = dialog.getBoundingClientRect();
      if (
        x < rect.left ||
        x > rect.right ||
        y < rect.top ||
        y > rect.bottom
      ) {
        dialog.close();
      }
    };

    dialog.addEventListener("close", handleNativeClose);
    dialog.addEventListener("click", handleBackdropClick);
    return () => {
      dialog.removeEventListener("close", handleNativeClose);
      dialog.removeEventListener("click", handleBackdropClick);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopyEmail = async () => {
    let copied = false;
    try {
      await navigator.clipboard.writeText(profile.email);
      copied = true;
    } catch {
      copied = legacyCopy(profile.email);
    }

    if (copied) {
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
      setCopiedEmail(true);
      setLiveStatusMsg((prev) =>
        prev === "Email address copied to clipboard."
          ? "Email address copied to clipboard.\u00A0"
          : "Email address copied to clipboard."
      );
      copyTimerRef.current = window.setTimeout(() => {
        setCopiedEmail(false);
        setLiveStatusMsg("");
      }, 2000);
    }
  };

  const socialItems = [
    profile.socials.github
      ? {
          label: "GitHub",
          href: profile.socials.github,
          icon: Github,
        }
      : null,
    profile.socials.linkedin
      ? {
          label: "LinkedIn",
          href: profile.socials.linkedin,
          icon: Linkedin,
        }
      : null,
    profile.socials.x
      ? {
          label: "X",
          href: profile.socials.x.startsWith("http")
            ? profile.socials.x
            : `https://x.com/${profile.socials.x.replace(/^@/, "")}`,
          icon: Twitter,
        }
      : null,
    profile.socials.instagram
      ? {
          label: "Instagram",
          href: profile.socials.instagram.startsWith("http")
            ? profile.socials.instagram
            : `https://instagram.com/${profile.socials.instagram.replace(/^@/, "")}`,
          icon: Instagram,
        }
      : null,
    profile.socials.website
      ? {
          label: "Website",
          href: profile.socials.website,
          icon: Globe,
        }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0F172A] font-sans selection:bg-[#0F172A] selection:text-[#FAF9F6]">
      {/* Accessible status announcer for Copy Email button */}
      <span role="status" className="sr-only">
        {liveStatusMsg}
      </span>

      {/* SECTION 1: Minimal Top Nav Bar */}
      <header className="sticky top-0 z-30 border-b border-[#E5E7EB] bg-[#FAF9F6]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/talent"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#D1D5DB] bg-white text-xs font-mono font-semibold text-[#0F172A] hover:border-[#0F172A] transition-colors shrink-0"
              title="Back to AXON Verified Talent Directory"
            >
              {profile.initials}
            </Link>
            <span className="font-medium text-sm text-[#0F172A] truncate">
              {profile.fullName}
            </span>
            {isDemo && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full border border-[#D1D5DB] bg-white font-mono text-[10px] text-[#475569]">
                Demo Profile
              </span>
            )}
          </div>

          <nav
            aria-label="Portfolio sections"
            className="hidden md:flex items-center gap-6 text-sm text-[#475569]"
          >
            {hasWork && (
              <a
                href="#work"
                className="hover:text-[#0F172A] transition-colors"
              >
                Work
              </a>
            )}
            <a
              href="#about"
              className="hover:text-[#0F172A] transition-colors"
            >
              About
            </a>
            {hasExperience && (
              <a
                href="#experience"
                className="hover:text-[#0F172A] transition-colors"
              >
                Experience
              </a>
            )}
            <a
              href="#contact"
              className="hover:text-[#0F172A] transition-colors"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0F172A] text-white text-xs font-medium hover:bg-[#1E293B] transition-colors"
            >
              Get in touch
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-20 space-y-20 sm:space-y-24">
        {/* SECTION 2: Editorial Hero */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-[#E5E7EB] bg-white flex items-center justify-center shrink-0">
              {profile.avatarUrl && !avatarFailed ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  priority
                  onError={() => setAvatarFailed(true)}
                />
              ) : (
                <span className="font-editorial-serif text-2xl font-semibold text-[#0F172A]">
                  {profile.initials}
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-xs text-[#475569]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>{profile.statusBadge}</span>
                {profile.memberId && (
                  <span className="font-mono text-[11px] text-[#64748B] border-l border-[#E5E7EB] pl-2">
                    {profile.memberId}
                  </span>
                )}
              </div>

              {profile.location && (
                <p className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{profile.location}</span>
                  {profile.department && (
                    <span>· {profile.department}</span>
                  )}
                </p>
              )}
            </div>
          </div>

          <div className="max-w-3xl space-y-5">
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#0F172A] leading-[1.12]">
              {profile.headline}
            </h1>
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl">
              {profile.bio}{" "}
              <span className="font-editorial-serif italic text-[#0F172A]">
                Verified under AXON Institutional Governance.
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {hasWork ? (
              <a
                href="#work"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F172A] text-white text-sm font-medium hover:bg-[#1E293B] transition-colors"
              >
                View Selected Work
                <ArrowUpRight className="w-4 h-4" />
              </a>
            ) : (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F172A] text-white text-sm font-medium hover:bg-[#1E293B] transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email {profile.fullName.split(" ")[0]}
              </a>
            )}

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#D1D5DB] text-sm font-medium text-[#0F172A] hover:border-[#0F172A] transition-colors"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Email Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#64748B]" />
                  <span>Copy Email</span>
                </>
              )}
            </button>

            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-[#E5E7EB] text-sm text-[#475569] hover:text-[#0F172A] hover:border-[#D1D5DB] transition-colors"
              >
                <FileText className="w-4 h-4" />
                Resume PDF
              </a>
            )}
          </div>
        </section>

        {/* SECTION 3: Selected Work / Projects Showcase */}
        {hasWork && (
          <section id="work" className="scroll-mt-24 space-y-6">
            <div className="flex items-end justify-between border-b border-[#E5E7EB] pb-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-[#64748B]">
                  01 / Selected Work
                </p>
                <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-[#0F172A]">
                  Systems & Engineering Artifacts
                </h2>
              </div>
              <span className="text-xs font-mono text-[#64748B]">
                {profile.projects.length}{" "}
                {profile.projects.length === 1 ? "case study" : "case studies"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.projects.map((project) => (
                <article
                  key={project.id}
                  className="group rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CBD5E1] hover:shadow-sm flex flex-col"
                >
                  {project.thumbnailUrl && (
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="relative w-full aspect-[16/10] bg-[#F1F5F9] overflow-hidden border-b border-[#E5E7EB] text-left block focus:outline-none"
                      aria-label={`Inspect project details for ${project.title}`}
                    >
                      <Image
                        src={project.thumbnailUrl}
                        alt={`${project.title} preview`}
                        width={640}
                        height={400}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </button>
                  )}

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-[#64748B]">
                        <span>{project.category}</span>
                        <span className="font-mono">{project.year}</span>
                      </div>

                      <h3 className="text-lg font-semibold tracking-tight text-[#0F172A]">
                        <button
                          type="button"
                          onClick={() => setSelectedProject(project)}
                          className="text-left hover:underline decoration-[#94A3B8] underline-offset-4"
                        >
                          {project.title}
                        </button>
                      </h3>

                      <p className="text-sm text-[#475569] leading-relaxed line-clamp-2">
                        {project.summary}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.slice(0, 5).map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E5E7EB] text-[11px] font-medium text-[#475569]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] text-xs font-medium">
                        <button
                          type="button"
                          onClick={() => setSelectedProject(project)}
                          className="inline-flex items-center gap-1 text-[#0F172A] hover:text-[#475569]"
                        >
                          Read details
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-4 text-[#475569]">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#0F172A]"
                            >
                              Live ↗
                            </a>
                          )}
                          {project.repoUrl && (
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#0F172A]"
                            >
                              Source ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: Capabilities / Skills */}
        {hasSkills && (
          <section id="about" className="scroll-mt-24 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-4">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#64748B]">
                02 / Capabilities
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-[#0F172A]">
                Technical Disciplines & Tooling
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {profile.skills.map((group) => (
                <div
                  key={group.group}
                  className="p-5 rounded-2xl border border-[#E5E7EB] bg-white space-y-3"
                >
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#64748B]">
                    {group.group}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-md bg-[#FAF9F6] border border-[#E5E7EB] text-xs text-[#0F172A]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 5: About & Experience Timeline */}
        {hasExperience && (
          <section id="experience" className="scroll-mt-24 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-4">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#64748B]">
                03 / Experience & Provenance
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-[#0F172A]">
                Roles,{" "}
                <span className="font-editorial-serif italic font-normal">
                  Endorsements
                </span>{" "}
                & Background
              </h2>
            </div>

            <div className="divide-y divide-[#E5E7EB] rounded-2xl border border-[#E5E7EB] bg-white">
              {profile.experience.map((item, idx) => (
                <div
                  key={`${item.role}-${idx}`}
                  className="p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <h3 className="text-base font-semibold text-[#0F172A]">
                      {item.role}
                    </h3>
                    <p className="text-sm text-[#475569]">{item.organization}</p>
                    {item.highlights.length > 0 && (
                      <ul className="pt-2 space-y-1 text-sm text-[#475569]">
                        {item.highlights.map((hl, hIdx) => (
                          <li key={hIdx} className="leading-relaxed">
                            — {hl}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <span className="font-mono text-xs text-[#64748B] shrink-0">
                    {item.period}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 6: Contact CTA Card & Minimal Footer */}
        <section id="contact" className="scroll-mt-24 space-y-10">
          <div className="p-8 sm:p-10 rounded-2xl border border-[#E5E7EB] bg-white flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#64748B]">
                04 / Direct Contact
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#0F172A]">
                Open to technical{" "}
                <span className="font-editorial-serif italic font-normal">
                  collaboration
                </span>{" "}
                and engineering roles.
              </h2>
              <p className="text-sm text-[#475569]">
                Reach out directly via{" "}
                <span className="font-mono text-[#0F172A]">{profile.email}</span>
                {profile.chapter ? ` · ${profile.chapter}` : ""}.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0F172A] text-white text-sm font-medium hover:bg-[#1E293B] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#FAF9F6] border border-[#D1D5DB] text-sm font-medium text-[#0F172A] hover:border-[#0F172A] transition-colors"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#64748B]" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
              </div>

              {socialItems.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  {socialItems.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#E5E7EB] bg-[#FAF9F6] text-[#475569] hover:text-[#0F172A] hover:border-[#CBD5E1] transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <footer className="border-t border-[#E5E7EB] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#64748B]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0F172A]" />
              <span>
                {profile.fullName} · Verified AXON Network Portfolio (askme.pk)
              </span>
            </div>
            <div className="flex items-center gap-5">
              <Link href="/talent" className="hover:text-[#0F172A]">
                All Members
              </Link>
              <Link href="/verify" className="hover:text-[#0F172A]">
                Verify Credential
              </Link>
              <Link href="/" className="hover:text-[#0F172A]">
                AXON Portal
              </Link>
            </div>
          </footer>
        </section>
      </main>

      {/* Native Accessible HTML <dialog> Modal for Project Detail Drawer/Overlay */}
      <dialog
        ref={dialogRef}
        aria-labelledby="portfolio-project-dialog-title"
        {...({ closedby: "any" } as Record<string, string>)}
        className="w-full max-w-2xl rounded-2xl border border-[#E5E7EB] bg-white p-0 text-[#0F172A] shadow-2xl m-auto"
      >
        {selectedProject && (
          <div className="divide-y divide-[#E5E7EB]">
            <div className="px-6 py-5 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#64748B]">
                  {selectedProject.category} · {selectedProject.year}
                </div>
                <h2
                  id="portfolio-project-dialog-title"
                  className="text-xl font-semibold tracking-tight text-[#0F172A]"
                >
                  {selectedProject.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label="Close project details"
                className="w-8 h-8 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:border-[#CBD5E1] shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {selectedProject.thumbnailUrl && (
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-[#E5E7EB] bg-[#F1F5F9]">
                  <Image
                    src={selectedProject.thumbnailUrl}
                    alt={`${selectedProject.title} showcase`}
                    width={800}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#64748B]">
                  Overview & Architecture
                </h3>
                <p className="text-sm text-[#334155] leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {selectedProject.role && (
                <div className="text-xs text-[#475569]">
                  <span className="font-mono uppercase text-[#64748B]">Role: </span>
                  <span className="font-medium text-[#0F172A]">
                    {selectedProject.role}
                  </span>
                </div>
              )}

              {selectedProject.deliverables &&
                selectedProject.deliverables.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[#64748B]">
                      Key Deliverables
                    </h3>
                    <ul className="space-y-1.5 text-sm text-[#334155]">
                      {selectedProject.deliverables.map((del, dIdx) => (
                        <li key={dIdx}>— {del}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {selectedProject.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E5E7EB] text-xs text-[#475569]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-[#FAF9F6] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0F172A] text-white text-xs font-medium hover:bg-[#1E293B]"
                  >
                    Visit Live Deployment
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
                {selectedProject.repoUrl && (
                  <a
                    href={selectedProject.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#D1D5DB] text-xs font-medium text-[#0F172A] hover:border-[#0F172A]"
                  >
                    <Github className="w-3.5 h-3.5" />
                    Inspect Repository
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="text-xs font-medium text-[#475569] hover:text-[#0F172A]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
