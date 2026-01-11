"use client";

declare global {
  interface Window {
    Kakao?: any;
  }
}

function loadKakaoSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.Kakao) return resolve();
    const id = "kakao-sdk";
    if (document.getElementById(id)) return resolve();
    const script = document.createElement("script");
    script.id = id;
    script.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Kakao SDK 로드 실패"));
    document.head.appendChild(script);
  });
}

export async function ensureKakaoInitialized(appKey: string): Promise<any> {
  await loadKakaoSdk();
  const kakao = window.Kakao;
  if (!kakao) throw new Error("Kakao SDK가 로드되지 않았습니다.");
  if (!kakao.isInitialized?.()) {
    kakao.init(appKey);
  }
  return kakao;
}

