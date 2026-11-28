import fs from "fs";
import path from "path";
import crypto from "crypto";
import type {
  AxonDatabaseState,
  AxonEvent,
  AxonMember,
  BlogPost,
  ContactInquiry,
  Endorsement,
  EventRsvp,
  MembershipApplication,
  PortalRole,
  PortfolioTheme,
  Project,
  VerifiedCertificate,
  WingTask,
} from "@/lib/types";
import {
  BLOGS,
  CERTIFICATES_DATABASE,
  EVENTS,
  INITIAL_APPLICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ENDORSEMENTS,
  INITIAL_FINANCE_RECORDS,
  INITIAL_INQUIRIES,
  INITIAL_RSVPS,
  INITIAL_WING_TASKS,
  MEMBERS_PORTFOLIOS,
  PROJECTS,
  WINGS,
} from "@/data/axonData";
import { getSupabaseAdmin } from "@/lib/supabase";

function createSeedState(): AxonDatabaseState {
  return {
    members: structuredClone(MEMBERS_PORTFOLIOS),
    events: structuredClone(EVENTS),
    projects: structuredClone(PROJECTS),
    blogs: structuredClone(BLOGS),
    certificates: structuredClone(CERTIFICATES_DATABASE),
    applications: structuredClone(INITIAL_APPLICATIONS),
    rsvps: structuredClone(INITIAL_RSVPS),
    endorsements: structuredClone(INITIAL_ENDORSEMENTS),
    inquiries: structuredClone(INITIAL_INQUIRIES),
    wingTasks: structuredClone(INITIAL_WING_TASKS),
    financeRecords: structuredClone(INITIAL_FINANCE_RECORDS),
    auditLogs: structuredClone(INITIAL_AUDIT_LOGS),
    otpChallenges: {},
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
      if (parsed && parsed.members && parsed.certificates && parsed.events) {
        memoryCache = parsed;
        return memoryCache;
      }
    }
  } catch {
    // Fallback to seed state
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
    // Ignore write failure on strictly read-only environments
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

export function appendAuditLog(
  actorName: string,
  actorRole: PortalRole,
  action: string,
  target: string
): void {
  const db = readDb();
  db.auditLogs.unshift({
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    actorName,
    actorRole,
    action,
    target,
    timestamp: new Date().toISOString(),
  });
  if (db.auditLogs.length > 100) {
    db.auditLogs = db.auditLogs.slice(0, 100);
  }
  writeDb(db);
}

// OTP Management
export function saveOtpChallenge(email: string, codeHash: string): void {
  const db = readDb();
  const key = email.trim().toLowerCase();
  db.otpChallenges[key] = {
    email: key,
    codeHash,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    attempts: 0,
  };
  writeDb(db);
}

export function getOtpChallenge(email: string) {
  const db = readDb();
  return db.otpChallenges[email.trim().toLowerCase()] || null;
}

export function incrementOtpAttempts(email: string): void {
  const db = readDb();
  const key = email.trim().toLowerCase();
  if (db.otpChallenges[key]) {
    db.otpChallenges[key].attempts += 1;
    writeDb(db);
  }
}

export function clearOtpChallenge(email: string): void {
  const db = readDb();
  delete db.otpChallenges[email.trim().toLowerCase()];
  writeDb(db);
}

export function getPublicMembers(): AxonMember[] {
  const db = readDb();
  return Object.values(db.members).filter(
    (m) => m.isPublic && m.rbacRole !== "PENDING_APPLICANT"
  );
}

export function getMemberByUsername(username: string): AxonMember | null {
  const db = readDb();
  return db.members[username.toLowerCase()] || null;
}

export function findMemberByEmail(email: string): AxonMember | null {
  const db = readDb();
  const cleanEmail = email.trim().toLowerCase();

  const existing = Object.values(db.members).find(
    (m) => m.email.toLowerCase() === cleanEmail
  );
  if (existing) return existing;

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
      designation: "Applicant",
      category: "Member",
      supervisedWings: [],
      rbacRole: "PENDING_APPLICANT",
      wing: wingObj?.name || pendingApp.preferredWing,
      wingId: pendingApp.preferredWing,
      chapter: pendingApp.university,
      status: "Pending Review",
      avatar: `/api/avatar?name=${encodeURIComponent(pendingApp.name)}&id=PENDING`,
      bio:
        pendingApp.statement ||
        "Application awaiting Executive Council review.",
      github: pendingApp.githubUsername
        ? `https://github.com/${pendingApp.githubUsername}`
        : "",
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
    githubUsername: cleanGithub || "axon-builder",
    statement: input.statement.trim(),
    status: "Pending",
    submittedAt: new Date().toISOString().split("T")[0],
  };

  db.applications.unshift(app);
  writeDb(db);

  // Best-effort sync to Supabase when configured
  const sb = getSupabaseAdmin();
  if (sb) {
    void sb
      .from("applications")
      .insert({
        id: app.id,
        name: app.name,
        email: app.email,
        university: app.university,
        role_type: app.roleType,
        preferred_wing: app.preferredWing,
        github_username: app.githubUsername,
        statement: app.statement,
        status: "pending",
      })
      .then(() => {}, () => {});
  }

  return app;
}

