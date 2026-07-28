import type { MetadataRoute } from "next"
import { getAdminDb } from "@/lib/firebase-admin"

const SITE_URL = "https://7trendzdata.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ]

  try {
    const db = getAdminDb()
    const snap = await db.collection("blog_posts").where("status", "==", "published").get()
    const blogPages: MetadataRoute.Sitemap = snap.docs.map((doc) => {
      const data = doc.data()
      return {
        url: `${SITE_URL}/blog-reader?id=${doc.id}`,
        lastModified: data.updated_at?.toDate?.() || data.created_at?.toDate?.() || new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }
    })
    return [...staticPages, ...blogPages]
  } catch {
    return staticPages
  }
}
