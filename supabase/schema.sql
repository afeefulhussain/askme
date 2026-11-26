-- AXON Official Platform — PostgreSQL / Supabase Production Schema
-- Matches Blueprint Section 9 (Core Collections/Tables) + Section 8.8 (RBAC)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum types
CREATE TYPE user_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE user_role AS ENUM ('public_visitor', 'pending_applicant', 'approved_member', 'wing_director', 'super_admin');
CREATE TYPE approval_status AS ENUM ('pending', 'verified_active', 'rejected');
CREATE TYPE blog_status AS ENUM ('draft', 'under_review', 'published', 'rejected');
CREATE TYPE certificate_status AS ENUM ('active', 'revoked');

-- 1. users
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'pending_applicant',
  status user_status NOT NULL DEFAULT 'pending',
  wing TEXT NOT NULL,
  university_chapter TEXT NOT NULL DEFAULT 'IMAC / UET Lahore',
  axon_member_id TEXT UNIQUE,
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
  graduation_year INTEGER,
  internship_available BOOLEAN NOT NULL DEFAULT TRUE,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. projects (1-to-Many from users)
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  architecture TEXT NOT NULL DEFAULT '',
  github_repo_url TEXT NOT NULL,
  live_demo_url TEXT,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  github_stars INTEGER NOT NULL DEFAULT 0,
  github_forks INTEGER NOT NULL DEFAULT 0,
  wing_id TEXT NOT NULL,
  cover_image TEXT,
  approval_status approval_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. blogs (1-to-Many from users)
CREATE TABLE public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content_mdx TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  cover_image TEXT,
  published_at TIMESTAMPTZ,
  status blog_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. certificates
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cert_code TEXT UNIQUE NOT NULL,
  recipient_name TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  event_or_role TEXT NOT NULL,
  issuer_authority TEXT NOT NULL DEFAULT 'AXON Executive Council & IMAC Directorate',
  certificate_type TEXT NOT NULL DEFAULT 'Technical Distinction',
  audit_hash TEXT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status certificate_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. endorsements (Director Endorsements & Contribution Badges - Section 10)
CREATE TABLE public.endorsements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  director_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  badge_title TEXT NOT NULL,
  note TEXT NOT NULL,
  wing_id TEXT NOT NULL,
  awarded_at DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Enable Row-Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.endorsements ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public portfolios readable" ON public.portfolios
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Verified projects readable" ON public.projects
  FOR SELECT USING (approval_status = 'verified_active');

CREATE POLICY "Published blogs readable" ON public.blogs
  FOR SELECT USING (status = 'published');

CREATE POLICY "Certificates verifiable publicly" ON public.certificates
  FOR SELECT USING (TRUE);

-- Approved Member Write Guards (Enforcing Blueprint Section 8.1 & 8.8)
CREATE POLICY "Approved members can submit projects" ON public.projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND status = 'approved'
      AND role IN ('approved_member', 'wing_director', 'super_admin')
    )
  );

CREATE POLICY "Approved members can submit blog drafts" ON public.blogs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND status = 'approved'
      AND role IN ('approved_member', 'wing_director', 'super_admin')
    )
  );

CREATE POLICY "Members manage own portfolio" ON public.portfolios
  FOR UPDATE USING (user_id = auth.uid());

-- Wing Director & Super Admin Moderation Policies
CREATE POLICY "Super admins manage certificates" ON public.certificates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );
