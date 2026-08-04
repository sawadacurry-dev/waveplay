export interface User {
  id: string;
  name: string;
  email: string;
  avatarInitial: string; // アバター画像の代わりに頭文字を表示(MVP)
  planId: PlanId | null; // null = 無料/未契約
}

export type PlanId = "basic" | "premium";

export interface Plan {
  id: PlanId;
  name: string;
  priceMonthly: number; // 円
  description: string;
  features: string[];
  highlighted?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "basic",
    name: "ベーシック",
    priceMonthly: 980,
    description: "まずはライブ配信を楽しみたい方に",
    features: [
      "全スポーツのライブ配信が見放題",
      "標準画質(720p)での視聴",
      "1アカウントにつき1同時視聴",
    ],
  },
  {
    id: "premium",
    name: "プレミアム",
    priceMonthly: 1980,
    description: "アーカイブ・複数デバイスも含めて楽しみたい方に",
    features: [
      "ベーシックの全機能",
      "高画質(1080p)での視聴",
      "アーカイブ見放題・ダウンロード視聴",
      "同時に2台まで視聴可能",
      "広告非表示",
    ],
    highlighted: true,
  },
];
