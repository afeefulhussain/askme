-- AXON Web Portal (askme.pk) — Complete Production PostgreSQL / Supabase Migration Schema
-- Aligned with Master Production Specification (Sections A, C & D)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum definitions
CREATE TYPE user_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE portal_role AS ENUM (
  'PUBLIC_VISITOR',
  'PENDING_APPLICANT',
  'APPROVED_MEMBER',
  'CO_DIRECTOR',
  'DIRECTOR',
  'CORE_LEAD',
  'CORE_AUDITOR',
  'ADVISOR',
  'SUPER_ADMIN'
);
CREATE TYPE approval_status AS ENUM ('under_review', 'verified_active', 'rejected');
CREATE TYPE blog_status AS ENUM ('draft', 'pending_review', 'published', 'rejected');
CREATE TYPE event_status AS ENUM ('pending_approval', 'scheduled', 'registrations_open', 'completed', 'rejected');
CREATE TYPE certificate_status AS ENUM ('active', 'revoked');

-- 1. users (29 Master Charter Members + Inducted Members)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  role portal_role NOT NULL DEFAULT 'PENDING_APPLICANT',
  status user_status NOT NULL DEFAULT 'pending',
  designation TEXT NOT NULL DEFAULT 'Member',
  category TEXT NOT NULL DEFAULT 'Member',
  wing_id TEXT NOT NULL,
  wing_name TEXT NOT NULL,
  supervised_wings TEXT[] NOT NULL DEFAULT '{}',
  reports_to TEXT,
  university_chapter TEXT NOT NULL DEFAULT 'IMAC, UET Lahore',
  axon_member_id TEXT UNIQUE, -- Format: AXN-26-XXX
  github_username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. portfolios (1-to-1 with users)
CREATE TABLE public.portfolios (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  headline TEXT NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  skills JSONB NOT NULL DEFAULT '{"languages":[],"frameworks":[],"systems":[]}',
  experience JSONB NOT NULL DEFAULT '[]',
  education JSONB NOT NULL DEFAULT '[]',
  social_links JSONB NOT NULL DEFAULT '{}',
  resume_url TEXT,
  theme_preference TEXT NOT NULL DEFAULT 'obsidian-cyan',
  graduation_year INTEGER DEFAULT 2027,
  internship_available BOOLEAN NOT NULL DEFAULT TRUE,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. projects (All member submissions start as under_review; require SUPER_ADMIN approval)
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  architecture TEXT NOT NULL DEFAULT '',
  github_repo_url TEXT NOT NULL,
  live_demo_url TEXT,
  cover_image TEXT,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  github_stars INTEGER NOT NULL DEFAULT 0,
  github_forks INTEGER NOT NULL DEFAULT 0,
  wing_id TEXT NOT NULL,
  approval_status approval_status NOT NULL DEFAULT 'under_review',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. blogs (All member submissions start as pending_review; require SUPER_ADMIN approval)
CREATE TABLE public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content_mdx TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  published_at TIMESTAMPTZ,
  status blog_status NOT NULL DEFAULT 'pending_review',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. events (Core Team creates/submits -> SUPER_ADMIN approves)
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,
  location TEXT NOT NULL,
  is_virtual BOOLEAN NOT NULL DEFAULT TRUE,
  wing_id TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 200,
  attendee_count INTEGER NOT NULL DEFAULT 0,
  submitted_by TEXT NOT NULL,
  speaker_name TEXT NOT NULL,
  speaker_title TEXT NOT NULL,
  speaker_org TEXT NOT NULL,
  description TEXT NOT NULL,
  curriculum TEXT[] NOT NULL DEFAULT '{}',
  status event_status NOT NULL DEFAULT 'pending_approval',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_slug TEXT NOT NULL REFERENCES public.events(slug) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  university TEXT NOT NULL,
  member_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_slug, email)
);

-- 6. certificates (Supports manual issuance & Technical Wing bulk CSV upload)
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cert_code TEXT UNIQUE NOT NULL,
  recipient_name TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  member_id TEXT,
  event_or_role TEXT NOT NULL,
  issuer_authority TEXT NOT NULL DEFAULT 'AXON Executive Council & IMAC Directorate',
  certificate_type TEXT NOT NULL DEFAULT 'Technical Distinction',
  audit_hash TEXT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status certificate_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. applications, endorsements, inquiries, tasks, finance, audit_logs
CREATE TABLE public.applications (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  university TEXT NOT NULL,
  role_type TEXT NOT NULL,
  preferred_wing TEXT NOT NULL,
  github_username TEXT,
  statement TEXT NOT NULL,
  status user_status NOT NULL DEFAULT 'pending',
  assigned_role portal_role,
  generated_member_id TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE TABLE public.endorsements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  director_name TEXT NOT NULL,
  director_role TEXT NOT NULL,
  wing_id TEXT NOT NULL,
  badge_title TEXT NOT NULL,
  note TEXT NOT NULL,
  awarded_at DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  organization TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.wing_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wing_id TEXT NOT NULL,
  title TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  owner_role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Planned',
  due_date DATE NOT NULL
);

CREATE TABLE public.finance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  wing_id TEXT NOT NULL,
  category TEXT NOT NULL,
  amount_pkr INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending Audit',
  record_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_name TEXT NOT NULL,
  actor_role portal_role NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row-Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Strictly hide internal reports_to via public views/API projections)
CREATE POLICY "Public portfolios readable" ON public.portfolios FOR SELECT USING (is_public = TRUE);
CREATE POLICY "Verified projects readable" ON public.projects FOR SELECT USING (approval_status = 'verified_active');
CREATE POLICY "Published blogs readable" ON public.blogs FOR SELECT USING (status = 'published');
CREATE POLICY "Approved events readable" ON public.events FOR SELECT USING (status IN ('scheduled', 'registrations_open', 'completed'));
CREATE POLICY "Certificates verifiable publicly" ON public.certificates FOR SELECT USING (TRUE);

-- Super Admin Full Policies
CREATE POLICY "Super Admin controls projects" ON public.projects FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);
CREATE POLICY "Super Admin controls blogs" ON public.blogs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);
CREATE POLICY "Super Admin controls events" ON public.events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'SUPER_ADMIN')
);

-- Supabase Storage Buckets (Run once in Supabase SQL Editor)
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('project-covers', 'project-covers', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true) ON CONFLICT DO NOTHING;
