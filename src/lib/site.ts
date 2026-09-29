// The public origin used in canonical URLs, sitemap, robots, JSON-LD and llms.txt.
// Set NEXT_PUBLIC_SITE_URL on Vercel to the real domain (e.g. https://ticco.vn) — everything follows it.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://ticcostudio.vercel.app").replace(/\/$/, "");

/** Absolute URL for a site path or an already-absolute URL (Supabase images). */
export const abs = (path: string) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);

/** Plain text from admin rich-text HTML, trimmed for meta descriptions. */
export const plainText = (html: string, max = 155) => {
  const t = html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  return t.length > max ? `${t.slice(0, max - 1).replace(/\s+\S*$/, "")}…` : t;
};

export const SOCIALS = [
  "https://www.facebook.com/ticco.studios",
  "https://www.instagram.com/ticco.studios",
  "https://www.threads.net/@ticco.studios",
  "https://www.tiktok.com/@ticco.studios",
];
