import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @adea/core is shipped as TypeScript source and compiled by the web app.
  transpilePackages: ["@adea/core"],
};

export default nextConfig;
