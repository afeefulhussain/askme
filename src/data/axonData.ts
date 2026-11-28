import type {
  Wing,
  AxonEvent,
  Project,
  BlogPost,
  VerifiedCertificate,
  AxonMember,
  MembershipApplication,
  Endorsement,
  EventRsvp,
  ContactInquiry,
  WingTask,
  FinanceRecord,
  AuditLog,
  PortalRole,
} from "@/lib/types";

export type {
  Wing,
  AxonEvent,
  Project,
  BlogPost,
  VerifiedCertificate,
  AxonMember,
  MembershipApplication,
  Endorsement,
  EventRsvp,
  ContactInquiry,
  WingTask,
  FinanceRecord,
  AuditLog,
};

export const AXON_ORG_METADATA = {
  name: "AXON",
  fullName: "AXON Independent Organization",
  tagline: "Together We Transmit.",
  origin:
    "Originating at IMAC (Innovation & Manufacturing Auxiliary Center), UET Lahore",
  domain: "https://askme.pk",
  email: "axon@askme.pk",
  contactAddress:
    "IMAC Complex, University of Engineering & Technology, G.T. Road, Lahore, Pakistan",
  socials: {
    github: "https://github.com/afeefulhussain/askme",
    linkedin: "https://linkedin.com/company/axon-org",
    instagram: "https://instagram.com/axon.org",
  },
  metrics: {
    activeMembers: "480+",
    directorates: "11",
    eventsHosted: "38+",
    totalAttendees: "2,000+",
    universityChapters: "4",
    codeRepositories: "95+",
  },
};

export const UNIVERSITY_CHAPTERS: string[] = [
  "IMAC, UET Lahore (Founding Chapter)",
  "FAST-NUCES Lahore (Incubating Node)",
  "NUST Islamabad (Allied Chapter)",
  "GIKI Topi (Allied Chapter)",
];

