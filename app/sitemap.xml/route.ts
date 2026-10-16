import { getSiteConfig } from "../../lib/site-config";

export const dynamic = "force-static";

export function GET() {
  const config = getSiteConfig();
  if (!config.indexable) return new Response("Not found", { status: 404 });
  const origin = new URL(config.domain).origin;
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
}