export function reviewApplication(input: {
  id: string;
  decision: "Approved" | "Rejected";
  assignedWing?: string;
  assignedRole?: PortalRole;
  actorName?: string;
  actorRole?: PortalRole;
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
    const role: PortalRole = input.assignedRole || "APPROVED_MEMBER";
    app.assignedRole = role;

    // Member ID Format: AXN-26-XXX (Section D.3)
    const seq = 350 + Object.keys(db.members).length;
    const memberId = `AXN-26-${String(seq).padStart(3, "0")}`;
    let baseUsername =
      slugify(app.name.split(" ")[0] || app.name) || `member${seq}`;
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
      designation:
        role === "DIRECTOR"
          ? "Director"
          : role === "CO_DIRECTOR"
          ? "Co-Director"
          : role === "CORE_LEAD"
          ? "Core Lead"
          : "Member Engineer",
      category:
        role === "DIRECTOR" || role === "CO_DIRECTOR" ? "Directorate" : "Member",
      supervisedWings: role === "CORE_LEAD" ? [app.preferredWing] : [],
      reportsTo: wingObj?.reportsTo,
      rbacRole: role,
      wing: wingName,
      wingId: app.preferredWing,
      chapter: app.university,
      status:
        role === "SUPER_ADMIN"
          ? "Executive Council"
          : role === "DIRECTOR"
          ? "Director"
          : role === "CO_DIRECTOR"
          ? "Co-Director"
          : "Active Member",
      avatar: `/api/avatar?name=${encodeURIComponent(app.name)}&id=${encodeURIComponent(memberId)}`,
      bio:
        app.statement ||
        `Inducted member of AXON ${wingName} (${app.university}).`,
      github: `https://github.com/${app.githubUsername}`,
      githubUsername: app.githubUsername,
      linkedin: "",
      email: app.email,
      graduationYear: 2027,
      internshipAvailable: true,
      themePreference: "obsidian-cyan",
      isPublic: true,
      portfolioViews: 1,
      education: [
        {
          degree: "B.Sc. Engineering & Technology",
          institution: app.university,
          period: "2023 – 2027",
        },
      ],
      skills: {
        languages: ["TypeScript", "Python", "C++"],
        frameworks: ["Next.js", "React"],
        systems: ["Git", "Linux", "PostgreSQL"],
      },
      timeline: [
        {
          year: "2026 - Present",
          role: app.roleType,
          organization: `AXON (${wingName})`,
          description: `Inducted into AXON network (${app.university}).`,
        },
      ],
    };

    db.members[baseUsername] = newMember;

    const cert: VerifiedCertificate = {
      certCode: memberId,
      recipientName: app.name,
      memberId,
      eventOrRole: `${app.roleType} — ${wingName} Directorate`,
      issueDate: app.reviewedAt,
      issuerAuthority: "AXON Executive Council & IMAC Directorate",
      status: "Active",
      type: "Leadership Appointment",
      hash: computeAuditHash(`${memberId}:${app.name}:${app.reviewedAt}`),
    };
    db.certificates.unshift(cert);
  }

  writeDb(db);

  if (input.actorName && input.actorRole) {
    appendAuditLog(
      input.actorName,
      input.actorRole,
      `APPLICATION_${input.decision.toUpperCase()}`,
      `${app.name} (${app.generatedMemberId || app.id})`
    );
  }

  return app;
}

// Strict Section D.3 Policy: ALL member projects start as "Under Review" and require SUPER_ADMIN approval!
export function createProjectRecord(
  member: AxonMember,
  input: {
    title: string;
    summary: string;
    architecture: string;
    githubRepo: string;
    liveDemoUrl?: string;
    coverImage?: string;
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
  const slug = exists
    ? `${baseSlug}-${Date.now().toString().slice(-4)}`
    : baseSlug;

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
    coverImage: input.coverImage || undefined,
    stars: input.stars,
    forks: input.forks,
    primaryLanguage: input.primaryLanguage,
    lastSyncedAt: new Date().toISOString().split("T")[0],
    wingId: input.wingId || member.wingId,
    status: "Under Review",
  };

  db.projects.unshift(project);
  writeDb(db);
  return project;
}

