# AXON Official Platform (`axon.org.pk` / `askme.pk`)

Official full-stack web platform for **AXON**, an independent technology, innovation, and leadership umbrella organization originating at the **Innovation & Manufacturing Auxiliary Center (IMAC), University of Engineering & Technology (UET) Lahore**.

---

## Architecture & Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling & Design System**: Tailwind CSS (`#0A0D14` Terminal Void, `#00F0FF` Axon Cyan, `#10B981` Circuit Green, `#F8FAFC`/`#94A3B8` Slate)
- **Typography**: `Lora` (Editorial Serif headings), `Inter` (UI & Body), `JetBrains Mono` (Metadata & Audit Hashes)
- **Authentication & RBAC**: HMAC-SHA256 signed `HttpOnly` session cookies (`src/lib/auth.ts`) enforcing 5 permission levels:
  1. `public_visitor`
  2. `pending_applicant`
  3. `approved_member`
  4. `wing_director` (Wing-scoped moderation)
  5. `super_admin` (Full organization access)
- **Persistence Layer**:
  - Zero-config local/serverless repository engine (`src/lib/db.ts`) persisting state to `.axon-db.json` (with `/tmp` fallback).
  - Production PostgreSQL / Supabase schema with Row-Level Security (RLS) included in `supabase/schema.sql`.
- **External Integrations**: Live GitHub REST API repository sync & user language telemetry (`src/lib/github.ts`), plus genuine ISO QR Code generation (`qrcode`).

---

## Implemented Routes

### Public SEO Routes
- `/` — Institutional Hero, live metrics, 11 Directorates preview, Events, GitHub Projects, Verification callout, Engineering Monographs
- `/about` — Institutional charter, governance model, Executive Council org tree, IMAC facility details
- `/wings` & `/wings/[slug]` — Complete directory & individual sub-pages for all 11 operational directorates (`DIR-01` through `DIR-11`)
- `/events` & `/events/[slug]` — Filterable technical workshops/symposia with Schema.org Event JSON-LD and One-Click Member RSVP
- `/projects` & `/projects/[slug]` — GitHub-synced student engineering showcase filterable by directorate & tech stack
- `/blogs` & `/blogs/[slug]` — Technical papers & monographs with Markdown code block renderer & author portfolio attribution
- `/talent` — Recruiter-facing filterable Member Directory & Talent Discovery
- `/u/[username]` — Public, SEO-indexed Student Portfolios with dynamic Open Graph preview images (`opengraph-image.tsx`), QR share dialog, and CV/PDF print export
- `/join` — Induction & onboarding portal for General Members, Ambassadors, and Chapter Leads
- `/contact` — Institutional partnerships & sponsorship dispatch portal
- `/verify` — Discreet Cryptographic Certificate & Member ID Verification Registry

### Protected Routes (`noindex`)
- `/login` — Role-tier & institutional authentication portal
- `/dashboard` — Member Workspace: Auto-Generated Digital Student ID Card (scannable QR, Hi-Res PNG export, Vector PDF print), Live Portfolio Builder, GitHub Repo Sync, Blog Draft submission, and Credential Vault
- `/admin` — Executive Council Console: Application approvals (auto-generating Member IDs, portfolios, and certificates), Certificate issuance & revocation, Project & Blog moderation, Director Endorsements, and Contact Inquiries

---

## API Endpoints

- `GET /api/health` — System status & node telemetry
- `POST /api/auth/login` | `POST /api/auth/logout` | `GET /api/auth/me`
- `GET /api/verify?code=...` — Public credential lookup
- `GET/POST/PATCH /api/applications` — Induction submissions & Council approval workflow
- `GET/POST/PATCH /api/projects` — Member GitHub repo sync & moderation
- `GET/POST/PATCH /api/blogs` — Member article drafts & publishing workflow
- `GET/POST/PATCH /api/certificates` — Certificate issuance & status revocation
- `GET/PUT /api/portfolio` — Live portfolio editor updates
- `GET/POST /api/endorsements` — Director endorsement badges
- `GET/POST /api/events/rsvp` — One-Click Member & Guest event RSVPs
- `GET/POST /api/contact` — Institutional inquiries
- `GET /api/github?url=...` — Live GitHub REST repository metadata fetcher

---

## Local Development & Verification

```bash
# Install dependencies
npm install

# TypeScript strict verification
npm run typecheck

# Production build
npm run build

# Start development server
npm run dev
```

Copy `.env.example` to `.env.local` to customize `AXON_SESSION_SECRET`, optional `GITHUB_TOKEN`, or Supabase production keys.
