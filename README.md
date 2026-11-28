# AXON — Together We Transmit (`https://askme.pk`)

Official full-stack institutional portal for **AXON**, an independent student technology, creative engineering, and leadership organization originating at the **Innovation & Manufacturing Auxiliary Center (IMAC), University of Engineering & Technology (UET) Lahore**.

---

## Architecture & Tech Stack

- **Framework**: Next.js 14.2.35 (App Router) + React 18 + TypeScript + Zod Validation
- **Styling & Identity**: Tailwind CSS + self-hosted `Inter`, `Lora`, and `JetBrains Mono` (`next/font`), WebP/AVIF optimized `<Image>` assets (`next/image`), dark institutional void chrome across public portal pages (`#0A0D14`, `#00F0FF`, `#10B981`), and minimalist off-white editorial portfolios (`/portfolio/[slug]`, `#FAF9F6` / `#FFFFFF` with `"Times New Roman"` accents).
- **Authentication & Password Governance**:
  - Salted `crypto.scrypt` password login (`POST /api/auth/login`) + secondary Email 6-digit OTP login (`POST /api/auth/otp/request` & `/verify`), stored in signed `HttpOnly` HMAC-SHA256 session cookies (`AXON_SESSION_SECRET`).
  - All 29 council and directorate members are seeded with unique `@askme.pk` login IDs (`<username>@askme.pk`) and deterministic unique initial passwords (`Axon!<Name>#<Suffix>` from `deriveInitialPassword(username, memberId)` in `src/lib/auth.ts`).
  - **Strict Governance Policy**: Regular members, Directors, Co-Directors, and Core Leads cannot change or reset passwords themselves (`403 Forbidden` on `/api/auth/password` & `/api/admin/users/password`); **only `SUPER_ADMIN` (`afeef@askme.pk`)** holds authority to set or reset passwords via `/admin`.
- **Persistence, Indexes & Background Queue**:
  - **Supabase** PostgreSQL + RLS + B-tree indexes (`supabase/schema.sql`) + Storage buckets (`avatars`, `onboarding-avatars`, `project-covers`, `event-posters`, `resumes`), using explicit column projections (`DB_PROJECTIONS`) and connection-pooled queries.
  - Persistent background job queue (`src/lib/jobs.ts`) offloading transactional emails (`axon@askme.pk`) and bulk CSV certificate imports (`POST /api/certificates/csv`, inspected at `GET /api/jobs`).
- **29-Member Master Governance Hierarchy & Public Visibility Policy**:
  - Public routes (`/about`, `/wings`, `/talent`, `/portfolio/[slug]`) never expose internal `reportsTo`, `supervisedWings`, or password credentials.

---

## Implemented Routes

### Public Routes (`https://askme.pk`)
- `/` — Institutional Hero, Live Event Visitor Notification Banner (`LiveEventBanner`), 11 Directorates preview, Events, GitHub Showcase, Verification Callout, and Technical Monographs
- `/about` & `/wings` & `/wings/[slug]` — Institutional Charter, Patron, Core Executive Council, and 11 Directorates
- `/events` & `/events/[slug]` — Debounced/paginated events catalog, individual event poster pages with schedule timetable, speakers, external registration/joining link, and One-Click RSVP
- `/projects` & `/projects/[slug]` — Verified student repositories synced with strict 4s GitHub API timeouts
- `/talent` — Debounced 300ms + server-side paginated recruiter directory (`/api/directory/talent`)
- `/portfolio/[slug]` (plus `/portfolio/demo` fallback & `/u/[username]` permanent redirect) — Reusable data-driven 6-section minimalist editorial portfolio hydrated via `MemberPortfolioProfile`
- `/join` — Complete member onboarding (photo upload, roll number, department, GitHub/LinkedIn, skills, bio) routed directly to `SUPER_ADMIN` review
- `/verify` — Cryptographic Credential Registry with 300ms debounced search and server-side paginated table (`/api/verify`)
- `/contact` — Async queued secretariat liaison routing to `axon@askme.pk`

### Protected Portals (`noindex`)
- `/login` — Dual `@askme.pk` Password + Email/OTP portal sign-in
- `/dashboard` — Member workspace with Digital Student ID Card (QR + PNG/PDF export), complete self-service profile editing (name, avatar, bio, skills, socials, timeline, resume), project & blog submissions, and password restriction policy card
- `/admin` — Role-scoped Executive Council & Wing console: Super Admin application onboarding approvals & Users/Password Governance (`PATCH /api/admin/users/password`), Finance Auditor ledger status moderation (`PATCH /api/finance`), Core Team event proposals (`POST /api/events`), Technical Wing CSV bulk import queue (`POST /api/certificates/csv`), Wing Tasks, and Background Job telemetry (`GET /api/jobs`)

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
