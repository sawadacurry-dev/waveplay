import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { BottomTabBar } from "@/components/layout/BottomTabBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  // 英数字・スコア表示はInterで統一感を出す
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "WAVEPLAY | ビーチスポーツライブ配信",
  description:
    "ビーチバレー、ビーチテニスなどビーチスポーツのライブ配信・スケジュール・アーカイブをまとめて視聴できるプラットフォーム。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${inter.variable} ${notoSansJP.variable} h-full antialiased`}
    >
      {/*
        固定のボトムタブバー(md未満のみ表示)に内容が隠れないための余白。
        タブバー自身がセーフエリア(iPhoneのホームインジケータ)ぶん高くなるので、
        こちらも同じ量を足しておかないと、その端末だけ下端が隠れる。
      */}
      <body className="flex min-h-full flex-col bg-background pb-[calc(4rem+env(safe-area-inset-bottom))] text-foreground md:pb-0">
        <AuthProvider>
          {children}
          <BottomTabBar />
        </AuthProvider>
      </body>
    </html>
  );
}
