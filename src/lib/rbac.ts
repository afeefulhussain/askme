import type {
  AxonMember,
  PortalRole,
  PublicAxonMember,
  SafeSessionMember,
} from "@/lib/types";

export function canAccessDashboard(role: PortalRole): boolean {
  return role !== "PUBLIC_VISITOR" && role !== "PENDING_APPLICANT";
}

export function canSubmitProjects(role: PortalRole): boolean {
  return canAccessDashboard(role);
}

export function canSubmitBlogs(role: PortalRole): boolean {
  return canAccessDashboard(role);
}

export function canAccessAdmin(role: PortalRole): boolean {
  return (
    role === "CO_DIRECTOR" ||
    role === "DIRECTOR" ||
    role === "CORE_LEAD" ||
    role === "CORE_AUDITOR" ||
    role === "ADVISOR" ||
    role === "SUPER_ADMIN"
  );
}

export function isSuperAdmin(role: PortalRole): boolean {
  return role === "SUPER_ADMIN";
}

export function canResetPasswords(role: PortalRole): boolean {
  return role === "SUPER_ADMIN";
}

export function canApproveApplications(role: PortalRole): boolean {
  return role === "SUPER_ADMIN";
}

export function canCreateEventProposal(role: PortalRole): boolean {
  return role === "SUPER_ADMIN" || role === "CORE_LEAD" || role === "ADVISOR";
}

export function canApproveEventsAndContent(role: PortalRole): boolean {
  return role === "SUPER_ADMIN";
}

export function canUploadCertificateCsv(
  role: PortalRole,
  wingId: string
): boolean {
  if (role === "SUPER_ADMIN") return true;
  return (
    (role === "DIRECTOR" || role === "CO_DIRECTOR") && wingId === "technical"
  );
}

export function canViewFinanceAndAudit(role: PortalRole): boolean {
  return (
    role === "SUPER_ADMIN" ||
    role === "CORE_AUDITOR" ||
    role === "ADVISOR"
  );
}

export function sanitizePublicMember(member: AxonMember): PublicAxonMember {
  const {
    passwordHash: _passwordHash,
    reportsTo: _reportsTo,
    supervisedWings: _supervisedWings,
    portalResponsibilities: _portalResp,
    ...safe
  } = member;
  void _passwordHash;
  void _reportsTo;
  void _supervisedWings;
  void _portalResp;
  return safe;
}

export function sanitizeSessionMember(member: AxonMember): SafeSessionMember {
  const { passwordHash: _passwordHash, ...safe } = member;
  void _passwordHash;
  return safe;
}

export function formatRbacLabel(role: PortalRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super Admin (President)";
    case "ADVISOR":
      return "Faculty Advisor (Patron)";
    case "CORE_AUDITOR":
      return "Core Finance Auditor";
    case "CORE_LEAD":
      return "Core Team Lead";
    case "DIRECTOR":
      return "Wing Director";
    case "CO_DIRECTOR":
      return "Wing Co-Director";
    case "APPROVED_MEMBER":
      return "Approved Member";
    case "PENDING_APPLICANT":
      return "Pending Applicant";
    default:
      return "Public Visitor";
  }
}
