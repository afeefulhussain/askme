# AXON — Together We Transmit (`https://askme.pk`)

Official full-stack institutional portal for **AXON**, an independent student technology, creative engineering, and leadership organization originating at the **Innovation & Manufacturing Auxiliary Center (IMAC), University of Engineering & Technology (UET) Lahore**.

---

## Architecture & Tech Stack

- **Framework**: Next.js 14.2.35 (App Router) + React 18 + TypeScript + Zod Validation
- **Styling & Brand System**: Tailwind CSS (`#0A0D14` Terminal Void, `#00F0FF` Signal Cyan, `#10B981` Circuit Green, `#0F172A` Obsidian Ink) with official gear + upward "A" + neural transmission mark (`public/assets/axon-mark.svg`, `public/favicon.ico`, `public/assets/og-cover.png`).
- **Authentication & RBAC**: Passwordless **Email + 6-Digit OTP** flow powered by **Resend** (`axon@askme.pk`) + HMAC-SHA256 signed `HttpOnly` cookies (`AXON_SESSION_SECRET`, `secure: true` in production) across 9 governance roles:
  `PUBLIC_VISITOR`, `PENDING_APPLICANT`, `APPROVED_MEMBER`, `CO_DIRECTOR`, `DIRECTOR`, `CORE_LEAD`, `CORE_AUDITOR`, `ADVISOR`, `SUPER_ADMIN` (`Afeef Ul Hussain`, `AXN-26-313`).
- **Persistence & Storage**:
  - **Supabase** PostgreSQL + RLS + Storage (`avatars`, `project-covers`, `resumes`) defined in `supabase/schema.sql`.
  - Clean local file-backed fallback engine (`src/lib/db.ts` & `public/uploads/`) when Supabase/Resend keys are unset in local environments.
- **29-Member Master Governance Hierarchy & Public Visibility Policy**:
  - Public routes (`/about`, `/wings`) display Faculty Advisor, Core Team (flat section), and 11 Wings (Director & Co-Director) while keeping internal `Reports To` supervision mappings strictly private inside authenticated `/dashboard` and `/admin` portals.

---

## Implemented Routes

### Public Routes (`https://askme.pk`)
- `/` — Institutional Hero (*Together We Transmit*), `2,000+` attendee impact metrics, 11 Directorates preview, Events, GitHub Showcase, Verification callout, Technical Monographs
- `/about` — Institutional charter, University Chapter expansion roadmap, Faculty Advisor, Core Executive Council & 11 Wings (Director + Co-Director)
- `/wings` & `/wings/[slug]` — Complete matrix & individual charters for all 11 Directorates (`Technical`, `Decor`, `Design`, `Videography`, `Photography`, `Social Media`, `Documentation`, `Marketing & PR`, `Management`, `Logistics`, `Sponsorship`)
- `/events` & `/events/[slug]` — Approved events/workshops directory with Schema.org Event JSON-LD and One-Click Member RSVP
- `/projects` & `/projects/[slug]` — Verified student repositories (`Under Review` until Super Admin approval)
- `/blogs` & `/blogs/[slug]` — Published technical articles (`Pending Review` until Super Admin approval)
- `/talent` — Public Recruiter Directory & Talent Discovery
- `/u/[username]` — Verified member portfolios (`AXN-26-XXX`), GitHub language telemetry, downloadable Resume PDF link, and SVG Open Graph badges (`/api/og`)
- `/join` — Admissions & Induction portal supporting current & future university chapters
- `/contact` — Secretariat liaison portal routing inquiries via Resend to `axon@askme.pk`
- `/verify` — Cryptographic Credential Registry supporting search by Full Name, Certificate Serial ID, or Member ID (`AXN-26-313`, etc.)

### Protected Portals (`noindex`)
- `/login` — 2-Step Passwordless Email + 6-Digit OTP Portal Sign-In
- `/dashboard` — Member Operations Workspace: Auto-Generated Digital Student ID Card (QR + Hi-Res PNG + Vector PDF), Live Portfolio Builder, Photo/Resume/Cover Uploads (`/api/upload`), Project Submission, and Blog Drafts
- `/admin` — Role-scoped Executive Council & Wing Management Console: Induction approvals with automated Resend welcome emails, Core Team Event Proposals -> Super Admin approval, Technical Wing CSV Template Download & Bulk Certificate Upload (`/api/certificates/csv`), Wing Tasks (`/api/tasks`), Finance & Audit Logs, and Strict Super Admin Content Moderation

---

## API Endpoints

- `GET /api/health` — Operational telemetry & env status
- `POST /api/auth/otp/request` | `POST /api/auth/otp/verify` | `POST /api/auth/logout` | `GET /api/auth/me`
- `GET /api/verify?code=...` — Lookup certificates & Member IDs by serial, Member ID, or recipient name
- `GET /api/certificates/csv` | `POST /api/certificates/csv` — Technical Wing / Super Admin CSV template download & bulk certificate upload
- `GET/POST/PATCH /api/events` — Core Team event proposals (`Pending Approval`) & Super Admin event publication
- `GET/POST/PATCH /api/applications` — Admissions applications & onboarding workflow
- `GET/POST/PATCH /api/projects` — Member project submission (`Under Review`) & Super Admin approval
- `GET/POST/PATCH /api/blogs` — Member article submission (`Pending Review`) & Super Admin publication
- `GET/POST/PATCH /api/tasks` — Scoped Wing deliverables & completion tracking
- `POST /api/upload` — Multipart uploads (`avatars`, `project-covers`, `resumes`) to Supabase Storage / local fallback
- `GET/PUT /api/portfolio`, `GET/POST/PATCH /api/certificates`, `GET/POST /api/endorsements`, `GET/POST /api/events/rsvp`, `GET/POST /api/contact`, `GET /api/avatar`, `GET /api/og`

---

## Local Development & Verification

```bash
npm install
npm run typecheck
npm run lint
npm run build
npm run start
```

Copy `.env.example` to `.env.local` and configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `AXON_SESSION_SECRET`, `RESEND_API_KEY`, `AXON_FROM_EMAIL`, and `NEXT_PUBLIC_SITE_URL=https://askme.pk`.
