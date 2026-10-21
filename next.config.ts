import type { NextConfig } from "next";
import { isIndexable, siteUrl } from "./src/lib/site";
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;
const supabaseOrigin = supabaseHost ? `https://${supabaseHost}` : "";
const isDev = process.env.NODE_ENV === "development";
// Next.js inlines its own bootstrap scripts and styles, so they need
// 'unsafe-inline' without per-request nonces, which would make every page
// dynamic. Nothing else may load scripts, and the page cannot be framed.
// Uploads and stored media come straight from Supabase. Sign-in posts to the
// server, which redirects to Supabase and then to Google.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' blob: data: ${supabaseOrigin}`,
  `media-src 'self' blob: ${supabaseOrigin}`,
  `connect-src 'self' ${supabaseOrigin}`,
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  `form-action 'self' ${supabaseOrigin} https://accounts.google.com`,
  "frame-ancestors 'none'",
  ...(siteUrl.startsWith("https://") ? ["upgrade-insecure-requests"] : []),
]
  .map((directive) => directive.replace(/\s+/g, " ").trim())
  .join("; ");
const config: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/site-media/**",
          },
        ]
      : [],
  },
  async redirects() {
    return [
      { source: "/foxriverrecreation", destination: "/", permanent: true },
      { source: "/parkamenities", destination: "/#amenities", permanent: true },
      { source: "/memories", destination: "/gallery", permanent: true },
      { source: "/7", destination: "/#visit", permanent: true },
      { source: "/4523867/:path*", destination: "/:path*", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
          },
          ...(!isIndexable
            ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
            : []),
        ],
      },
    ];
  },
};
export default config;
