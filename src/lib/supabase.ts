import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/**
 * Explicit SQL column projections to prevent unfiltered `SELECT *` queries.
 */
export const DB_PROJECTIONS = {
  USER_PUBLIC:
    "id,name,email,username,role,designation,category,wing_id,wing_name,university_chapter,roll_number,department,axon_member_id,github_username,avatar_url",
  USER_INTERNAL:
    "id,name,email,username,role,designation,category,wing_id,wing_name,supervised_wings,reports_to,university_chapter,roll_number,department,axon_member_id,github_username,avatar_url",
  CERTIFICATE:
    "id,cert_code,recipient_name,member_id,event_or_role,issuer_authority,certificate_type,audit_hash,issue_date,status",
  PROJECT:
    "id,title,slug,description,architecture,github_repo_url,live_demo_url,cover_image,tech_stack,github_stars,github_forks,wing_id,approval_status",
  EVENT:
    "id,slug,title,category,event_date,event_time,location,is_virtual,wing_id,capacity,attendee_count,submitted_by,poster_image,external_registration_url,speaker_name,speaker_title,speaker_org,description,curriculum,schedule,status",
  APPLICATION:
    "id,name,email,roll_number,department,university,role_type,preferred_wing,github_username,avatar_url,statement,status,assigned_role,generated_member_id,submitted_at,reviewed_at",
} as const;

let cachedAdminClient: SupabaseClient | null = null;
let cachedAnonClient: SupabaseClient | null = null;

/**
 * Reuses pooled HTTP/Supavisor connections across serverless invocations.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  if (!cachedAdminClient) {
    cachedAdminClient = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      db: { schema: "public" },
      global: {
        headers: { "x-application-name": "axon-askme-portal" },
      },
    });
  }
  return cachedAdminClient;
}

export function getSupabaseAnon(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  if (!cachedAnonClient) {
    cachedAnonClient = createClient(url, anonKey, {
      auth: { persistSession: false },
      db: { schema: "public" },
    });
  }
  return cachedAnonClient;
}
