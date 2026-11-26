import fs from "fs";
import path from "path";
import crypto from "crypto";
import type {
  AxonDatabaseState,
  AxonMember,
  BlogPost,
  ContactInquiry,
  Endorsement,
  EventRsvp,
  MembershipApplication,
  PortfolioTheme,
  Project,
  RbacRole,
  VerifiedCertificate,
} from "@/lib/types";
import {
  BLOGS,
  CERTIFICATES_DATABASE,
  INITIAL_APPLICATIONS,
  INITIAL_ENDORSEMENTS,
  INITIAL_INQUIRIES,
  INITIAL_RSVPS,
  MEMBERS_PORTFOLIOS,
  PROJECTS,
  WINGS,
} from "@/data/axonData";

function createSeedState(): AxonDatabaseState {
  return {
    members: structuredClone(MEMBERS_PORTFOLIOS),
    projects: structuredClone(PROJECTS),
    blogs: structuredClone(BLOGS),
    certificates: structuredClone(CERTIFICATES_DATABASE),
    applications: structuredClone(INITIAL_APPLICATIONS),
    rsvps: structuredClone(INITIAL_RSVPS),
    endorsements: structuredClone(INITIAL_ENDORSEMENTS),
    inquiries: structuredClone(INITIAL_INQUIRIES),
  };
}

let memoryCache: AxonDatabaseState | null = null;

function resolveDbPath(): string {
  const localPath = path.join(process.cwd(), ".axon-db.json");
  try {
    fs.accessSync(process.cwd(), fs.constants.W_OK);
    return localPath;
  } catch {
    return path.join("/tmp", "axon-db.json");
  }
}

export function readDb(): AxonDatabaseState {
  if (memoryCache) return memoryCache;

  const dbPath = resolveDbPath();
  try {
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, "utf8");
      const parsed = JSON.parse(raw) as AxonDatabaseState;
      if (parsed && parsed.members && parsed.certificates) {
        memoryCache = parsed;
        return memoryCache;
      }
    }
  } catch {
    // Fallback to seed state if corrupted or unreadable
  }

  memoryCache = createSeedState();
  writeDb(memoryCache);
  return memoryCache;
}