export const WINGS: Wing[] = [
  {
    id: "technical",
    slug: "technical",
    name: "Technical",
    directorate: "Directorate of Technical Systems",
    code: "DIR-01/TEC",
    lead: "Arham",
    leadUsername: "arham",
    coLead: "Shahid",
    coLeadUsername: "shahid",
    reportsTo: "Wajiha",
    reportsToUsername: "wajiha",
    role: "Director of Technical",
    tagline:
      "Portal engineering, full-stack systems, deployment pipelines, and technical workshops.",
    mandate:
      "Engineers the official askme.pk web portal, certificate verification APIs, bulk CSV credential workflows, and hands-on coding bootcamps originating at IMAC, UET Lahore.",
    focus: [
      "Full-Stack Engineering",
      "PostgreSQL & Supabase",
      "Distributed Systems",
      "Applied AI & Tooling",
      "Verification Engines",
    ],
    tools: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Docker", "Git"],
    status: "Active",
    initiativesCount: 12,
  },
  {
    id: "decor",
    slug: "decor",
    name: "Decor",
    directorate: "Directorate of Spatial & Event Decor",
    code: "DIR-02/DEC",
    lead: "Nimra (Section A)",
    leadUsername: "nimra-a",
    coLead: "Aneeqa",
    coLeadUsername: "aneeqa",
    reportsTo: "Wajiha",
    reportsToUsername: "wajiha",
    role: "Director of Decor",
    tagline:
      "Launch showcase booth architecture, physical branding, and QR verification standees.",
    mandate:
      "Designs and constructs physical launch environments, conference stage backdrops, spatial booth setups, and QR-enabled credential verification standees across UET Lahore venues.",
    focus: [
      "Launch Booth Setup",
      "Physical Branding",
      "QR Standee Integration",
      "Stage Architecture",
    ],
    tools: ["Spatial Layout", "Print Specs", "Environmental Graphics", "Stage Props"],
    status: "Active",
    initiativesCount: 6,
  },
  {
    id: "design",
    slug: "design",
    name: "Design",
    directorate: "Directorate of UI/UX & Brand Systems",
    code: "DIR-03/DSG",
    lead: "Tayyab",
    leadUsername: "tayyab",
    coLead: "Sibqa Saeed",
    coLeadUsername: "sibqa",
    reportsTo: "Tahoor Tayyab",
    reportsToUsername: "tahoor",
    role: "Director of Design",
    tagline:
      "Editorial UI/UX design systems, web banners, vector icons, and certificate templates.",
    mandate:
      "Establishes AXON's visual identity tokens (#0A0D14 Terminal Void, #00F0FF Axon Cyan, #10B981 Circuit Green), official digital certificate layouts, and web interface components.",
    focus: [
      "Editorial Typography",
      "UI/UX Systems",
      "Certificate Templates",
      "Vector Identity Marks",
    ],
    tools: ["Figma", "Illustrator", "SVG Systems", "Design Tokens"],
    status: "Active",
    initiativesCount: 14,
  },
  {
    id: "videography",
    slug: "videography",
    name: "Videography",
    directorate: "Directorate of Motion & Broadcast",
    code: "DIR-04/VID",
    lead: "Jawad Ahsan",
    leadUsername: "jawad",
    coLead: "Qasim",
    coLeadUsername: "qasim",
    reportsTo: "Tahoor Tayyab",
    reportsToUsername: "tahoor",
    role: "Director of Videography",
    tagline:
      "Launch teaser production, workshop archive recording, and high-impact highlight reels.",
    mandate:
      "Directs multi-camera recording of AXON technical workshops, produces launch teaser films, and edits concise visual recaps for portal event archives.",
    focus: [
      "Launch Teasers",
      "Event Highlight Reels",
      "Technical Workshop Capture",
      "Motion Typography",
    ],
    tools: ["Premiere Pro", "DaVinci Resolve", "After Effects", "OBS Multi-Cam"],
    status: "Active",
    initiativesCount: 8,
  },
  {
    id: "photography",
    slug: "photography",
    name: "Photography",
    directorate: "Directorate of Visual Documentation",
    code: "DIR-05/PHO",
    lead: "Hammad",
    leadUsername: "hammad",
    coLead: "Abdul Rehman",
    coLeadUsername: "abdulrehman",
    reportsTo: "Tahoor Tayyab",
    reportsToUsername: "tahoor",
    role: "Director of Photography",
    tagline:
      "Official executive portraits, campus coverage, and institutional visual archives.",
    mandate:
      "Captures high-resolution member portraits for portfolios and digital ID cards, alongside comprehensive photographic documentation of IMAC sessions and hackathons.",
    focus: [
      "Executive Portraits",
      "Event Coverage",
      "Color Grading",
      "Campus Photo Archives",
    ],
    tools: ["Lightroom", "DSLR / Mirrorless Rigs", "Studio Lighting"],
    status: "Active",
    initiativesCount: 9,
  },
  {
    id: "social-media",
    slug: "social-media",
    name: "Social Media",
    directorate: "Directorate of Digital Outreach",
    code: "DIR-06/SOC",
    lead: "Fatima Naeem",
    leadUsername: "fatima",
    coLead: "Fahad",
    coLeadUsername: "fahad",
    reportsTo: "Tahoor Tayyab",
    reportsToUsername: "tahoor",
    role: "Director of Social Media",
    tagline:
      "Launch campaign orchestration, content calendars, and multi-platform audience growth.",
    mandate:
      "Manages AXON's official digital announcements, launch campaigns, LinkedIn/Instagram editorial presence, and organic traffic routing back to askme.pk.",
    focus: [
      "Launch Campaigns",
      "Content Calendars",
      "Community Engagement",
      "Link Traffic Analytics",
    ],
    tools: ["Meta Suite", "LinkedIn Pages", "Analytics", "Editorial Scheduling"],
    status: "Active",
    initiativesCount: 11,
  },
  {
    id: "documentation",
    slug: "documentation",
    name: "Documentation",
    directorate: "Directorate of Institutional Records & Copy",
    code: "DIR-07/DOC",
    lead: "Aatika",
    leadUsername: "aatika",
    coLead: "Faheem",
    coLeadUsername: "faheem",
    reportsTo: "Ayyan Asif",
    reportsToUsername: "ayyan",
    role: "Director of Documentation",
    tagline:
      "Official website copy, governance charters, minutes of meetings, and policy drafts.",
    mandate:
      "Authors AXON's institutional copy across About, Mission, Wing bios, FAQs, and official policies, while maintaining structured records, proposals, and council MoMs.",
    focus: [
      "Institutional Website Copy",
      "Governance Policies",
      "Proposals & MoMs",
      "Editorial Standards",
    ],
    tools: ["Markdown", "LaTeX", "Notion", "Technical Writing"],
    status: "Active",
    initiativesCount: 7,
  },
  {
    id: "marketing-pr",
    slug: "marketing-pr",
    name: "Marketing & PR",
    directorate: "Directorate of Public Relations & Outreach",
    code: "DIR-08/MPR",
    lead: "Shehriyar",
    leadUsername: "shehriyar",
    coLead: "Zainab",
    coLeadUsername: "zainab",
    reportsTo: "Ayyan Asif",
    reportsToUsername: "ayyan",
    role: "Director of Marketing & PR",
    tagline:
      "Inter-university collaborations, public announcements, and campus awareness drives.",
    mandate:
      "Leads campus-to-campus outreach, strategic alliances with allied technical societies, press announcements, and student induction awareness.",
    focus: [
      "Campus Outreach",
      "Society Collaborations",
      "PR Campaigns",
      "External Communications",
    ],
    tools: ["Press Kits", "Outreach CRM", "Campus Campaigns"],
    status: "Expanding",
    initiativesCount: 9,
  },
  {
    id: "management",
    slug: "management",
    name: "Management",
    directorate: "Directorate of Internal Coordination",
    code: "DIR-09/MGT",
    lead: "Maair",
    leadUsername: "maair",
    coLead: "Nimra",
    coLeadUsername: "nimra",
    reportsTo: "Ayyan Asif",
    reportsToUsername: "ayyan",
    role: "Director of Management",
    tagline:
      "Cross-wing data synchronization, member attendance, and operational milestone tracking.",
    mandate:
      "Coordinates data collection (member bios, portraits, wing deliverables) across all 11 directorates, enforces deadline accountability, and tracks attendance.",
    focus: [
      "All-Wing Data Collection",
      "Milestone Deadlines",
      "Attendance Tracking",
      "Internal Coordination",
    ],
    tools: ["Task Matrices", "Operational Audits", "Roster Pipelines"],
    status: "Active",
    initiativesCount: 10,
  },
  {
    id: "logistics",
    slug: "logistics",
    name: "Logistics",
    directorate: "Directorate of Operations & Venues",
    code: "DIR-10/LOG",
    lead: "Mujtaba",
    leadUsername: "mujtaba",
    coLead: "Abduraffay",
    coLeadUsername: "abduraffay",
    reportsTo: "Hassan Naveed",
    reportsToUsername: "hassan",
    role: "Director of Logistics",
    tagline:
      "Auditorium permissions, equipment allocation, and on-ground launch execution.",
    mandate:
      "Handles venue booking, administrative permissions at IMAC and UET Lahore, audio/visual hardware staging, and on-ground execution for workshops and launches.",
    focus: [
      "Venue & Equipment Setup",
      "Administrative Permissions",
      "On-Ground Operations",
      "Photoshoot Staging",
    ],
    tools: ["Venue Schedules", "Inventory Logs", "Event Runbooks"],
    status: "Active",
    initiativesCount: 15,
  },
  {
    id: "sponsorship",
    slug: "sponsorship",
    name: "Sponsorship",
    directorate: "Directorate of Industry Partnerships",
    code: "DIR-11/SPO",
    lead: "Osaram",
    leadUsername: "osaram",
    coLead: "Waqas Khan",
    coLeadUsername: "waqas",
    reportsTo: "Hassan Naveed",
    reportsToUsername: "hassan",
    role: "Director of Sponsorship",
    tagline:
      "Corporate pitch decks, tech sponsor outreach, and industry partner showcase data.",
    mandate:
      "Cultivates technology sponsorships, prepares institutional pitch decks, manages sponsor logo placements, and builds industry mentorship pipelines.",
    focus: [
      "Sponsor Outreach",
      "Corporate Pitch Decks",
      "Partner Data & Logos",
      "Industry Fellowships",
    ],
    tools: ["Pitch Decks", "Partner CRM", "Sponsorship Agreements"],
    status: "Active",
    initiativesCount: 8,
  },
];

