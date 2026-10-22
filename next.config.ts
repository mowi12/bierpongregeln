import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Lets phones and other devices in the local network use the dev server (e.g. for testing the
    // mobile layout). Next.js blocks dev resources for other hosts than localhost by default.
    allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
};

export default nextConfig;
