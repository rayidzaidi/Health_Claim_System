import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/officer/",
        "/hospital/",
        "/patient/",
        "/settings/",
        "/notifications/",
      ],
    },
    sitemap: "https://health-claim-system.vercel.app/sitemap.xml",
  };
}