function makeMember(params: {
  username: string;
  name: string;
  memberId: string;
  designation: string;
  category: AxonMember["category"];
  rbacRole: PortalRole;
  wingId: string;
  wingName: string;
  email: string;
  supervisedWings?: string[];
  reportsTo?: string;
  portalResponsibilities?: string;
  headline?: string;
  bio?: string;
  skills?: AxonMember["skills"];
  accent?: string;
}): AxonMember {
  const accent = params.accent || "#00F0FF";
  const avatar = `/api/avatar?name=${encodeURIComponent(params.name)}&id=${encodeURIComponent(params.memberId)}&accent=${encodeURIComponent(accent)}`;
  return {
    username: params.username,
    name: params.name,
    headline:
      params.headline ||
      `${params.designation} — ${params.wingName} at AXON`,
    memberId: params.memberId,
    designation: params.designation,
    category: params.category,
    supervisedWings: params.supervisedWings || [],
    reportsTo: params.reportsTo,
    portalResponsibilities: params.portalResponsibilities,
    rbacRole: params.rbacRole,
    wing: params.wingName,
    wingId: params.wingId,
    chapter: "IMAC, UET Lahore",
    status:
      params.category === "Patron"
        ? "Faculty Patron"
        : params.category.startsWith("Core")
        ? "Executive Council"
        : params.designation === "Director"
        ? "Director"
        : params.designation === "Co-Director"
        ? "Co-Director"
        : "Active Member",
    avatar,
    bio:
      params.bio ||
      `${params.designation} serving within the ${params.wingName} at AXON (IMAC, UET Lahore). ${params.portalResponsibilities || ""}`.trim(),
    github: `https://github.com/${params.username}`,
    githubUsername: params.username,
    linkedin: `https://linkedin.com/in/${params.username}-axon`,
    email: params.email,
    graduationYear: 2027,
    internshipAvailable: params.category !== "Patron",
    themePreference: "obsidian-cyan",
    isPublic: true,
    portfolioViews: 420 + (params.memberId.charCodeAt(params.memberId.length - 1) % 50) * 17,
    education: [
      {
        degree:
          params.category === "Patron"
            ? "Faculty Advisor — Engineering & Innovation"
            : "B.Sc. Engineering & Technology",
        institution: "University of Engineering & Technology (UET), Lahore",
        period: params.category === "Patron" ? "Faculty Patron" : "2023 – 2027",
      },
    ],
    skills: params.skills || {
      languages: ["TypeScript", "Python", "C++"],
      frameworks: ["Next.js", "Tailwind CSS", "Node.js"],
      systems: ["Git", "Linux", "PostgreSQL"],
    },
    timeline: [
      {
        year: "2026 - Present",
        role: `${params.designation} (${params.wingName})`,
        organization: "AXON Independent Organization (IMAC, UET Lahore)",
        description:
          params.portalResponsibilities ||
          "Active leadership within the AXON umbrella network.",
      },
    ],
  };
}

