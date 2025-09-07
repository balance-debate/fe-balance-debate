import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
// GitHub Pages 프로젝트 사이트(repo) 이름
const repo = "fe-balance-debate";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // 프로젝트 사이트(username.github.io/repo)로 배포하는 경우에만 적용
  basePath: isProd ? `/${repo}` : undefined,
  assetPrefix: isProd ? `/${repo}/` : undefined,
};

export default nextConfig;
