export type RbacRole =
  | "public_visitor"
  | "pending_applicant"
  | "approved_member"
  | "wing_director"
  | "super_admin";

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
  role: string;
  tagline: string;
  mandate: string;
  focus: string[];
  tools: string[];
  status: "Active" | "Incubating" | "Expanding";
  initiativesCount: number;
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
    | "Orientation";
  date: string;
  time: string;
  location: string;
  isVirtual: boolean;
  status: "Scheduled" | "Completed" | "Registrations Open";
  wingId: string;
  capacity: number;
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
    | "Hackathon Winner";
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
  role: string;
  rbacRole: RbacRole;
  wing: string;
  wingId: string;
  chapter: string;
  status: "Active Member" | "Wing Director" | "Executive Council" | "Pending Review";
  avatar: string;
  bio: string;
  github: string;
  githubUsername: string;
  linkedin: string;
  email: string;
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
  assignedRole?: RbacRole;
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

export interface SessionUser {
  username: string;
  name: string;
  email: string;
  memberId: string;
  rbacRole: RbacRole;
  wingId: string;
  wing: string;
  avatar: string;
}

export interface AxonDatabaseState {
  members: Record<string, AxonMember>;
  projects: Project[];
  blogs: BlogPost[];
  certificates: VerifiedCertificate[];
  applications: MembershipApplication[];
  rsvps: EventRsvp[];
  endorsements: Endorsement[];
  inquiries: ContactInquiry[];
}