export const MEMBERS_PORTFOLIOS: Record<string, AxonMember> = {
  // 1. Patron & Core Team (7 Members)
  manahal: makeMember({
    username: "manahal",
    name: "Miss Manahal Khurram",
    memberId: "AXN-26-301",
    designation: "Faculty Advisor",
    category: "Patron",
    rbacRole: "ADVISOR",
    wingId: "executive-council",
    wingName: "Executive Council",
    email: "manahal@askme.pk",
    supervisedWings: ["all"],
    portalResponsibilities: "Society overview, event/budget approvals, audit reports.",
    headline: "Faculty Patron & Institutional Oversight Advisor — AXON",
    accent: "#10B981",
    skills: {
      languages: ["Research Methodology", "Governance"],
      frameworks: ["Academic Oversight", "Institutional Policy"],
      systems: ["IMAC UET Lahore", "Budget Audits"],
    },
  }),
  afeef: makeMember({
    username: "afeef",
    name: "Afeef Ul Hussain",
    memberId: "AXN-26-313",
    designation: "President",
    category: "Core",
    rbacRole: "SUPER_ADMIN",
    wingId: "executive-council",
    wingName: "Executive Council",
    email: "afeef@askme.pk",
    supervisedWings: ["all"],
    portalResponsibilities:
      "Full portal control across all 11 wings, approvals, user roles, and system audit logs.",
    headline: "President & Founding Super Admin — AXON (Together We Transmit)",
    bio: "President and lead architect of AXON, originating at IMAC, UET Lahore. Overseeing all 11 specialized directorates, federated chapter incubation, and institutional engineering standards.",
    accent: "#00F0FF",
    skills: {
      languages: ["TypeScript", "Rust", "Python", "SQL", "C++"],
      frameworks: ["Next.js (App Router)", "Supabase", "Tailwind CSS", "React"],
      systems: ["PostgreSQL RLS", "Cloudflare DNS", "Vercel Edge", "Linux", "Git"],
    },
  }),
  abeer: makeMember({
    username: "abeer",
    name: "Abeer Zafar",
    memberId: "AXN-26-303",
    designation: "Finance Auditor",
    category: "Core (Independent Audit Line)",
    rbacRole: "CORE_AUDITOR",
    wingId: "finance-audit",
    wingName: "Independent Audit Line",
    email: "abeer@askme.pk",
    supervisedWings: ["all"],
    portalResponsibilities:
      "Independent audit review of budgets, sponsorship records, expense sheets, and audit logs.",
    accent: "#10B981",
    skills: {
      languages: ["SQL", "Python", "Financial Modeling"],
      frameworks: ["Compliance Auditing", "Ledger Reconciliation"],
      systems: ["Expense Tracking", "Sponsorship Verification"],
    },
  }),
  wajiha: makeMember({
    username: "wajiha",
    name: "Wajiha",
    memberId: "AXN-26-304",
    designation: "Vice President",
    category: "Core",
    rbacRole: "CORE_LEAD",
    wingId: "technical",
    wingName: "Executive Council (Technical & Decor)",
    email: "wajiha@askme.pk",
    supervisedWings: ["technical", "decor"],
    portalResponsibilities:
      "Oversees Technical & Decor wings: tasks, progress, and team updates.",
  }),
  tahoor: makeMember({
    username: "tahoor",
    name: "Tahoor Tayyab",
    memberId: "AXN-26-305",
    designation: "Media Officer",
    category: "Core",
    rbacRole: "CORE_LEAD",
    wingId: "design",
    wingName: "Executive Council (Media Division)",
    email: "tahoor@askme.pk",
    supervisedWings: ["design", "videography", "photography", "social-media"],
    portalResponsibilities:
      "Oversees Design, Videography, Photography, and Social Media wings, brand assets, and content calendar.",
  }),
  ayyan: makeMember({
    username: "ayyan",
    name: "Ayyan Asif",
    memberId: "AXN-26-306",
    designation: "General Secretary",
    category: "Core",
    rbacRole: "CORE_LEAD",
    wingId: "documentation",
    wingName: "Executive Council (Secretariat)",
    email: "ayyan@askme.pk",
    supervisedWings: ["documentation", "marketing-pr", "management"],
    portalResponsibilities:
      "Oversees Documentation, Marketing & PR, and Management wings, MoMs, and cross-wing coordination.",
  }),
  hassan: makeMember({
    username: "hassan",
    name: "Hassan Naveed",
    memberId: "AXN-26-307",
    designation: "Logistics & Sponsorship Lead",
    category: "Core",
    rbacRole: "CORE_LEAD",
    wingId: "logistics",
    wingName: "Executive Council (Operations & Outreach)",
    email: "hassan@askme.pk",
    supervisedWings: ["logistics", "sponsorship"],
    portalResponsibilities:
      "Oversees Logistics and Sponsorship wings, on-ground execution plans, and sponsor outreach pipeline.",
  }),

  // 2. 11 Directorates — Directors & Co-Directors (22 Members)
  arham: makeMember({
    username: "arham",
    name: "Arham",
    memberId: "AXN-26-314",
    designation: "Director",
    category: "Directorate",
    rbacRole: "DIRECTOR",
    wingId: "technical",
    wingName: "Technical",
    email: "arham@askme.pk",
    reportsTo: "Wajiha",
    portalResponsibilities:
      "Website coding, portal features, deployment, testing, and Technical Wing CSV certificate uploads.",
    skills: {
      languages: ["TypeScript", "JavaScript", "Python", "SQL"],
      frameworks: ["Next.js", "React", "Supabase", "Tailwind CSS"],
      systems: ["Vercel", "PostgreSQL", "Git", "REST APIs"],
    },
  }),
  shahid: makeMember({
    username: "shahid",
    name: "Shahid",
    memberId: "AXN-26-315",
    designation: "Co-Director",
    category: "Directorate",
    rbacRole: "CO_DIRECTOR",
    wingId: "technical",
    wingName: "Technical",
    email: "shahid@askme.pk",
    reportsTo: "Wajiha",
    portalResponsibilities:
      "Frontend/backend support, bug fixes, repository management, and CSV verification prep.",
    skills: {
      languages: ["TypeScript", "Python", "Go"],
      frameworks: ["Next.js", "Node.js", "PostgreSQL"],
      systems: ["Linux", "Docker", "GitHub Actions"],
    },
  }),
  "nimra-a": makeMember({
    username: "nimra-a",
    name: "Nimra (Section A)",
    memberId: "AXN-26-316",
    designation: "Director",
    category: "Directorate",
    rbacRole: "DIRECTOR",
    wingId: "decor",
    wingName: "Decor",
    email: "nimra.decor@askme.pk",
    reportsTo: "Wajiha",
    portalResponsibilities:
      "Launch/showcase booth setup, physical branding, and QR verification standees.",
    skills: {
      languages: ["Spatial Architecture", "Print Prep"],
      frameworks: ["Booth Staging", "Event Branding"],
      systems: ["QR Display Integration", "Venue Aesthetics"],
    },
  }),
  aneeqa: makeMember({
    username: "aneeqa",
    name: "Aneeqa",
    memberId: "AXN-26-317",
    designation: "Co-Director",
    category: "Directorate",
    rbacRole: "CO_DIRECTOR",
    wingId: "decor",
    wingName: "Decor",
    email: "aneeqa@askme.pk",
    reportsTo: "Wajiha",
    portalResponsibilities:
      "Event decor execution, props fabrication, and physical display arrangements.",
  }),
  tayyab: makeMember({
    username: "tayyab",
    name: "Tayyab",
    memberId: "AXN-26-318",
    designation: "Director",
    category: "Directorate",
    rbacRole: "DIRECTOR",
    wingId: "design",
    wingName: "Design",
    email: "tayyab@askme.pk",
    reportsTo: "Tahoor Tayyab",
    portalResponsibilities:
      "UI/UX visuals, web banners, icons, and official AXON certificate templates.",
    skills: {
      languages: ["SVG", "CSS Design Tokens"],
      frameworks: ["Figma", "Adobe Illustrator", "Editorial Systems"],
      systems: ["Brand Guidelines", "Certificate Typography"],
    },
  }),
  sibqa: makeMember({
    username: "sibqa",
    name: "Sibqa Saeed",
    memberId: "AXN-26-319",
    designation: "Co-Director",
    category: "Directorate",
    rbacRole: "CO_DIRECTOR",
    wingId: "design",
    wingName: "Design",
    email: "sibqa@askme.pk",
    reportsTo: "Tahoor Tayyab",
    portalResponsibilities:
      "Social graphics, promotional posters, and visual asset support.",
  }),
  jawad: makeMember({
    username: "jawad",
    name: "Jawad Ahsan",
    memberId: "AXN-26-320",
    designation: "Director",
    category: "Directorate",
    rbacRole: "DIRECTOR",
    wingId: "videography",
    wingName: "Videography",
    email: "jawad@askme.pk",
    reportsTo: "Tahoor Tayyab",
    portalResponsibilities:
      "Website launch teaser/promo video and event highlight reels.",
  }),
  qasim: makeMember({
    username: "qasim",
    name: "Qasim",
    memberId: "AXN-26-321",
    designation: "Co-Director",
    category: "Directorate",
    rbacRole: "CO_DIRECTOR",
    wingId: "videography",
    wingName: "Videography",
    email: "qasim@askme.pk",
    reportsTo: "Tahoor Tayyab",
    portalResponsibilities:
      "Video shooting, color editing, and short clips for the homepage.",
  }),
  hammad: makeMember({
    username: "hammad",
    name: "Hammad",
    memberId: "AXN-26-322",
    designation: "Director",
    category: "Directorate",
    rbacRole: "DIRECTOR",
    wingId: "photography",
    wingName: "Photography",
    email: "hammad@askme.pk",
    reportsTo: "Tahoor Tayyab",
    portalResponsibilities:
      "Team portraits for the official Team & Portfolio pages and live event coverage.",
  }),
  abdulrehman: makeMember({
    username: "abdulrehman",
    name: "Abdul Rehman",
    memberId: "AXN-26-323",
    designation: "Co-Director",
    category: "Directorate",
    rbacRole: "CO_DIRECTOR",
    wingId: "photography",
    wingName: "Photography",
    email: "abdulrehman@askme.pk",
    reportsTo: "Tahoor Tayyab",
    portalResponsibilities:
      "Photo editing, gallery uploads, and UET campus visual documentation.",
  }),
  fatima: makeMember({
    username: "fatima",
    name: "Fatima Naeem",
    memberId: "AXN-26-324",
    designation: "Director",
    category: "Directorate",
    rbacRole: "DIRECTOR",
    wingId: "social-media",
    wingName: "Social Media",
    email: "fatima@askme.pk",
    reportsTo: "Tahoor Tayyab",
    portalResponsibilities:
      "Website launch campaign, editorial content calendar, and audience growth.",
  }),
  fahad: makeMember({
    username: "fahad",
    name: "Fahad",
    memberId: "AXN-26-325",
    designation: "Co-Director",
    category: "Directorate",
    rbacRole: "CO_DIRECTOR",
    wingId: "social-media",
    wingName: "Social Media",
    email: "fahad@askme.pk",
    reportsTo: "Tahoor Tayyab",
    portalResponsibilities:
      "Daily posting, community stories, engagement, and link traffic.",
  }),
  aatika: makeMember({
    username: "aatika",
    name: "Aatika",
    memberId: "AXN-26-326",
    designation: "Director",
    category: "Directorate",
    rbacRole: "DIRECTOR",
    wingId: "documentation",
    wingName: "Documentation",
    email: "aatika@askme.pk",
    reportsTo: "Ayyan Asif",
    portalResponsibilities:
      "Website copy across About, Mission, Wing bios, FAQs, and institutional policies.",
  }),
  faheem: makeMember({
    username: "faheem",
    name: "Faheem",
    memberId: "AXN-26-327",
    designation: "Co-Director",
    category: "Directorate",
    rbacRole: "CO_DIRECTOR",
    wingId: "documentation",
    wingName: "Documentation",
    email: "faheem@askme.pk",
    reportsTo: "Ayyan Asif",
    portalResponsibilities:
      "Proposals, Minutes of Meetings (MoMs), archive records, and written drafts.",
  }),
  shehriyar: makeMember({
    username: "shehriyar",
    name: "Shehriyar",
    memberId: "AXN-26-328",
    designation: "Director",
    category: "Directorate",
    rbacRole: "DIRECTOR",
    wingId: "marketing-pr",
    wingName: "Marketing & PR",
    email: "shehriyar@askme.pk",
    reportsTo: "Ayyan Asif",
    portalResponsibilities:
      "Campus outreach, society collaborations, and public announcements.",
  }),
  zainab: makeMember({
    username: "zainab",
    name: "Zainab",
    memberId: "AXN-26-329",
    designation: "Co-Director",
    category: "Directorate",
    rbacRole: "CO_DIRECTOR",
    wingId: "marketing-pr",
    wingName: "Marketing & PR",
    email: "zainab@askme.pk",
    reportsTo: "Ayyan Asif",
    portalResponsibilities:
      "Class-to-class awareness, PR campaigns, and external student reach.",
  }),
  maair: makeMember({
    username: "maair",
    name: "Maair",
    memberId: "AXN-26-330",
    designation: "Director",
    category: "Directorate",
    rbacRole: "DIRECTOR",
    wingId: "management",
    wingName: "Management",
    email: "maair@askme.pk",
    reportsTo: "Ayyan Asif",
    portalResponsibilities:
      "All-wing data collection (bios, portraits, task milestones) and deadline enforcement.",
  }),
  nimra: makeMember({
    username: "nimra",
    name: "Nimra",
    memberId: "AXN-26-331",
    designation: "Co-Director",
    category: "Directorate",
    rbacRole: "CO_DIRECTOR",
    wingId: "management",
    wingName: "Management",
    email: "nimra.mgmt@askme.pk",
    reportsTo: "Ayyan Asif",
    portalResponsibilities:
      "Member attendance logs, internal coordination, and task follow-ups.",
  }),
  mujtaba: makeMember({
    username: "mujtaba",
    name: "Mujtaba",
    memberId: "AXN-26-332",
    designation: "Director",
    category: "Directorate",
    rbacRole: "DIRECTOR",
    wingId: "logistics",
    wingName: "Logistics",
    email: "mujtaba@askme.pk",
    reportsTo: "Hassan Naveed",
    portalResponsibilities:
      "Photoshoot and launch event venue, auditorium, and equipment arrangements.",
  }),
  abduraffay: makeMember({
    username: "abduraffay",
    name: "Abduraffay",
    memberId: "AXN-26-333",
    designation: "Co-Director",
    category: "Directorate",
    rbacRole: "CO_DIRECTOR",
    wingId: "logistics",
    wingName: "Logistics",
    email: "abduraffay@askme.pk",
    reportsTo: "Hassan Naveed",
    portalResponsibilities:
      "On-ground operations, IMAC venue permissions, and setup support.",
  }),
  osaram: makeMember({
    username: "osaram",
    name: "Osaram",
    memberId: "AXN-26-334",
    designation: "Director",
    category: "Directorate",
    rbacRole: "DIRECTOR",
    wingId: "sponsorship",
    wingName: "Sponsorship",
    email: "osaram@askme.pk",
    reportsTo: "Hassan Naveed",
    portalResponsibilities:
      "Sponsors & Partners section curation and institutional pitch decks.",
  }),
  waqas: makeMember({
    username: "waqas",
    name: "Waqas Khan",
    memberId: "AXN-26-335",
    designation: "Co-Director",
    category: "Directorate",
    rbacRole: "CO_DIRECTOR",
    wingId: "sponsorship",
    wingName: "Sponsorship",
    email: "waqas@askme.pk",
    reportsTo: "Hassan Naveed",
    portalResponsibilities:
      "Corporate sponsor outreach, partner logo permissions, and placement coordination.",
  }),
};

