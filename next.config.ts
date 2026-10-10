import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  allowedDevOrigins: ["192.168.31.150"],
  images: {
    // Every local photo is served from copies pre-rendered at build (scripts/gen-image-sizes.mjs + src/lib/image-loader.ts),
    // not Vercel's optimizer: its Hobby quota ran out 2026-10-11 and uncached photos returned 402.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Was 100 ("sharpest, slower accepted"); 08/10 the client found product photos too slow to appear. 90 looks the
    // same and is ~3x lighter (bandana main photo 1.26MB -> 460KB at 1920w). Every quality prop is coerced to this.
    qualities: [90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
      {
        // Product images uploaded from /admin, served from Supabase Storage's public bucket.
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
