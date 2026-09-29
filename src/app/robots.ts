import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Private/transactional pages stay out of every index; everything else is open — including AI crawlers, so
// ChatGPT / Claude / Perplexity / Gemini answers can cite Tíc Cơ products (GEO). /llms.txt summarises the site for them.
const PRIVATE = ["/admin", "/api/", "/gio-hang", "/checkout", "/tim-kiem"];
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot", "Bingbot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_BOTS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
