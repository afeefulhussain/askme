import { z } from "zod";

export const passwordLoginSchema = z.object({
  email: z.string().trim().email("Enter a valid @askme.pk or registered email."),
  password: z.string().min(6, "Password must be at least 6 characters.").max(128),
});

export const adminPasswordResetSchema = z.object({
  username: z.string().trim().min(1, "Target user username is required.").max(80),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters.")
    .max(128),
});

export const otpRequestSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

export const otpVerifySchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP code must be a 6-digit number."),
});

export const applicationSchema = z.object({
  name: z.string().trim().min(2, "Full name is required.").max(120),
  email: z.string().trim().email("Valid email address is required."),
  rollNumber: z
    .string()
    .trim()
    .min(2, "University roll number is required.")
    .max(40),
  department: z
    .string()
    .trim()
    .min(2, "Academic department is required.")
    .max(120),
  university: z
    .string()
    .trim()
    .min(2, "University / chapter is required.")
    .max(120),
  roleType: z.string().trim().min(2).max(100),
  preferredWing: z.string().trim().min(2).max(60),
  githubUsername: z.string().trim().max(120).optional().default(""),
  linkedin: z.string().trim().max(240).optional().default(""),
  avatarUrl: z.string().trim().max(500).optional().default(""),
  skillsInput: z.string().trim().max(300).optional().default(""),
  statement: z
    .string()
    .trim()
    .min(10, "Technical bio / statement must be at least 10 characters.")
    .max(2000),
});

export const applicationReviewSchema = z.object({
  id: z.string().trim().min(1),
  decision: z.enum(["Approved", "Rejected"]),
  assignedWing: z.string().trim().optional(),
  assignedRole: z
    .enum([
      "APPROVED_MEMBER",
      "CO_DIRECTOR",
      "DIRECTOR",
      "CORE_LEAD",
      "CORE_AUDITOR",
      "ADVISOR",
      "SUPER_ADMIN",
    ])
    .optional(),
  initialPassword: z.string().min(8).max(128).optional(),
});

export const projectCreateSchema = z.object({
  githubRepo: z.string().trim().min(3, "GitHub repository URL is required."),
  title: z.string().trim().max(160).optional(),
  summary: z.string().trim().max(600).optional(),
  architecture: z.string().trim().max(1500).optional(),
  liveDemoUrl: z.string().trim().max(300).optional(),
  coverImage: z.string().trim().max(500).optional(),
  wingId: z.string().trim().optional(),
  techStack: z.array(z.string().trim()).optional(),
});

export const projectModerationSchema = z.object({
  id: z.string().trim().min(1),
  status: z.enum(["Verified & Active", "Under Review", "Rejected"]),
});

export const blogCreateSchema = z.object({
  title: z.string().trim().min(4, "Title is required.").max(180),
  summary: z.string().trim().min(10, "Summary is required.").max(600),
  content: z
    .string()
    .trim()
    .min(20, "Article content is required.")
    .max(25000),
  tags: z.array(z.string().trim()).optional().default([]),
});

export const blogModerationSchema = z.object({
  id: z.string().trim().min(1),
  status: z.enum(["Published", "Pending Review", "Draft", "Rejected"]),
});

export const eventCreateSchema = z.object({
  title: z.string().trim().min(4, "Event title is required.").max(180),
  category: z.enum([
    "Webinar",
    "Technical Workshop",
    "Bootcamp",
    "Symposium",
    "Orientation",
    "Launch Event",
  ]),
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD date format."),
  time: z.string().trim().min(3).max(60),
  location: z.string().trim().min(3).max(160),
  isVirtual: z.boolean().default(true),
  wingId: z.string().trim().min(2),
  capacity: z.number().int().min(10).max(5000).default(150),
  posterImage: z.string().trim().max(500).optional(),
  externalRegistrationUrl: z.string().trim().max(400).optional(),
  speakerName: z.string().trim().min(2).max(120),
  speakerTitle: z.string().trim().min(2).max(120),
  speakerOrg: z.string().trim().min(2).max(120),
  description: z.string().trim().min(15).max(2000),
  curriculum: z.array(z.string().trim().min(3)).min(1),
  schedule: z
    .array(
      z.object({
        time: z.string().trim().min(2).max(40),
        topic: z.string().trim().min(3).max(160),
        speaker: z.string().trim().max(100).optional(),
      })
    )
    .optional(),
});

export const eventModerationSchema = z.object({
  id: z.string().trim().min(1),
  status: z.enum([
    "Scheduled",
    "Registrations Open",
    "Completed",
    "Rejected",
  ]),
});

export const certificateCreateSchema = z.object({
  recipientName: z.string().trim().min(2).max(120),
  eventOrRole: z.string().trim().min(3).max(200),
  memberId: z.string().trim().max(40).optional(),
  issueDate: z.string().trim().optional(),
  certCode: z.string().trim().max(40).optional(),
  type: z
    .enum([
      "Leadership Appointment",
      "Workshop Speaker",
      "Technical Distinction",
      "Hackathon Winner",
      "Event Attendance",
    ])
    .optional(),
});

export const portfolioUpdateSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  headline: z.string().trim().min(3).max(200).optional(),
  bio: z.string().trim().max(3000).optional(),
  location: z.string().trim().max(120).optional(),
  department: z.string().trim().max(120).optional(),
  rollNumber: z.string().trim().max(40).optional(),
  githubUsername: z.string().trim().max(100).optional(),
  linkedin: z.string().trim().max(250).optional(),
  xHandle: z.string().trim().max(100).optional(),
  instagram: z.string().trim().max(120).optional(),
  website: z.string().trim().max(250).optional(),
  avatar: z.string().trim().max(500).optional(),
  resumeUrl: z.string().trim().max(500).optional(),
  graduationYear: z.number().int().min(2020).max(2035).optional(),
  internshipAvailable: z.boolean().optional(),
  themePreference: z
    .enum([
      "obsidian-cyan",
      "imac-emerald",
      "editorial-slate",
      "monolith-amber",
    ])
    .optional(),
  isPublic: z.boolean().optional(),
  skills: z
    .object({
      languages: z.array(z.string().trim()),
      frameworks: z.array(z.string().trim()),
      systems: z.array(z.string().trim()),
    })
    .optional(),
  timeline: z
    .array(
      z.object({
        year: z.string().trim().min(2).max(40),
        role: z.string().trim().min(2).max(120),
        organization: z.string().trim().min(2).max(140),
        description: z.string().trim().min(4).max(500),
      })
    )
    .optional(),
});

export const rsvpSchema = z.object({
  eventSlug: z.string().trim().min(1),
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().email().optional(),
  university: z.string().trim().max(120).optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(120),
  organization: z.string().trim().max(150).optional().default("Independent"),
  email: z.string().trim().email("Valid email is required."),
  subject: z.string().trim().min(2).max(150),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(3000),
});

export const endorsementSchema = z.object({
  recipientUsername: z.string().trim().min(1),
  badgeTitle: z.string().trim().min(3).max(120),
  note: z.string().trim().min(5).max(500),
});

export const taskCreateSchema = z.object({
  wingId: z.string().trim().min(1),
  title: z.string().trim().min(3).max(180),
  ownerName: z.string().trim().min(2).max(100),
  ownerRole: z.string().trim().min(2).max(80),
  dueDate: z.string().trim().min(4).max(40),
});

export const financeModerationSchema = z.object({
  id: z.string().trim().min(1),
  status: z.enum(["Approved", "Pending Audit", "Settled"]),
});
