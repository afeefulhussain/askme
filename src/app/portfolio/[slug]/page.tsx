import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMemberByUsername, readDb } from "@/lib/db";
import { sanitizePublicMember } from "@/lib/rbac";
import {
  DEMO_PORTFOLIO_PROFILE,
  toMemberPortfolioProfile,
} from "@/lib/portfolio";
import PortfolioProfileClient from "@/components/PortfolioProfileClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug).toLowerCase();
  if (slug === "demo") {
    return {
      title: `${DEMO_PORTFOLIO_PROFILE.fullName} — Member Portfolio`,
      description: DEMO_PORTFOLIO_PROFILE.headline,
    };
  }

  const member = getMemberByUsername(slug);
  if (!member || member.rbacRole === "PENDING_APPLICANT" || !member.isPublic) {
    return { title: "Member Portfolio" };
  }

  return {
    title: `${member.name} — ${member.wing} | AXON Portfolio`,
    description: member.headline,
  };
}

export default async function DynamicPortfolioPage({ params }: PageProps) {
  const slug = decodeURIComponent(params.slug).toLowerCase();

  if (slug === "demo") {
    return <PortfolioProfileClient profile={DEMO_PORTFOLIO_PROFILE} isDemo />;
  }

  const [memberRaw, dbState] = await Promise.all([
    Promise.resolve(getMemberByUsername(slug)),
    Promise.resolve(readDb()),
  ]);

  if (
    !memberRaw ||
    memberRaw.rbacRole === "PENDING_APPLICANT" ||
    !memberRaw.isPublic
  ) {
    notFound();
  }

  // Strip private governance/auth fields (`passwordHash`, `reportsTo`, `supervisedWings`)
  const safeMember = sanitizePublicMember(memberRaw);

  const [memberProjects, memberEndorsements] = await Promise.all([
    Promise.resolve(
      dbState.projects.filter(
        (p) =>
          p.author.username === safeMember.username &&
          p.status === "Verified & Active"
      )
    ),
    Promise.resolve(
      dbState.endorsements.filter(
        (e) => e.recipientUsername === safeMember.username
      )
    ),
  ]);

  const profile = toMemberPortfolioProfile(
    {
      ...memberRaw,
      ...safeMember,
      reportsTo: undefined,
      supervisedWings: [],
      portalResponsibilities: undefined,
      passwordHash: undefined,
    },
    memberProjects,
    memberEndorsements
  );

  return <PortfolioProfileClient profile={profile} />;
}
