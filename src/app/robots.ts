import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.weboryskills.in"; // Using your production domain

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/profile/", "/teacher/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
