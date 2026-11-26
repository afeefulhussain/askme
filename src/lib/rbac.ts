import type { RbacRole } from "@/lib/types";

export function canAccessDashboard(role: RbacRole): boolean {
  return (
    role === "approved_member" ||
    role === "wing_director" ||
    role === "super_admin"
  );
}

export function canSubmitProjects(role: RbacRole): boolean {
  return canAccessDashboard(role);
}

export function canSubmitBlogs(role: RbacRole): boolean {
  return canAccessDashboard(role);
}

export function canAccessAdmin(role: RbacRole): boolean {
  return role === "wing_director" || role === "super_admin";
}

export function isSuperAdmin(role: RbacRole): boolean {
  return role === "super_admin";
}

export function formatRbacLabel(role: RbacRole): string {
  switch (role) {
    case "super_admin":
      return "Super Admin (Executive Council)";
    case "wing_director":
      return "Wing Director";
    case "approved_member":
      return "Approved Member";
    case "pending_applicant":
      return "Pending Applicant";
    default:
      return "Public Visitor";
  }
}