export const EVENTS: AxonEvent[] = [
  {
    id: "evt-01",
    slug: "zeros-and-ones",
    title: "Zeros and Ones: Digital Logic, Hardware Synthesis & Verilog Workflows",
    category: "Technical Workshop",
    date: "2026-11-15",
    time: "18:00 - 21:00 PKT",
    location: "IMAC Main Lecture Hall, UET Lahore (Hybrid Live Stream)",
    isVirtual: true,
    status: "Completed",
    wingId: "technical",
    capacity: 600,
    attendeeCount: 640,
    submittedBy: "Afeef Ul Hussain",
    speaker: {
      name: "Arham",
      title: "Director of Technical Wing",
      organization: "AXON // IMAC, UET Lahore",
      username: "arham",
    },
    description:
      "An intensive institutional deep-dive into digital logic, register-transfer level (RTL) architecture, Verilog synthesis, and open-source FPGA toolchains.",
    curriculum: [
      "Transistor-level CMOS logic and propagation delay physics",
      "RTL state machine design in synthesizable Verilog",
      "FPGA bitstream generation with open-source toolchains",
      "Simulation and waveform timing analysis with GTKWave",
    ],
  },
  {
    id: "evt-02",
    slug: "axon-portal-launch-symposium",
    title: "AXON Official Portal Launch & 11-Directorate Technical Showcase",
    category: "Launch Event",
    date: "2026-12-06",
    time: "14:00 - 17:30 PKT",
    location: "IMAC Auditorium, UET Lahore",
    isVirtual: false,
    status: "Registrations Open",
    wingId: "technical",
    capacity: 500,
    attendeeCount: 412,
    submittedBy: "Wajiha",
    speaker: {
      name: "Afeef Ul Hussain",
      title: "President, AXON",
      organization: "AXON Executive Council // IMAC UET",
      username: "afeef",
    },
    description:
      "Official unveiling of askme.pk — AXON's unified engineering portal, cryptographic certificate verifier, digital member ID system, and 11-wing showcase booths.",
    curriculum: [
      "Keynote: Together We Transmit — AXON's Multi-University Charter",
      "Live demonstration of QR Member ID & Bulk Certificate Verification",
      "11-Directorate Showcase Booths & Recruitment Desk",
      "Industry Sponsor Roundtable & Fellowship Pathways",
    ],
    registrationUrl: "/events/axon-portal-launch-symposium",
  },
  {
    id: "evt-03",
    slug: "distributed-systems-nextjs-supabase",
    title: "Production Full-Stack Systems: Next.js, PostgreSQL RLS & Edge DNS",
    category: "Technical Workshop",
    date: "2026-12-18",
    time: "19:00 - 21:30 PKT",
    location: "Virtual Amphitheatre & IMAC Lab 01",
    isVirtual: true,
    status: "Scheduled",
    wingId: "technical",
    capacity: 500,
    attendeeCount: 520,
    submittedBy: "Wajiha",
    speaker: {
      name: "Shahid",
      title: "Co-Director of Technical Wing",
      organization: "AXON Technical Directorate",
      username: "shahid",
    },
    description:
      "Hands-on workshop covering type-safe API routes with Zod, PostgreSQL Row-Level Security policies, transactional Resend emails, and edge routing.",
    curriculum: [
      "Serverless vs persistent PostgreSQL connection pooling",
      "Designing strict 9-role RBAC policies in SQL RLS",
      "Passwordless Email + OTP authentication security",
      "Deploying zero-downtime edge apps via Cloudflare & Vercel",
    ],
    registrationUrl: "/events/distributed-systems-nextjs-supabase",
  },
  {
    id: "evt-04",
    slug: "brand-systems-editorial-ui",
    title: "Editorial Design Systems & Institutional Typography Workshop",
    category: "Bootcamp",
    date: "2027-01-08",
    time: "15:00 - 18:00 PKT",
    location: "IMAC Design Studio, UET Lahore",
    isVirtual: true,
    status: "Registrations Open",
    wingId: "design",
    capacity: 450,
    attendeeCount: 448,
    submittedBy: "Tahoor Tayyab",
    speaker: {
      name: "Tayyab",
      title: "Director of Design",
      organization: "AXON Design Directorate",
      username: "tayyab",
    },
    description:
      "Constructing high-contrast dark-mode institutional interfaces, vector emblems, and print-ready certificate typography.",
    curriculum: [
      "WCAG AAA high-contrast dark-mode token architecture",
      "Balancing display serifs (Times New Roman MT) with Inter UI",
      "Vector emblem geometry and multi-resolution icon exports",
      "Designing automated QR credential badges",
    ],
    registrationUrl: "/events/brand-systems-editorial-ui",
  },
];