export function moderateProjectRecord(
  id: string,
  status: Project["status"],
  actorName?: string,
  actorRole?: PortalRole
): Project | null {
  const db = readDb();
  const proj = db.projects.find((p) => p.id === id);
  if (!proj) return null;
  proj.status = status;
  writeDb(db);
  if (actorName && actorRole) {
    appendAuditLog(
      actorName,
      actorRole,
      `PROJECT_${status.toUpperCase().replace(/\s+/g, "_")}`,
      proj.title
    );
  }
  return proj;
}

// Strict Section D.3 Policy: ALL member blogs start as "Pending Review" and require SUPER_ADMIN approval!
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
  const slug = exists
    ? `${baseSlug}-${Date.now().toString().slice(-4)}`
    : baseSlug;

  const wordCount = input.content.trim().split(/\s+/).length;
  const readTime = `${Math.max(2, Math.ceil(wordCount / 180))} min read`;

  const post: BlogPost = {
    id: `blog-${Date.now()}`,
    slug,
    title: input.title.trim(),
    author: {
      name: member.name,
      username: member.username,
      role: `${member.designation}, AXON`,
    },
    wingId: member.wingId,
    publishedAt: new Date().toISOString().split("T")[0],
    readTime,
    tags: input.tags.length > 0 ? input.tags : ["Engineering", "AXON"],
    summary: input.summary.trim(),
    content: input.content.trim(),
    status: "Pending Review",
  };

  db.blogs.unshift(post);
  writeDb(db);
  return post;
}

export function moderateBlogRecord(
  id: string,
  status: BlogPost["status"],
  actorName?: string,
  actorRole?: PortalRole
): BlogPost | null {
  const db = readDb();
  const blog = db.blogs.find((b) => b.id === id);
  if (!blog) return null;
  blog.status = status;
  if (status === "Published") {
    blog.publishedAt = new Date().toISOString().split("T")[0];
  }
  writeDb(db);
  if (actorName && actorRole) {
    appendAuditLog(
      actorName,
      actorRole,
      `BLOG_${status.toUpperCase().replace(/\s+/g, "_")}`,
      blog.title
    );
  }
  return blog;
}

// Events Workflow (Section C.3): Core Team creates/submits -> Super Admin approves!
export function createEventProposal(
  submittedBy: string,
  input: {
    title: string;
    category: AxonEvent["category"];
    date: string;
    time: string;
    location: string;
    isVirtual: boolean;
    wingId: string;
    capacity: number;
    speakerName: string;
    speakerTitle: string;
    speakerOrg: string;
    description: string;
    curriculum: string[];
  },
  autoPublish = false
): AxonEvent {
  const db = readDb();
  const baseSlug = slugify(input.title) || `event-${Date.now()}`;
  const exists = db.events.some((e) => e.slug === baseSlug);
  const slug = exists ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;

  const evt: AxonEvent = {
    id: `evt-${Date.now()}`,
    slug,
    title: input.title,
    category: input.category,
    date: input.date,
    time: input.time,
    location: input.location,
    isVirtual: input.isVirtual,
    status: autoPublish ? "Registrations Open" : "Pending Approval",
    wingId: input.wingId,
    capacity: input.capacity,
    attendeeCount: 0,
    submittedBy,
    speaker: {
      name: input.speakerName,
      title: input.speakerTitle,
      organization: input.speakerOrg,
    },
    description: input.description,
    curriculum: input.curriculum,
    registrationUrl: `/events/${slug}`,
  };

  db.events.unshift(evt);
  writeDb(db);
  return evt;
}

export function moderateEventRecord(
  id: string,
  status: AxonEvent["status"],
  actorName?: string,
  actorRole?: PortalRole
): AxonEvent | null {
  const db = readDb();
  const evt = db.events.find((e) => e.id === id);
  if (!evt) return null;
  evt.status = status;
  writeDb(db);
  if (actorName && actorRole) {
    appendAuditLog(
      actorName,
      actorRole,
      `EVENT_${status.toUpperCase().replace(/\s+/g, "_")}`,
      evt.title
    );
  }
  return evt;
}

