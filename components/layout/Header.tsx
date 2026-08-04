import Link from "next/link";
import { Bell, CalendarDays, Radio, Search, Trophy, Waves, Archive } from "lucide-react";
import { Button } from "@/components/ui/Button";

const NAV_ITEMS = [
  { href: "/", label: "ライブ中継", icon: Radio },
  { href: "/schedule", label: "スケジュール", icon: CalendarDays },
  { href: "/archive", label: "アーカイブ", icon: Archive },
  { href: "/tournaments", label: "大会情報", icon: Trophy },
];

export function Header({ liveCount }: { liveCount: number }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
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

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-400 ring-1 ring-inset ring-red-500/30 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            {liveCount}件 配信中
          </span>
          <button
            aria-label="検索"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            aria-label="通知"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
          >
            <Bell className="h-4 w-4" />
          </button>
          <Button className="hidden sm:inline-flex">視聴登録</Button>
        </div>
      </div>
    </header>
  );
}