export const PROJECTS: Project[] = [
  {
    id: "proj-01",
    slug: "axon-verification-portal",
    title: "askme.pk: Official AXON Portal & Cryptographic Registry",
    author: {
      name: "Afeef Ul Hussain",
      username: "afeef",
      memberId: "AXN-26-313",
      wing: "Executive Council",
      avatar: "/api/avatar?name=Afeef+Ul+Hussain&id=AXN-26-313",
    },
    summary:
      "Full-stack Next.js, Supabase PostgreSQL, and Resend transactional platform powering AXON's 11 wings, QR ID cards, and bulk CSV certificate verification.",
    architecture:
      "Built on App Router SSR/SSG, strict Zod API schemas, HMAC-SHA256 OTP session cookies, PostgreSQL Row-Level Security, and dynamic Open Graph image generation.",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "Zod", "Resend"],
    githubRepo: "https://github.com/afeefulhussain/askme",
    liveDemoUrl: "https://askme.pk",
    stars: 218,
    forks: 42,
    primaryLanguage: "TypeScript",
    lastSyncedAt: "2026-11-28",
    wingId: "technical",
    status: "Verified & Active",
  },
  {
    id: "proj-02",
    slug: "vortex-lsm-storage",
    title: "Vortex: Concurrent Embedded LSM Key-Value Engine",
    author: {
      name: "Arham",
      username: "arham",
      memberId: "AXN-26-314",
      wing: "Technical",
      avatar: "/api/avatar?name=Arham&id=AXN-26-314",
    },
    summary:
      "High-throughput storage engine featuring atomic write-ahead logging, concurrent skiplists, and Murmur3 Bloom filters with sub-millisecond point lookups.",
    architecture:
      "Zero-copy serialization over memory-mapped SSTable blocks with background level compaction and LZ4 compression.",
    techStack: ["Rust", "LSM Tree", "Bloom Filters", "Tokio", "Linux"],
    githubRepo: "https://github.com/arham/vortex-lsm",
    stars: 164,
    forks: 27,
    primaryLanguage: "Rust",
    lastSyncedAt: "2026-11-24",
    wingId: "technical",
    status: "Verified & Active",
  },
  {
    id: "proj-03",
    slug: "axon-identity-svg-system",
    title: "AXON Editorial Brand & Certificate Template System",
    author: {
      name: "Tayyab",
      username: "tayyab",
      memberId: "AXN-26-318",
      wing: "Design",
      avatar: "/api/avatar?name=Tayyab&id=AXN-26-318",
    },
    summary:
      "Vector emblem lockups, institutional typography specifications, and print-ready vector certificate templates for all 11 AXON wings.",
    architecture:
      "Precision geometric SVG primitives adhering strictly to Terminal Void (#0A0D14) and Signal Cyan (#00F0FF / #0284C7) contrast rules.",
    techStack: ["Figma", "SVG Geometry", "Design Tokens", "Print PDF"],
    githubRepo: "https://github.com/tayyab/axon-brand-kit",
    stars: 96,
    forks: 18,
    primaryLanguage: "SVG",
    lastSyncedAt: "2026-11-20",
    wingId: "design",
    status: "Verified & Active",
  },
];

