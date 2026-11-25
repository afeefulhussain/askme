import { MetadataRoute } from "next";
import { WINGS, EVENTS, PROJECTS, BLOGS, MEMBERS_PORTFOLIOS } from "@/data/axonData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://axon.org.pk";

  // Static routes
  const staticRoutes = [
    "",
    "/about",
    "/wings",
    "/events",
    "/projects",
    "/blogs",
    "/join",
    "/contact",
    "/verify",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic event routes
  const eventRoutes = EVENTS.map((e) => ({
    url: `${baseUrl}/events/${e.slug}`,
    lastModified: new Date(e.date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic blog routes
  const blogRoutes = BLOGS.map((b) => ({
    url: `${baseUrl}/blogs/${b.slug}`,
    lastModified: new Date(b.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic project routes
  const projectRoutes = PROJECTS.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Dynamic member portfolio routes
  const memberRoutes = Object.keys(MEMBERS_PORTFOLIOS).map((username) => ({
    url: `${baseUrl}/u/${username}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...eventRoutes, ...blogRoutes, ...projectRoutes, ...memberRoutes];
}
