import {
  Archive,
  CalendarDays,
  Radio,
  Trophy,
  type LucideIcon,
} from "lucide-react";

/**
 * ヘッダーのナビゲーション項目。
 * デスクトップ用(Header)とモバイル用(MobileNav)の両方から参照するため、
 * コンポーネント間で受け渡さずにここから直接importする。
 * (アイコンは関数なのでサーバー→クライアントのpropsとして渡せない)
 */
export const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "ライブ中継", icon: Radio },
  { href: "/schedule", label: "スケジュール", icon: CalendarDays },
  { href: "/archive", label: "アーカイブ", icon: Archive },
  { href: "/tournaments", label: "大会情報", icon: Trophy },
];