export const BLOGS: BlogPost[] = [
  {
    id: "blog-01",
    slug: "together-we-transmit-charter",
    title: "Together We Transmit: Architecting an Independent 11-Wing Federation",
    author: {
      name: "Afeef Ul Hussain",
      username: "afeef",
      role: "President, AXON",
    },
    wingId: "technical",
    publishedAt: "2026-11-22",
    readTime: "7 min read",
    tags: ["Architecture", "Governance", "IMAC UET", "AXON"],
    summary:
      "How AXON structured 11 cross-disciplinary directorates under a strict meritocratic governance charter and cryptographic verification portal originating at IMAC, UET Lahore.",
    status: "Published",
    content: `Student communities often collapse under fragmented workflows, unverified credentials, and scattered event logs. At **AXON**, our mandate — *Together We Transmit* — requires institutional engineering rigor from day one.

### Why 11 Specialized Directorates

Splitting operational ownership across **Technical, Decor, Design, Videography, Photography, Social Media, Documentation, Marketing & PR, Management, Logistics, and Sponsorship** ensures every launch, workshop, and open-source project operates with clear accountability.

### Cryptographic Trust at askme.pk

Every official appointment and event certificate is anchored in PostgreSQL with a deterministic audit hash and serial code (\`AXN-26-XXX\` / \`AXN-CERT-XXXX\`), allowing recruiters and academic advisors to verify credentials instantaneously at \`/verify\`.

> Verification must never rely on screenshots—trust belongs in reproducible cryptographic records.`,
  },
  {
    id: "blog-02",
    slug: "email-otp-and-rls-in-nextjs",
    title: "Passwordless Email + OTP Authentication & PostgreSQL RLS in Production",
    author: {
      name: "Arham",
      username: "arham",
      role: "Director of Technical Wing, AXON",
    },
    wingId: "technical",
    publishedAt: "2026-11-16",
    readTime: "9 min read",
    tags: ["Next.js", "Supabase", "Security", "PostgreSQL"],
    summary:
      "Designing a zero-password authentication pipeline using 6-digit HMAC-hashed OTPs, Resend transactional delivery from axon@askme.pk, and strict Row-Level Security.",
    status: "Published",
    content: `Password reuse is one of the largest attack vectors in university student portals. For **askme.pk**, we standardized on passwordless **Email + 6-digit OTP** verification paired with HMAC-SHA256 \`HttpOnly\` session cookies.

### Verification Flow

1. User submits their email to \`POST /api/auth/otp/request\`.
2. Server generates a cryptographically random 6-digit OTP using \`crypto.randomInt(100000, 999999)\`.
3. Only the salted HMAC digest is stored with a 10-minute TTL; the raw code is dispatched via **Resend** from \`axon@askme.pk\`.
4. Verification uses \`crypto.timingSafeEqual\` before minting an \`HttpOnly; Secure; SameSite=Lax\` session cookie.

\`\`\`ts
// Timing-safe OTP verification check
const actual = Buffer.from(hashOtp(email, code));
const expected = Buffer.from(challenge.codeHash);
const valid =
  actual.length === expected.length &&
  crypto.timingSafeEqual(actual, expected);
\`\`\`

Combined with Zod schema validation on every API route and explicit **Super Admin** moderation queues for projects and articles, the portal maintains enterprise-grade data integrity.`,
  },
];

export const CERTIFICATES_DATABASE: VerifiedCertificate[] = [
  {
    certCode: "AXN-26-313",
    recipientName: "Afeef Ul Hussain",
    memberId: "AXN-26-313",
    eventOrRole: "President & Founding Super Admin — AXON Executive Council",
    issueDate: "2026-10-01",
    issuerAuthority: "AXON Executive Council & IMAC Faculty Patron",
    status: "Active",
    type: "Leadership Appointment",
    hash: "0x8f4d92a11b6c0032e5f8a0984518bb201c34ef71",
  },
  {
    certCode: "AXN-26-301",
    recipientName: "Miss Manahal Khurram",
    memberId: "AXN-26-301",
    eventOrRole: "Faculty Advisor & Patron — AXON Umbrella Organization",
    issueDate: "2026-10-01",
    issuerAuthority: "IMAC, UET Lahore Advisory Board",
    status: "Active",
    type: "Leadership Appointment",
    hash: "0x11c9e024ab55f80193cd024a1204f99b88e4a120",
  },
  {
    certCode: "AXN-26-314",
    recipientName: "Arham",
    memberId: "AXN-26-314",
    eventOrRole: "Director of Technical Wing (DIR-01)",
    issueDate: "2026-10-05",
    issuerAuthority: "AXON Executive Council",
    status: "Active",
    type: "Leadership Appointment",
    hash: "0x9c02d44e117ab390d4a5812cf0018a6c9e47b210",
  },
  {
    certCode: "AXN-CERT-9042",
    recipientName: "Arham",
    memberId: "AXN-26-314",
    eventOrRole: "Lead Instructor — Zeros & Ones: Digital Logic & Verilog Workshop",
    issueDate: "2026-11-15",
    issuerAuthority: "AXON Technical Directorate",
    status: "Active",
    type: "Workshop Speaker",
    hash: "0x3e18a902df55c48b22a0179d63c45719ef10c411",
  },
  {
    certCode: "AXN-CERT-8819",
    recipientName: "Tayyab",
    memberId: "AXN-26-318",
    eventOrRole: "Brand Identity & Editorial Architecture Distinction 2026",
    issueDate: "2026-10-28",
    issuerAuthority: "AXON Media Officer & Executive Council",
    status: "Active",
    type: "Technical Distinction",
    hash: "0x77c41a0e8841bb7f201095d321045a999fa41092",
  },
];