export function issueCertificateRecord(input: {
  recipientName: string;
  eventOrRole: string;
  memberId?: string;
  issueDate?: string;
  certCode?: string;
  issuerAuthority?: string;
  type?: VerifiedCertificate["type"];
}): VerifiedCertificate {
  const db = readDb();
  const certCode =
    input.certCode?.trim().toUpperCase() ||
    `AXN-CERT-${Math.floor(1000 + Math.random() * 8999)}`;
  const issueDate =
    input.issueDate?.trim() || new Date().toISOString().split("T")[0];

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

  // Upsert by certCode
  const existingIdx = db.certificates.findIndex(
    (c) => c.certCode.toUpperCase() === certCode
  );
  if (existingIdx >= 0) {
    db.certificates[existingIdx] = cert;
  } else {
    db.certificates.unshift(cert);
  }
  writeDb(db);
  return cert;
}

export function bulkIssueCertificates(
  rows: Array<{
    recipientName: string;
    eventOrRole: string;
    issueDate?: string;
    certCode?: string;
    memberId?: string;
    type?: VerifiedCertificate["type"];
  }>,
  actorName: string,
  actorRole: PortalRole
): VerifiedCertificate[] {
  const issued: VerifiedCertificate[] = [];
  for (const row of rows) {
    issued.push(
      issueCertificateRecord({
        recipientName: row.recipientName,
        eventOrRole: row.eventOrRole,
        issueDate: row.issueDate,
        certCode: row.certCode,
        memberId: row.memberId,
        type: row.type || "Event Attendance",
        issuerAuthority: "AXON Technical Directorate & Executive Council",
      })
    );
  }
  appendAuditLog(
    actorName,
    actorRole,
    "BULK_CERTIFICATE_CSV_UPLOAD",
    `Uploaded ${issued.length} verified certificate records`
  );
  return issued;
}

export function toggleCertificateStatus(
  certCode: string,
  actorName?: string,
  actorRole?: PortalRole
): VerifiedCertificate | null {
  const db = readDb();
  const cert = db.certificates.find(
    (c) => c.certCode.toUpperCase() === certCode.toUpperCase()
  );
  if (!cert) return null;
  cert.status = cert.status === "Active" ? "Revoked" : "Active";
  writeDb(db);
  if (actorName && actorRole) {
    appendAuditLog(
      actorName,
      actorRole,
      `CERTIFICATE_${cert.status.toUpperCase()}`,
      cert.certCode
    );
  }
  return cert;
}

export function verifyCredentialQuery(query: string): VerifiedCertificate | null {
  const db = readDb();
  const code = query.trim().toUpperCase();
  if (!code) return null;

  // Match by serial ID, member ID, or recipient name (Section C.3)
  const cert = db.certificates.find(
    (c) =>
      c.certCode.toUpperCase() === code ||
      (c.memberId && c.memberId.toUpperCase() === code) ||
      c.recipientName.toUpperCase().includes(code)
  );
  if (cert) return cert;

  const member = Object.values(db.members).find(
    (m) =>
      m.memberId.toUpperCase() === code ||
      m.username.toUpperCase() === code ||
      m.name.toUpperCase().includes(code)
  );

  if (member && member.rbacRole !== "PENDING_APPLICANT") {
    return {
      certCode: member.memberId,
      recipientName: member.name,
      memberId: member.memberId,
      eventOrRole: `${member.designation} — ${member.wing}`,
      issueDate: "2026-10-01",
      issuerAuthority: `AXON Independent Organization (${member.chapter})`,
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
    avatar?: string;
    resumeUrl?: string;
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
    member.github = clean ? `https://github.com/${clean}` : "";
  }
  if (patch.linkedin !== undefined) member.linkedin = patch.linkedin.trim();
  if (patch.avatar !== undefined) member.avatar = patch.avatar.trim();
  if (patch.resumeUrl !== undefined) member.resumeUrl = patch.resumeUrl.trim();
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
  const evt = db.events.find((e) => e.slug === input.eventSlug);
  if (evt) evt.attendeeCount += 1;
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

export function createWingTaskRecord(input: {
  wingId: string;
  title: string;
  ownerName: string;
  ownerRole: string;
  dueDate: string;
}): WingTask {
  const db = readDb();
  const task: WingTask = {
    id: `task-${Date.now()}`,
    wingId: input.wingId,
    title: input.title,
    ownerName: input.ownerName,
    ownerRole: input.ownerRole,
    status: "Planned",
    dueDate: input.dueDate,
  };
  db.wingTasks.unshift(task);
  writeDb(db);
  return task;
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
