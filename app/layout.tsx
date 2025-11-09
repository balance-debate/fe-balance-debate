import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { MuiProvider } from "@/lib/providers/MuiProvider";
import { SnackbarProvider } from "@/lib/providers/SnackbarProvider";
import { AuthModalProvider } from "@/lib/providers/AuthModalProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "밸런스 토론",
  description: "당신의 선택과 의견을 마음껏 표현해보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <MuiProvider>
            <SnackbarProvider>
              <AuthModalProvider>{children}</AuthModalProvider>
            </SnackbarProvider>
          </MuiProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
