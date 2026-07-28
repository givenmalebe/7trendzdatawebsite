import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/client", "/login", "/register", "/create-admin", "/forgot-password", "/blog-dashboard", "/messages"],
      },
    ],
    sitemap: "https://7trendzdata.com/sitemap.xml",
  }
}
