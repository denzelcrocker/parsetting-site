import type { MetadataRoute } from "next";
import { getSiteConfig } from "../lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const config = getSiteConfig();
  return config.indexable
    ? {
        rules: {
          userAgent: "*",
          allow: "/",
          disallow: ["/license-admin/", "/license-api/"],
        },
        sitemap: `${new URL(config.domain).origin}/sitemap.xml`,
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
