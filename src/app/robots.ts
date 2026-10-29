import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://septfacture.cd";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/signup", "/terms", "/privacy"],
      disallow: ["/dashboard/", "/invoices/", "/clients/", "/payments/", "/settings/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