export const INITIAL_APPLICATIONS: MembershipApplication[] = [
  {
    id: "app-101",
    name: "Daniyal Tariq",
    email: "daniyal@uet.edu.pk",
    university: "IMAC, UET Lahore (Founding Chapter)",
    roleType: "General Member Engineer",
    preferredWing: "technical",
    githubUsername: "daniyal-tariq",
    statement:
      "Built Next.js + PostgreSQL lab utilities and contributed Linux infrastructure automation scripts.",
    status: "Pending",
    submittedAt: "2026-11-24",
  },
  {
    id: "app-102",
    name: "Zoya Fatima",
    email: "zoya@fast.edu.pk",
    university: "FAST-NUCES Lahore (Incubating Node)",
    roleType: "Campus Ambassador Lead",
    preferredWing: "marketing-pr",
    githubUsername: "zoya-fatima",
    statement:
      "Led campus developer outreach and coordinating inter-university sessions for AXON.",
    status: "Pending",
    submittedAt: "2026-11-23",
  },
];

export const INITIAL_ENDORSEMENTS: Endorsement[] = [
  {
    id: "end-01",
    recipientUsername: "arham",
    directorName: "Wajiha",
    directorRole: "Vice President (Core Lead)",
    wingId: "technical",
    badgeTitle: "Core Platform Architect",
    note: "Led the technical development and production verification of the askme.pk portal and CSV certification registry.",
    awardedAt: "2026-11-22",
  },
  {
    id: "end-02",
    recipientUsername: "tayyab",
    directorName: "Tahoor Tayyab",
    directorRole: "Media Officer (Core Lead)",
    wingId: "design",
    badgeTitle: "Visual Identity Steward",
    note: "Delivered the official AXON emblem system, dark/light lockups, and digital credential templates.",
    awardedAt: "2026-11-20",
  },
];

export const INITIAL_RSVPS: EventRsvp[] = [
  {
    id: "rsvp-01",
    eventSlug: "axon-portal-launch-symposium",
    eventTitle: "AXON Official Portal Launch & 11-Directorate Technical Showcase",
    name: "Afeef Ul Hussain",
    email: "afeef@askme.pk",
    university: "IMAC, UET Lahore",
    memberId: "AXN-26-313",
    createdAt: "2026-11-25",
  },
];

export const INITIAL_WING_TASKS: WingTask[] = [
  {
    id: "task-01",
    wingId: "technical",
    title: "Deploy askme.pk to Vercel with Cloudflare DNS & Resend SPF/DKIM",
    ownerName: "Arham",
    ownerRole: "Director",
    status: "In Progress",
    dueDate: "2026-12-01",
  },
  {
    id: "task-02",
    wingId: "technical",
    title: "Prepare bulk participant CSV upload for Zeros & Ones Workshop",
    ownerName: "Shahid",
    ownerRole: "Co-Director",
    status: "Completed",
    dueDate: "2026-11-20",
  },
  {
    id: "task-03",
    wingId: "decor",
    title: "Print QR Verification Standees for Launch Booth",
    ownerName: "Nimra (Section A)",
    ownerRole: "Director",
    status: "In Progress",
    dueDate: "2026-12-04",
  },
  {
    id: "task-04",
    wingId: "design",
    title: "Finalize Certificate Border & Emblem PNG Assets",
    ownerName: "Tayyab",
    ownerRole: "Director",
    status: "Completed",
    dueDate: "2026-11-18",
  },
  {
    id: "task-05",
    wingId: "documentation",
    title: "Publish Official Institutional Charter & Privacy Policy Copy",
    ownerName: "Aatika",
    ownerRole: "Director",
    status: "In Progress",
    dueDate: "2026-12-03",
  },
  {
    id: "task-06",
    wingId: "logistics",
    title: "Secure IMAC Auditorium & AV Staging Permissions",
    ownerName: "Mujtaba",
    ownerRole: "Director",
    status: "Completed",
    dueDate: "2026-11-28",
  },
];

export const INITIAL_FINANCE_RECORDS: FinanceRecord[] = [
  {
    id: "fin-01",
    title: "Launch Event Physical Branding & QR Standees",
    wingId: "decor",
    category: "Budget Allocation",
    amountPkr: 24000,
    status: "Approved",
    date: "2026-11-24",
  },
  {
    id: "fin-02",
    title: "Industry Tech Partner — Silver Tier Sponsorship",
    wingId: "sponsorship",
    category: "Sponsorship",
    amountPkr: 120000,
    status: "Settled",
    date: "2026-11-19",
  },
  {
    id: "fin-03",
    title: "askme.pk Domain & Infrastructure Allocation",
    wingId: "technical",
    category: "Expense",
    amountPkr: 8500,
    status: "Pending Audit",
    date: "2026-11-26",
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-01",
    actorName: "Afeef Ul Hussain",
    actorRole: "SUPER_ADMIN",
    action: "SEEDED_29_MEMBER_CHARTER",
    target: "11 Directorates & Executive Council",
    timestamp: "2026-11-28T10:00:00Z",
  },
  {
    id: "log-02",
    actorName: "Abeer Zafar",
    actorRole: "CORE_AUDITOR",
    action: "AUDITED_SPONSORSHIP_LEDGER",
    target: "fin-02 (PKR 120,000)",
    timestamp: "2026-11-26T15:30:00Z",
  },
];

export const INITIAL_INQUIRIES: ContactInquiry[] = [];
