"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Home,
  Search,
  User as UserIcon,
  Video,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { cn } from "@/lib/utils";

const TABS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/schedule", label: "番組表", icon: CalendarDays },
  { href: "/archive", label: "アーカイブ", icon: Video },
  { href: "/search", label: "検索", icon: Search },
];

/**
 * md未満で画面下部に固定するタブバー。
 * 配信サービスでは片手で届く下部にナビを置くのが一般的で、
 * ハンバーガーのように「開く」操作を挟まないぶん到達が速い。
 *
 * 固定要素なので、body側に下余白(pb-16)を入れて内容が隠れないようにしている。
 */
export function BottomTabBar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const tabs = [
    ...TABS,
    {
      href: user ? "/account" : "/login",
      label: user ? "マイページ" : "ログイン",
      icon: UserIcon,
    },
  ];

  return (
    <nav
      aria-label="メインナビゲーション"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/95 backdrop-blur md:hidden"
      // iPhoneのホームインジケータぶんの余白を確保する
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition",
                  isActive
                    ? "text-sky-400"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
