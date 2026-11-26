import { MetadataRoute } from "next";
import { WINGS, EVENTS } from "@/data/axonData";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://axon.org.pk";
  const db = readDb();

  const staticRoutes = [
    "",
    "/about",
    "/wings",
    "/events",
    "/projects",
    "/blogs",
    "/talent",
    "/join",
    "/contact",
    "/verify",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const wingRoutes = WINGS.map((w) => ({
    url: `${baseUrl}/wings/${w.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const eventRoutes = EVENTS.map((e) => ({
    url: `${baseUrl}/events/${e.slug}`,
    lastModified: new Date(e.date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogRoutes = db.blogs
    .filter((b) => b.status === "Published")
    .map((b) => ({
      url: `${baseUrl}/blogs/${b.slug}`,
      lastModified: new Date(b.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const projectRoutes = db.projects
    .filter((p) => p.status === "Verified & Active")
    .map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  const memberRoutes = Object.values(db.members)
    .filter((m) => m.isPublic && m.rbacRole !== "pending_applicant")
    .map((m) => ({
      url: `${baseUrl}/u/${m.username}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [
    ...staticRoutes,
    ...wingRoutes,
    ...eventRoutes,
    ...blogRoutes,
    ...projectRoutes,
    ...memberRoutes,
  ];
}
