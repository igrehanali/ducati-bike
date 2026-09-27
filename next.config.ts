import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    // Source images are WebP; browsers that support it get AVIF (smaller), others WebP.
    formats: ["image/avif", "image/webp"],
    // Responsive widths used by the layouts (phones → 1440px desktops, 2x DPR).
    deviceSizes: [375, 640, 828, 1080, 1280, 1440, 1920],
    imageSizes: [32, 64, 96, 128, 256, 384],
    qualities: [60],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ]
  },
}

export default nextConfig
