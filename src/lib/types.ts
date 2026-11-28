export type PortalRole =
  | "PUBLIC_VISITOR"
  | "PENDING_APPLICANT"
  | "APPROVED_MEMBER"
  | "CO_DIRECTOR"
  | "DIRECTOR"
  | "CORE_LEAD"
  | "CORE_AUDITOR"
  | "ADVISOR"
  | "SUPER_ADMIN";

export type PortfolioTheme =
  | "obsidian-cyan"
  | "imac-emerald"
  | "editorial-slate"
  | "monolith-amber";

export interface Wing {
  id: string;
  slug: string;
  name: string;
  directorate: string;
  code: string;
  lead: string;
  leadUsername: string;
  coLead: string;
  coLeadUsername: string;
  /** Internal only — MUST NEVER be displayed on public pages (/about, /wings) */
  reportsTo: string;
  reportsToUsername: string;
  role: string;
  tagline: string;
  mandate: string;
  focus: string[];
  tools: string[];
  status: "Active" | "Incubating" | "Expanding";
  initiativesCount: number;
}

export interface WingTask {
  id: string;
  wingId: string;
  title: string;
  ownerName: string;
  ownerRole: string;
  status: "Planned" | "In Progress" | "Completed";
  dueDate: string;
}

export interface AuditLog {
  id: string;
  actorName: string;
  actorRole: PortalRole;
  action: string;
  target: string;
  timestamp: string;
}

export interface FinanceRecord {
  id: string;
  title: string;
  wingId: string;
  category: "Budget Allocation" | "Sponsorship" | "Expense";
  amountPkr: number;
  status: "Approved" | "Pending Audit" | "Settled";
  date: string;
}

export interface AxonEvent {
  id: string;
  slug: string;
  title: string;
  category:
    | "Webinar"
    | "Technical Workshop"
    | "Bootcamp"
    | "Symposium"
    | "Orientation"
    | "Launch Event";
  date: string;
  time: string;
  location: string;
  isVirtual: boolean;
  status: "Pending Approval" | "Scheduled" | "Completed" | "Registrations Open" | "Rejected";
  wingId: string;
  capacity: number;
  attendeeCount: number;
  submittedBy: string;
  speaker: {
    name: string;
    title: string;
    organization: string;
    username?: string;
  };
  description: string;
  curriculum: string[];
  registrationUrl?: string;
}

export interface EventRsvp {
  id: string;
  eventSlug: string;
  eventTitle: string;
  name: string;
  email: string;
  university: string;
  memberId?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  author: {
    name: string;
    username: string;
    memberId: string;
    wing: string;
    avatar: string;
  };
  summary: string;
  architecture: string;
  techStack: string[];
  githubRepo: string;
  liveDemoUrl?: string;
  coverImage?: string;
  stars: number;
  forks: number;
  primaryLanguage?: string;
  lastSyncedAt?: string;
  wingId: string;
  status: "Verified & Active" | "Under Review" | "Rejected";
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  author: {
    name: string;
    username: string;
    role: string;
  };
  wingId: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  summary: string;
  content: string;
  status: "Published" | "Pending Review" | "Draft" | "Rejected";
}

export interface VerifiedCertificate {
  certCode: string;
  recipientName: string;
  memberId?: string;
  eventOrRole: string;
  issueDate: string;
  issuerAuthority: string;
  status: "Active" | "Revoked";
  type:
    | "Leadership Appointment"
    | "Workshop Speaker"
    | "Technical Distinction"
    | "Hackathon Winner"
    | "Event Attendance";
  hash: string;
}

export interface Endorsement {
  id: string;
  recipientUsername: string;
  directorName: string;
  directorRole: string;
  wingId: string;
  badgeTitle: string;
  note: string;
  awardedAt: string;
}

export interface AxonMember {
  username: string;
  name: string;
  headline: string;
  memberId: string;
  designation: string;
  category: "Patron" | "Core" | "Core (Independent Audit Line)" | "Directorate" | "Member";
  /** Internal only for public visibility rules */
  supervisedWings: string[];
  reportsTo?: string;
  portalResponsibilities?: string;
  rbacRole: PortalRole;
  wing: string;
  wingId: string;
  chapter: string;
  status:
    | "Active Member"
    | "Director"
    | "Co-Director"
    | "Executive Council"
    | "Faculty Patron"
    | "Pending Review";
  avatar: string;
  bio: string;
  github: string;
  githubUsername: string;
  linkedin: string;
  email: string;
  resumeUrl?: string;
  graduationYear: number;
  internshipAvailable: boolean;
  themePreference: PortfolioTheme;
  isPublic: boolean;
  portfolioViews: number;
  education: {
    degree: string;
    institution: string;
    period: string;
  }[];
  skills: {
    languages: string[];
    frameworks: string[];
    systems: string[];
  };
  timeline: {
    year: string;
    role: string;
    organization: string;
    description: string;
  }[];
}

export interface MembershipApplication {
  id: string;
  name: string;
  email: string;
  university: string;
  roleType: string;
  preferredWing: string;
  githubUsername: string;
  statement: string;
  status: "Pending" | "Approved" | "Rejected";
  assignedRole?: PortalRole;
  generatedMemberId?: string;
  generatedUsername?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  organization: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface OtpChallenge {
  email: string;
  codeHash: string;
  expiresAt: number;
  attempts: number;
}

export interface SessionUser {
  username: string;
  name: string;
  email: string;
  memberId: string;
  rbacRole: PortalRole;
  wingId: string;
  wing: string;
  supervisedWings: string[];
  avatar: string;
}

export interface AxonDatabaseState {
  members: Record<string, AxonMember>;
  events: AxonEvent[];
  projects: Project[];
  blogs: BlogPost[];
  certificates: VerifiedCertificate[];
  applications: MembershipApplication[];
  rsvps: EventRsvp[];
  endorsements: Endorsement[];
  inquiries: ContactInquiry[];
  wingTasks: WingTask[];
  financeRecords: FinanceRecord[];
  auditLogs: AuditLog[];
  otpChallenges: Record<string, OtpChallenge>;
}
