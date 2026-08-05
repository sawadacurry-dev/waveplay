import Link from "next/link";
import { Search, Waves } from "lucide-react";
import { HeaderAuthArea } from "@/components/layout/HeaderAuthArea";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { NAV_ITEMS } from "@/constants/nav";
import { getNotifications } from "@/lib/api/notifications";

// 通知は全ページ共通で必要になるため、各ページに取得を書かせず
// ヘッダー自身がサーバーコンポーネントとして取りに行く。
export async function Header({ liveCount }: { liveCount: number }) {
  const notifications = await getNotifications();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur">
      {/* レール(px-4 / sm:px-6 / lg:px-10)と左右の基準線を揃える */}
      <div className="flex h-16 items-center justify-between gap-2 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-100">
          <Waves className="h-5 w-5 text-sky-400" />
          WAVEPLAY
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-slate-100"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <span className="hidden items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-400 ring-1 ring-inset ring-red-500/30 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            {liveCount}件 配信中
          </span>
          <Link
            href="/search"
            aria-label="検索"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            <Search className="h-4 w-4" />
          </Link>
          <NotificationBell notifications={notifications} />
          <HeaderAuthArea />
        </div>
      </div>
    </header>
  );
}
