import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
    transpilePackages: ["@arch/ui-kit"],
};

export default nextConfig;

initOpenNextCloudflareForDev();