export function writeDb(state: AxonDatabaseState): void {
  memoryCache = state;
  const dbPath = resolveDbPath();
  try {
    fs.writeFileSync(dbPath, JSON.stringify(state, null, 2), "utf8");
  } catch {
    // Ignore write failure on strictly read-only environments; memoryCache remains active
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function computeAuditHash(seed: string): string {
  const digest = crypto.createHash("sha1").update(seed).digest("hex");
  return `0x${digest}`;
}

export function getPublicMembers(): AxonMember[] {
  const db = readDb();
  return Object.values(db.members).filter(
    (m) => m.isPublic && m.rbacRole !== "pending_applicant"
  );
}

export function getMemberByUsername(username: string): AxonMember | null {
  const db = readDb();
  const key = username.toLowerCase();
  return db.members[key] || null;
}

export function findMemberByEmailOrRole(
  email: string,
  requestedTier?: string
): AxonMember | null {
  const db = readDb();
  const cleanEmail = email.trim().toLowerCase();

  const existing = Object.values(db.members).find(
    (m) => m.email.toLowerCase() === cleanEmail
  );
  if (existing) return existing;

  // Check pending applications by email
  const pendingApp = db.applications.find(
    (a) => a.email.toLowerCase() === cleanEmail
  );
  if (pendingApp && pendingApp.status === "Pending") {
    const wingObj = WINGS.find((w) => w.id === pendingApp.preferredWing);
    return {
      username: slugify(pendingApp.name) || "applicant",
      name: pendingApp.name,
      headline: `${pendingApp.roleType} Candidate`,
      memberId: "PENDING-REVIEW",
      role: "Pending Applicant",
      rbacRole: "pending_applicant",
      wing: wingObj?.name || pendingApp.preferredWing,
      wingId: pendingApp.preferredWing,
      chapter: pendingApp.university,
      status: "Pending Review",
      avatar: "/assets/avatars/default.svg",
      bio: pendingApp.statement || "Application awaiting Executive Council review.",
      github: `https://github.com/${pendingApp.githubUsername}`,
      githubUsername: pendingApp.githubUsername,
      linkedin: "",
      email: pendingApp.email,
      graduationYear: 2027,
      internshipAvailable: false,
      themePreference: "obsidian-cyan",
      isPublic: false,
      portfolioViews: 0,
      education: [],
      skills: { languages: [], frameworks: [], systems: [] },
      timeline: [],
    };
  }

  // Fallback for instant demo authentication tiers
  if (requestedTier === "super_admin") return db.members["irfan"];
  if (requestedTier === "wing_director") return db.members["talha"];
  if (requestedTier === "approved_member") return db.members["mahnoor"];
  if (requestedTier === "pending_applicant") {
    const firstPending = db.applications.find((a) => a.status === "Pending");
    return {
      username: "pending_candidate",
      name: firstPending?.name || "Daniyal Tariq",
      headline: "Prospective Member Engineer",
      memberId: "PENDING-REVIEW",
      role: "Pending Applicant",
      rbacRole: "pending_applicant",
      wing: "Systems & Cloud Infrastructure",
      wingId: firstPending?.preferredWing || "systems-infra",
      chapter: firstPending?.university || "UET Lahore",
      status: "Pending Review",
      avatar: "/assets/avatars/default.svg",
      bio: "Application awaiting review by Directorate Lead.",
      github: "https://github.com/daniyal-tariq",
      githubUsername: "daniyal-tariq",
      linkedin: "",
      email: cleanEmail || firstPending?.email || "applicant@uet.edu.pk",
      graduationYear: 2027,
      internshipAvailable: false,
      themePreference: "obsidian-cyan",
      isPublic: false,
      portfolioViews: 0,
      education: [],
      skills: { languages: [], frameworks: [], systems: [] },
      timeline: [],
    };
  }

  return null;
}

export function createApplication(input: {
  name: string;
  email: string;
  university: string;
  roleType: string;
  preferredWing: string;
  githubUsername: string;
  statement: string;
}): MembershipApplication {
  const db = readDb();
  const cleanGithub = input.githubUsername
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/^@/, "")
    .replace(/\/+$/, "");

  const app: MembershipApplication = {
    id: `app-${Date.now()}`,
    name: input.name.trim(),
    email: input.email.trim(),
    university: input.university.trim(),
    roleType: input.roleType,
    preferredWing: input.preferredWing,
    githubUsername: cleanGithub || "student-dev",
    statement: input.statement.trim(),
    status: "Pending",
    submittedAt: new Date().toISOString().split("T")[0],
  };

  db.applications.unshift(app);
  writeDb(db);
  return app;
}

export function reviewApplication(input: {
  id: string;
  decision: "Approved" | "Rejected";
  assignedWing?: string;
  assignedRole?: RbacRole;
}): MembershipApplication | null {
  const db = readDb();
  const app = db.applications.find((a) => a.id === input.id);
  if (!app) return null;

  app.status = input.decision;
  app.reviewedAt = new Date().toISOString().split("T")[0];
  if (input.assignedWing) {
    app.preferredWing = input.assignedWing;
  }

  if (input.decision === "Approved") {
    const role: RbacRole = input.assignedRole || "approved_member";
    app.assignedRole = role;

    const seq = Object.keys(db.members).length + 60;
    const memberId = `AXN-2026-${String(seq).padStart(3, "0")}`;
    let baseUsername = slugify(app.name.split(" ")[0] || app.name) || `member${seq}`;
    if (db.members[baseUsername]) {
      baseUsername = `${baseUsername}-${seq}`;
    }

    const wingObj = WINGS.find((w) => w.id === app.preferredWing);
    const wingName = wingObj?.name || app.preferredWing;

    app.generatedMemberId = memberId;
    app.generatedUsername = baseUsername;

    const newMember: AxonMember = {
      username: baseUsername,
      name: app.name,
      headline: `${app.roleType} — ${wingName}`,
      memberId,
      role:
        role === "wing_director"
          ? `Director — ${wingName}`
          : role === "super_admin"
          ? "Executive Council Member"
          : app.roleType,
      rbacRole: role,
      wing: wingName,
      wingId: app.preferredWing,
      chapter: app.university,
      status:
        role === "super_admin"
          ? "Executive Council"
          : role === "wing_director"
          ? "Wing Director"
          : "Active Member",
      avatar: "/assets/avatars/default.svg",
      bio:
        app.statement ||
        `Inducted member of AXON ${wingName} from ${app.university}.`,
      github: `https://github.com/${app.githubUsername}`,
      githubUsername: app.githubUsername,
      linkedin: "https://linkedin.com",
      email: app.email,
      graduationYear: 2027,
      internshipAvailable: true,
      themePreference: "obsidian-cyan",
      isPublic: true,
      portfolioViews: 1,
      education: [
        {
          degree: "B.Sc. Engineering / Computing",
          institution: app.university,
          period: "2023 – 2027",
        },
      ],
      skills: {
        languages: ["TypeScript", "Python", "C++"],
        frameworks: ["Next.js", "React"],
        systems: ["Git", "Linux", "Docker"],
      },
      timeline: [
        {
          year: "2026 - Present",
          role: app.roleType,
          organization: `AXON (${wingName})`,
          description: `Inducted into AXON network (${app.university} Chapter).`,
        },
      ],
    };

    db.members[baseUsername] = newMember;

    // Auto-issue official induction certificate
    const cert: VerifiedCertificate = {
      certCode: memberId,
      recipientName: app.name,
      memberId,
      eventOrRole: `${newMember.role} — ${wingName}`,
      issueDate: app.reviewedAt,
      issuerAuthority: "AXON Executive Council & IMAC Directorate",
      status: "Active",
      type: "Leadership Appointment",
      hash: computeAuditHash(`${memberId}:${app.name}:${app.reviewedAt}`),
    };
    db.certificates.unshift(cert);
  }

  writeDb(db);
  return app;
}

export function createProjectRecord(
  member: AxonMember,
  input: {
    title: string;
    summary: string;
    architecture: string;
    githubRepo: string;
    liveDemoUrl?: string;
    techStack: string[];
    stars: number;
    forks: number;
    primaryLanguage?: string;
    wingId: string;
  }
): Project {
  const db = readDb();
  const baseSlug = slugify(input.title) || `project-${Date.now()}`;
  const exists = db.projects.some((p) => p.slug === baseSlug);
  const slug = exists ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;

  const project: Project = {
    id: `proj-${Date.now()}`,
    slug,
    title: input.title,
    author: {
      name: member.name,
      username: member.username,
      memberId: member.memberId,
      wing: member.wing,
      avatar: member.avatar,
    },
    summary: input.summary,
    architecture: input.architecture,
    techStack: input.techStack,
    githubRepo: input.githubRepo,
    liveDemoUrl: input.liveDemoUrl || undefined,
    stars: input.stars,
    forks: input.forks,
    primaryLanguage: input.primaryLanguage,
    lastSyncedAt: new Date().toISOString().split("T")[0],
    wingId: input.wingId || member.wingId,
    status: "Verified & Active",
  };

  db.projects.unshift(project);
  writeDb(db);
  return project;
}

export function moderateProjectRecord(
  id: string,
  status: Project["status"]
): Project | null {
  const db = readDb();
  const proj = db.projects.find((p) => p.id === id);
  if (!proj) return null;
  proj.status = status;
  writeDb(db);
  return proj;
}

export function createBlogDraft(
  member: AxonMember,
  input: {
    title: string;
    summary: string;
    content: string;
    tags: string[];
  }
): BlogPost {
  const db = readDb();
  const baseSlug = slugify(input.title) || `article-${Date.now()}`;
  const exists = db.blogs.some((b) => b.slug === baseSlug);
  const slug = exists ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;

  const wordCount = input.content.trim().split(/\s+/).length;
  const readTime = `${Math.max(2, Math.ceil(wordCount / 180))} min read`;

  const post: BlogPost = {
    id: `blog-${Date.now()}`,
    slug,
    title: input.title.trim(),
    author: {
      name: member.name,
      username: member.username,
      role: `${member.role}, AXON`,
    },
    wingId: member.wingId,
    publishedAt: new Date().toISOString().split("T")[0],
    readTime,
    tags: input.tags.length > 0 ? input.tags : ["Engineering", "AXON"],
    summary: input.summary.trim(),
    content: input.content.trim(),
    status:
      member.rbacRole === "super_admin" || member.rbacRole === "wing_director"
        ? "Published"
        : "Pending Review",
  };

  db.blogs.unshift(post);
  writeDb(db);
  return post;
}

export function moderateBlogRecord(
  id: string,
  status: BlogPost["status"]
): BlogPost | null {
  const db = readDb();
  const blog = db.blogs.find((b) => b.id === id);
  if (!blog) return null;
  blog.status = status;
  if (status === "Published") {
    blog.publishedAt = new Date().toISOString().split("T")[0];
  }
  writeDb(db);
  return blog;
}

export function issueCertificateRecord(input: {
  recipientName: string;
  eventOrRole: string;
  memberId?: string;
  issuerAuthority?: string;
  type?: VerifiedCertificate["type"];
}): VerifiedCertificate {
  const db = readDb();
  const certCode = `AXN-CERT-${Math.floor(1000 + Math.random() * 8999)}`;
  const issueDate = new Date().toISOString().split("T")[0];

  // Auto-link memberId if recipient matches a member name and memberId wasn't passed
  let linkedMemberId = input.memberId?.trim() || undefined;
  if (!linkedMemberId) {
    const matchedMember = Object.values(db.members).find(
      (m) => m.name.toLowerCase() === input.recipientName.trim().toLowerCase()
    );
    if (matchedMember) linkedMemberId = matchedMember.memberId;
  }

  const cert: VerifiedCertificate = {
    certCode,
    recipientName: input.recipientName.trim(),
    memberId: linkedMemberId,
    eventOrRole: input.eventOrRole.trim(),
    issueDate,
    issuerAuthority:
      input.issuerAuthority?.trim() ||
      "AXON Executive Council & IMAC Directorate",
    status: "Active",
    type: input.type || "Technical Distinction",
    hash: computeAuditHash(`${certCode}:${input.recipientName}:${issueDate}`),
  };

  db.certificates.unshift(cert);
  writeDb(db);
  return cert;
}

export function toggleCertificateStatus(
  certCode: string
): VerifiedCertificate | null {
  const db = readDb();
  const cert = db.certificates.find(
    (c) => c.certCode.toUpperCase() === certCode.toUpperCase()
  );
  if (!cert) return null;
  cert.status = cert.status === "Active" ? "Revoked" : "Active";
  writeDb(db);
  return cert;
}

export function verifyCredentialQuery(query: string): VerifiedCertificate | null {
  const db = readDb();
  const code = query.trim().toUpperCase();
  if (!code) return null;

  const cert = db.certificates.find(
    (c) =>
      c.certCode.toUpperCase() === code ||
      (c.memberId && c.memberId.toUpperCase() === code) ||
      c.recipientName.toUpperCase().includes(code)
  );
  if (cert) return cert;

  // Fallback check against active members
  const member = Object.values(db.members).find(
    (m) =>
      m.memberId.toUpperCase() === code ||
      m.username.toUpperCase() === code ||
      m.name.toUpperCase().includes(code)
  );

  if (member && member.rbacRole !== "pending_applicant") {
    return {
      certCode: member.memberId,
      recipientName: member.name,
      memberId: member.memberId,
      eventOrRole: `${member.role} — ${member.wing}`,
      issueDate: "2026-10-01",
      issuerAuthority: `AXON Umbrella Organization (${member.chapter})`,
      status: "Active",
      type: "Leadership Appointment",
      hash: computeAuditHash(`${member.memberId}:${member.name}`),
    };
  }

  return null;
}

export function updateMemberPortfolio(
  username: string,
  patch: {
    headline?: string;
    bio?: string;
    githubUsername?: string;
    linkedin?: string;
    graduationYear?: number;
    internshipAvailable?: boolean;
    themePreference?: PortfolioTheme;
    isPublic?: boolean;
    skills?: {
      languages: string[];
      frameworks: string[];
      systems: string[];
    };
  }
): AxonMember | null {
  const db = readDb();
  const member = db.members[username.toLowerCase()];
  if (!member) return null;

  if (patch.headline !== undefined) member.headline = patch.headline.trim();
  if (patch.bio !== undefined) member.bio = patch.bio.trim();
  if (patch.githubUsername !== undefined) {
    const clean = patch.githubUsername.replace(/^@/, "").trim();
    member.githubUsername = clean;
    member.github = `https://github.com/${clean}`;
  }
  if (patch.linkedin !== undefined) member.linkedin = patch.linkedin.trim();
  if (patch.graduationYear !== undefined)
    member.graduationYear = patch.graduationYear;
  if (patch.internshipAvailable !== undefined)
    member.internshipAvailable = patch.internshipAvailable;
  if (patch.themePreference !== undefined)
    member.themePreference = patch.themePreference;
  if (patch.isPublic !== undefined) member.isPublic = patch.isPublic;
  if (patch.skills !== undefined) member.skills = patch.skills;

  writeDb(db);
  return member;
}

export function createEventRsvpRecord(input: {
  eventSlug: string;
  eventTitle: string;
  name: string;
  email: string;
  university: string;
  memberId?: string;
}): { rsvp: EventRsvp; alreadyRegistered: boolean } {
  const db = readDb();
  const existing = db.rsvps.find(
    (r) =>
      r.eventSlug === input.eventSlug &&
      r.email.toLowerCase() === input.email.trim().toLowerCase()
  );
  if (existing) {
    return { rsvp: existing, alreadyRegistered: true };
  }

  const rsvp: EventRsvp = {
    id: `rsvp-${Date.now()}`,
    eventSlug: input.eventSlug,
    eventTitle: input.eventTitle,
    name: input.name.trim(),
    email: input.email.trim(),
    university: input.university.trim(),
    memberId: input.memberId,
    createdAt: new Date().toISOString().split("T")[0],
  };

  db.rsvps.unshift(rsvp);
  writeDb(db);
  return { rsvp, alreadyRegistered: false };
}

export function addDirectorEndorsement(input: {
  recipientUsername: string;
  directorName: string;
  directorRole: string;
  wingId: string;
  badgeTitle: string;
  note: string;
}): Endorsement {
  const db = readDb();
  const endorsement: Endorsement = {
    id: `end-${Date.now()}`,
    recipientUsername: input.recipientUsername.toLowerCase(),
    directorName: input.directorName,
    directorRole: input.directorRole,
    wingId: input.wingId,
    badgeTitle: input.badgeTitle.trim(),
    note: input.note.trim(),
    awardedAt: new Date().toISOString().split("T")[0],
  };
  db.endorsements.unshift(endorsement);
  writeDb(db);
  return endorsement;
}

export function createInquiryRecord(input: {
  name: string;
  organization: string;
  email: string;
  subject: string;
  message: string;
}): ContactInquiry {
  const db = readDb();
  const inquiry: ContactInquiry = {
    id: `inq-${Date.now()}`,
    name: input.name.trim(),
    organization: input.organization.trim(),
    email: input.email.trim(),
    subject: input.subject.trim(),
    message: input.message.trim(),
    createdAt: new Date().toISOString().split("T")[0],
  };
  db.inquiries.unshift(inquiry);
  writeDb(db);
  return inquiry;
}
