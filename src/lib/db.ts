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
  EventScheduleItem,
  FinanceRecord,
  MembershipApplication,
  PaginatedResult,
  PortalRole,
  PortfolioTheme,
  Project,
  PublicAxonMember,
  SafeSessionMember,
  SessionUser,
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
import { deriveInitialPassword, hashPassword } from "@/lib/auth";
import { sanitizePublicMember, sanitizeSessionMember } from "@/lib/rbac";

function seedSaltForMember(memberId: string): string {
  return crypto
    .createHash("sha256")
    .update(`axon-seed-salt:${memberId}`)
    .digest("hex")
    .slice(0, 32);
}

function ensureDbMigrations(state: AxonDatabaseState): boolean {
  let changed = false;
  if (!Array.isArray(state.jobs)) {
    state.jobs = [];
    changed = true;
  }
  for (const member of Object.values(state.members)) {
    if (!member.passwordHash) {
      const initialPass = deriveInitialPassword(member.username, member.memberId);
      member.passwordHash = hashPassword(
        initialPass,
        seedSaltForMember(member.memberId)
      );
      changed = true;
    }
    if (!member.location) {
      member.location = "Lahore, Pakistan";
      changed = true;
    }
  }
  return changed;
}

function createSeedState(): AxonDatabaseState {
  const seed: AxonDatabaseState = {
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
    jobs: [],
  };
  ensureDbMigrations(seed);
  return seed;
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
        const migrated = ensureDbMigrations(parsed);
        memoryCache = parsed;
        if (migrated) {
          writeDb(memoryCache);
        }
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
      rollNumber: pendingApp.rollNumber,
      department: pendingApp.department,
      location: "Lahore, Pakistan",
      status: "Pending Review",
      avatar:
        pendingApp.avatarUrl ||
        `/api/avatar?name=${encodeURIComponent(pendingApp.name)}&id=PENDING`,
      bio:
        pendingApp.statement ||
        "Application awaiting Executive Council review.",
      github: pendingApp.githubUsername
        ? `https://github.com/${pendingApp.githubUsername}`
        : "",
      githubUsername: pendingApp.githubUsername,
      linkedin: pendingApp.linkedin || "",
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
  rollNumber?: string;
  department?: string;
  university: string;
  roleType: string;
  preferredWing: string;
  githubUsername: string;
  linkedin?: string;
  avatarUrl?: string;
  skillsInput?: string;
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
    rollNumber: input.rollNumber?.trim() || undefined,
    department: input.department?.trim() || undefined,
    university: input.university.trim(),
    roleType: input.roleType,
    preferredWing: input.preferredWing,
    githubUsername: cleanGithub || "axon-builder",
    linkedin: input.linkedin?.trim() || undefined,
    avatarUrl: input.avatarUrl?.trim() || undefined,
    skillsInput: input.skillsInput?.trim() || undefined,
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
        roll_number: app.rollNumber || null,
        department: app.department || null,
        university: app.university,
        role_type: app.roleType,
        preferred_wing: app.preferredWing,
        github_username: app.githubUsername,
        linkedin: app.linkedin || null,
        avatar_url: app.avatarUrl || null,
        skills_input: app.skillsInput || null,
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
}): (MembershipApplication & { issuedInitialPassword?: string }) | null {
  const db = readDb();
  const app = db.applications.find((a) => a.id === input.id);
  if (!app) return null;

  app.status = input.decision;
  app.reviewedAt = new Date().toISOString().split("T")[0];
  if (input.assignedWing) {
    app.preferredWing = input.assignedWing;
  }

  let issuedInitialPassword: string | undefined;

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

    issuedInitialPassword = deriveInitialPassword(baseUsername, memberId);
    const parsedSkills = (app.skillsInput || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

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
      passwordHash: hashPassword(issuedInitialPassword),
      rbacRole: role,
      wing: wingName,
      wingId: app.preferredWing,
      chapter: app.university,
      rollNumber: app.rollNumber,
      department: app.department,
      location: "Lahore, Pakistan",
      status:
        role === "SUPER_ADMIN"
          ? "Executive Council"
          : role === "DIRECTOR"
          ? "Director"
          : role === "CO_DIRECTOR"
          ? "Co-Director"
          : "Active Member",
      avatar:
        app.avatarUrl ||
        `/api/avatar?name=${encodeURIComponent(app.name)}&id=${encodeURIComponent(memberId)}`,
      bio:
        app.statement ||
        `Inducted member of AXON ${wingName} (${app.university}).`,
      github: `https://github.com/${app.githubUsername}`,
      githubUsername: app.githubUsername,
      linkedin: app.linkedin || "",
      email: app.email,
      graduationYear: 2027,
      internshipAvailable: true,
      themePreference: "obsidian-cyan",
      isPublic: true,
      portfolioViews: 1,
      education: [
        {
          degree: app.department
            ? `B.Sc. ${app.department}`
            : "B.Sc. Engineering & Technology",
          institution: app.university,
          period: "2023 – 2027",
        },
      ],
      skills: {
        languages:
          parsedSkills.length > 0
            ? parsedSkills.slice(0, 6)
            : ["TypeScript", "Python", "C++"],
        frameworks:
          parsedSkills.length > 6
            ? parsedSkills.slice(6, 12)
            : ["Next.js", "React"],
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

  return issuedInitialPassword
    ? { ...app, issuedInitialPassword }
    : app;
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
    posterImage?: string;
    externalRegistrationUrl?: string;
    schedule?: EventScheduleItem[];
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
    posterImage: input.posterImage || "/assets/poster-launch.png",
    externalRegistrationUrl: input.externalRegistrationUrl || undefined,
    schedule: input.schedule?.length ? input.schedule : undefined,
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
    name?: string;
    headline?: string;
    bio?: string;
    location?: string;
    department?: string;
    rollNumber?: string;
    githubUsername?: string;
    linkedin?: string;
    xHandle?: string;
    instagram?: string;
    website?: string;
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
    education?: AxonMember["education"];
    timeline?: AxonMember["timeline"];
  }
): AxonMember | null {
  const db = readDb();
  const key = username.toLowerCase();
  const member = db.members[key];
  if (!member) return null;

  if (patch.name !== undefined && patch.name.trim()) {
    member.name = patch.name.trim();
  }
  if (patch.headline !== undefined) member.headline = patch.headline.trim();
  if (patch.bio !== undefined) member.bio = patch.bio.trim();
  if (patch.location !== undefined) member.location = patch.location.trim();
  if (patch.department !== undefined) member.department = patch.department.trim();
  if (patch.rollNumber !== undefined) member.rollNumber = patch.rollNumber.trim();
  if (patch.githubUsername !== undefined) {
    const clean = patch.githubUsername.replace(/^@/, "").trim();
    member.githubUsername = clean;
    member.github = clean ? `https://github.com/${clean}` : "";
  }
  if (patch.linkedin !== undefined) member.linkedin = patch.linkedin.trim();
  if (patch.xHandle !== undefined) member.xHandle = patch.xHandle.trim();
  if (patch.instagram !== undefined) member.instagram = patch.instagram.trim();
  if (patch.website !== undefined) member.website = patch.website.trim();
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
  if (patch.education !== undefined) member.education = patch.education;
  if (patch.timeline !== undefined) member.timeline = patch.timeline;

  // Sync display name / avatar onto authored projects
  for (const proj of db.projects) {
    if (proj.author.username === key) {
      proj.author.name = member.name;
      proj.author.avatar = member.avatar;
    }
  }

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

export function setMemberPasswordHash(
  username: string,
  newPlainPassword: string,
  actorName: string,
  actorRole: PortalRole
): SafeSessionMember | null {
  const db = readDb();
  const key = username.toLowerCase();
  const member = db.members[key];
  if (!member) return null;

  member.passwordHash = hashPassword(newPlainPassword);
  writeDb(db);

  appendAuditLog(
    actorName,
    actorRole,
    "PASSWORD_RESET_BY_SUPER_ADMIN",
    `${member.name} (@${member.username} / ${member.email})`
  );

  return sanitizeSessionMember(member);
}

export function moderateFinanceRecord(
  id: string,
  status: FinanceRecord["status"],
  actorName?: string,
  actorRole?: PortalRole
): FinanceRecord | null {
  const db = readDb();
  const record = db.financeRecords.find((f) => f.id === id);
  if (!record) return null;

  record.status = status;
  writeDb(db);

  if (actorName && actorRole) {
    appendAuditLog(
      actorName,
      actorRole,
      `FINANCE_${status.toUpperCase().replace(/\s+/g, "_")}`,
      `${record.title} (PKR ${record.amountPkr.toLocaleString()})`
    );
  }
  return record;
}

export function paginateItems<T>(
  items: T[],
  page = 1,
  limit = 12
): PaginatedResult<T> {
  const safeLimit = Math.max(1, Math.min(50, limit));
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const safePage = Math.max(1, Math.min(totalPages, page));
  const start = (safePage - 1) * safeLimit;
  return {
    items: items.slice(start, start + safeLimit),
    total,
    page: safePage,
    limit: safeLimit,
    totalPages,
  };
}

export function queryTalentDirectory(opts: {
  q?: string;
  wing?: string;
  internshipOnly?: boolean;
  page?: number;
  limit?: number;
}): PaginatedResult<PublicAxonMember> {
  const q = (opts.q || "").trim().toLowerCase();
  const wing = (opts.wing || "all").trim().toLowerCase();

  let list = getPublicMembers();
  if (wing !== "all") {
    list = list.filter((m) => m.wingId.toLowerCase() === wing);
  }
  if (opts.internshipOnly) {
    list = list.filter((m) => m.internshipAvailable);
  }
  if (q) {
    list = list.filter((m) => {
      const hay = [
        m.name,
        m.username,
        m.memberId,
        m.designation,
        m.wing,
        m.headline,
        m.department || "",
        ...m.skills.languages,
        ...m.skills.frameworks,
        ...m.skills.systems,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }

  return paginateItems(list.map(sanitizePublicMember), opts.page, opts.limit);
}

export function queryCertificates(opts: {
  q?: string;
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}): PaginatedResult<VerifiedCertificate> {
  const db = readDb();
  const q = (opts.q || "").trim().toLowerCase();
  const type = (opts.type || "all").trim().toLowerCase();
  const status = (opts.status || "all").trim().toLowerCase();

  let list = [...db.certificates];
  if (type !== "all") {
    list = list.filter((c) => c.type.toLowerCase() === type);
  }
  if (status !== "all") {
    list = list.filter((c) => c.status.toLowerCase() === status);
  }
  if (q) {
    list = list.filter(
      (c) =>
        c.certCode.toLowerCase().includes(q) ||
        c.recipientName.toLowerCase().includes(q) ||
        (c.memberId && c.memberId.toLowerCase().includes(q)) ||
        c.eventOrRole.toLowerCase().includes(q)
    );
  }

  return paginateItems(list, opts.page, opts.limit);
}

export function queryEvents(opts: {
  q?: string;
  category?: string;
  wing?: string;
  includeUnapproved?: boolean;
  page?: number;
  limit?: number;
}): PaginatedResult<AxonEvent> {
  const db = readDb();
  const q = (opts.q || "").trim().toLowerCase();
  const category = (opts.category || "all").trim().toLowerCase();
  const wing = (opts.wing || "all").trim().toLowerCase();

  let list = opts.includeUnapproved
    ? [...db.events]
    : db.events.filter(
        (e) => e.status !== "Pending Approval" && e.status !== "Rejected"
      );

  if (category !== "all") {
    list = list.filter((e) => e.category.toLowerCase() === category);
  }
  if (wing !== "all") {
    list = list.filter((e) => e.wingId.toLowerCase() === wing);
  }
  if (q) {
    list = list.filter((e) =>
      [e.title, e.description, e.location, e.speaker.name, e.wingId]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }

  return paginateItems(list, opts.page, opts.limit);
}

export function queryProjects(opts: {
  q?: string;
  wing?: string;
  includeUnapproved?: boolean;
  page?: number;
  limit?: number;
}): PaginatedResult<Project> {
  const db = readDb();
  const q = (opts.q || "").trim().toLowerCase();
  const wing = (opts.wing || "all").trim().toLowerCase();

  let list = opts.includeUnapproved
    ? [...db.projects]
    : db.projects.filter((p) => p.status === "Verified & Active");

  if (wing !== "all") {
    list = list.filter((p) => p.wingId.toLowerCase() === wing);
  }
  if (q) {
    list = list.filter((p) =>
      [
        p.title,
        p.summary,
        p.author.name,
        p.primaryLanguage || "",
        ...p.techStack,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }

  return paginateItems(list, opts.page, opts.limit);
}

export function queryApplications(opts: {
  q?: string;
  status?: string;
  page?: number;
  limit?: number;
}): PaginatedResult<MembershipApplication> {
  const db = readDb();
  const q = (opts.q || "").trim().toLowerCase();
  const status = (opts.status || "all").trim().toLowerCase();

  let list = [...db.applications];
  if (status !== "all") {
    list = list.filter((a) => a.status.toLowerCase() === status);
  }
  if (q) {
    list = list.filter((a) =>
      [
        a.name,
        a.email,
        a.university,
        a.preferredWing,
        a.rollNumber || "",
        a.department || "",
        a.githubUsername,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }

  return paginateItems(list, opts.page, opts.limit);
}

export function getUpcomingPublishedEvents(): AxonEvent[] {
  const db = readDb();
  return db.events.filter(
    (e) => e.status === "Registrations Open" || e.status === "Scheduled"
  );
}

export async function getDashboardBundle(session: SessionUser) {
  const [memberRaw, dbState] = await Promise.all([
    Promise.resolve(
      getMemberByUsername(session.username) || findMemberByEmail(session.email)
    ),
    Promise.resolve(readDb()),
  ]);

  const [myProjects, myBlogs, myCertificates, myEndorsements, myRsvps, upcomingEvents] =
    await Promise.all([
      Promise.resolve(
        dbState.projects.filter(
          (p) => p.author.username === session.username.toLowerCase()
        )
      ),
      Promise.resolve(
        dbState.blogs.filter(
          (b) => b.author.username === session.username.toLowerCase()
        )
      ),
      Promise.resolve(
        dbState.certificates.filter(
          (c) =>
            c.memberId === session.memberId ||
            c.recipientName.toLowerCase() === session.name.toLowerCase()
        )
      ),
      Promise.resolve(
        dbState.endorsements.filter(
          (e) => e.recipientUsername === session.username.toLowerCase()
        )
      ),
      Promise.resolve(
        dbState.rsvps.filter(
          (r) =>
            r.email.toLowerCase() === session.email.toLowerCase() ||
            r.memberId === session.memberId
        )
      ),
      Promise.resolve(getUpcomingPublishedEvents()),
    ]);

  return {
    member: memberRaw ? sanitizeSessionMember(memberRaw) : null,
    myProjects,
    myBlogs,
    myCertificates,
    myEndorsements,
    myRsvps,
    upcomingEvents,
  };
}
