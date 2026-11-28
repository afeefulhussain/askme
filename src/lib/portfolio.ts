import type {
  AxonMember,
  Endorsement,
  MemberPortfolioExperience,
  MemberPortfolioProfile,
  MemberPortfolioProject,
  Project,
} from "@/lib/types";

export const DEMO_PORTFOLIO_PROFILE: MemberPortfolioProfile = {
  slug: "demo",
  fullName: "Afeef Ul Hussain",
  initials: "AU",
  statusBadge: "President & Systems Architect · Executive Council",
  headline: "Building resilient web platforms and verified institutional software.",
  bio: "Computer systems builder leading engineering governance across 11 directorates at AXON (IMAC, UET Lahore). Focused on pragmatic web architecture, cryptographic credential systems, and developer tooling.",
  location: "Lahore, Pakistan",
  avatarUrl: "/api/avatar?name=Afeef+Ul+Hussain&id=AXN-26-313&accent=%230284C7",
  email: "afeef@askme.pk",
  socials: {
    github: "https://github.com/afeefulhussain",
    linkedin: "https://linkedin.com/in/afeef-axon",
    website: "https://askme.pk",
  },
  skills: [
    {
      group: "Systems & Backend",
      items: ["TypeScript", "Next.js App Router", "PostgreSQL", "Row-Level Security", "REST & Zod"],
    },
    {
      group: "Infrastructure & Trust",
      items: ["Cryptographic Verification", "Cloudflare DNS", "Resend SMTP", "Audit Telemetry"],
    },
    {
      group: "Product & Leadership",
      items: ["Technical Architecture", "11-Wing Governance", "Design Systems", "Technical Writing"],
    },
  ],
  projects: [
    {
      id: "demo-proj-1",
      title: "askme.pk — AXON Official Portal & Cryptographic Registry",
      summary: "Production Next.js & PostgreSQL portal uniting 11 student wings with live certificate verification.",
      description:
        "Architected a full-stack institutional portal featuring role-based dashboards, salted scrypt authentication, bulk CSV certificate indexing, dynamic member portfolios, and transactional delivery via axon@askme.pk.",
      category: "Web Platform",
      tags: ["Next.js", "TypeScript", "PostgreSQL", "Zod", "Resend"],
      thumbnailUrl: "/assets/cover-portal.png",
      liveUrl: "https://askme.pk",
      repoUrl: "https://github.com/afeefulhussain/askme",
      year: "2026",
      role: "Lead Architect",
      deliverables: [
        "9-tier RBAC portal governance across 29 council members",
        "Deterministic SHA-256 verification registry at /verify",
        "Dynamic editorial portfolio engine at /portfolio/[slug]",
      ],
    },
    {
      id: "demo-proj-2",
      title: "AXON Editorial Brand & Certificate Template System",
      summary: "Precision vector lockups and institutional certificate plates across 11 wings.",
      description:
        "Constructed crisp vector brand plates, dual dark/light identity assets, and print-ready institutional certificates preserving accessible typography and QR verification seals.",
      category: "Design Systems",
      tags: ["SVG Geometry", "Design Tokens", "Editorial UI"],
      thumbnailUrl: "/assets/cover-design.png",
      repoUrl: "https://github.com/axon-org",
      year: "2026",
      role: "Systems Collaborator",
      deliverables: [
        "Unified typographic hierarchy pairing Inter and Times New Roman accents",
        "Raster PNG brand kit & OG card automation",
      ],
    },
  ],
  experience: [
    {
      role: "President & Founding Super Admin",
      organization: "AXON Independent Organization · IMAC, UET Lahore",
      period: "2026 — Present",
      highlights: [
        "Established 11 cross-disciplinary directorates and audited onboarding workflows.",
        "Architected and launched askme.pk serving university chapters and industry verifiers.",
      ],
    },
    {
      role: "B.Sc. Engineering & Technology",
      organization: "University of Engineering & Technology (UET), Lahore",
      period: "2023 — 2027",
      highlights: [
        "Lead organizer for technical workshops spanning hardware synthesis and distributed systems.",
      ],
    },
  ],
  memberId: "AXN-26-313",
  wingName: "Executive Council",
  chapter: "IMAC, UET Lahore",
  rollNumber: "2023-IMAC-01",
  department: "IMAC Engineering",
};

function computeInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "AX";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function toMemberPortfolioProfile(
  member: AxonMember,
  memberProjects: Project[],
  memberEndorsements: Endorsement[] = []
): MemberPortfolioProfile {
  const skills: { group: string; items: string[] }[] = [];
  if (member.skills.languages?.length > 0) {
    skills.push({ group: "Languages", items: member.skills.languages });
  }
  if (member.skills.frameworks?.length > 0) {
    skills.push({ group: "Frameworks & Tooling", items: member.skills.frameworks });
  }
  if (member.skills.systems?.length > 0) {
    skills.push({ group: "Systems & Operations", items: member.skills.systems });
  }

  const projects: MemberPortfolioProject[] = memberProjects.map((proj) => ({
    id: proj.id,
    title: proj.title,
    summary: proj.summary,
    description: `${proj.summary} ${proj.architecture}`.trim(),
    category: proj.primaryLanguage || member.wing || "Engineering",
    tags: proj.techStack,
    thumbnailUrl: proj.coverImage || "/assets/cover-portal.png",
    liveUrl: proj.liveDemoUrl,
    repoUrl: proj.githubRepo,
    year: proj.lastSyncedAt ? proj.lastSyncedAt.slice(0, 4) : "2026",
    role: `${member.designation} (${member.wing})`,
    deliverables: [
      `Authored within ${proj.wingId.toUpperCase()} Directorate`,
      ...(proj.primaryLanguage ? [`Primary stack: ${proj.primaryLanguage}`] : []),
    ],
  }));

  const experience: MemberPortfolioExperience[] = [
    ...member.timeline.map((item) => ({
      role: item.role,
      organization: item.organization,
      period: item.year,
      highlights: item.description ? [item.description] : [],
    })),
    ...member.education.map((edu) => ({
      role: edu.degree,
      organization: edu.institution,
      period: edu.period,
      highlights: [],
    })),
    ...memberEndorsements.map((end) => ({
      role: `Verified Endorsement: ${end.badgeTitle}`,
      organization: `${end.directorName} (${end.directorRole})`,
      period: end.awardedAt,
      highlights: [end.note],
    })),
  ];

  // Clean 2-sentence editorial bio fallback if lengthy or terse
  const bio =
    member.bio?.trim() ||
    `${member.name} serves as ${member.designation} within the ${member.wing} wing at AXON (${member.chapter}). Contributing verified work across student initiatives and community programs.`;

  return {
    slug: member.username,
    fullName: member.name,
    initials: computeInitials(member.name),
    statusBadge:
      member.internshipAvailable
        ? `${member.designation} · ${member.wing} · Open to Collaborate`
        : `${member.designation} · ${member.wing}`,
    headline: member.headline || `${member.designation} — ${member.wing} at AXON`,
    bio,
    location: member.location || member.chapter || "Lahore, Pakistan",
    avatarUrl: member.avatar || undefined,
    email: member.email,
    socials: {
      github: member.github || undefined,
      linkedin: member.linkedin || undefined,
      x: member.xHandle || undefined,
      instagram: member.instagram || undefined,
      website: member.website || undefined,
    },
    skills,
    projects,
    experience,
    memberId: member.memberId,
    wingName: member.wing,
    chapter: member.chapter,
    rollNumber: member.rollNumber,
    department: member.department,
    resumeUrl: member.resumeUrl,
  };
}
