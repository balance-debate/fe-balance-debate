import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
// GitHub Pages 프로젝트 사이트(repo) 이름
const repo = "fe-balance-debate";
// 커스텀 도메인을 사용할 경우 basePath/assetPrefix를 비활성화합니다.
// NEXT_PUBLIC_USE_GHP_BASEPATH=true 로 설정하면 기존처럼 "/<repo>" 경로를 사용합니다.
const useGhProjectBase = process.env.NEXT_PUBLIC_USE_GHP_BASEPATH === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // 프로젝트 사이트(username.github.io/repo)로 배포하는 경우에만 적용
  basePath: isProd && useGhProjectBase ? `/${repo}` : undefined,
  assetPrefix: isProd && useGhProjectBase ? `/${repo}/` : undefined,
};

export default nextConfig;
