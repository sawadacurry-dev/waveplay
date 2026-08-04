"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CalendarClock, Radio, Video, type LucideIcon } from "lucide-react";
import type { AppNotification, NotificationKind } from "@/types/notification";
import { cn } from "@/lib/utils";

const KIND_STYLES: Record<NotificationKind, { icon: LucideIcon; color: string }> = {
  "live-start": { icon: Radio, color: "text-red-400" },
  upcoming: { icon: CalendarClock, color: "text-sky-400" },
  archive: { icon: Video, color: "text-violet-400" },
};

/**
 * 既読状態はこのコンポーネントのローカル状態のみで、リロードすると戻る。
 * Phase2で通知APIを繋ぐ際は、この useState をサーバーへの既読POSTに
 * 差し替えれば見た目は変えずに移行できる。
 */
export function NotificationBell({
  notifications,
}: {
  notifications: AppNotification[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(
    (n) => !readIds.includes(n.id)
  ).length;

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={
          unreadCount > 0 ? `通知 (未読${unreadCount}件)` : "通知"
        }
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          "relative rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400",
          isOpen && "bg-white/5 text-slate-100"
        )}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-sky-400 ring-2 ring-slate-950" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-xl shadow-black/40">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-200">通知</h2>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => setReadIds(notifications.map((n) => n.id))}
                className="rounded text-xs text-sky-400 transition hover:text-sky-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                すべて既読にする
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-slate-500">
              新しい通知はありません
            </p>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {notifications.map((n) => {
                const { icon: Icon, color } = KIND_STYLES[n.kind];
                const isUnread = !readIds.includes(n.id);

                return (
                  <li key={n.id} className="border-b border-white/5 last:border-0">
                    <Link
                      href={n.href}
                      onClick={() => {
                        setReadIds((prev) =>
                          prev.includes(n.id) ? prev : [...prev, n.id]
                        );
                        setIsOpen(false);
                      }}
                      className={cn(
                        "flex gap-3 px-4 py-3 transition hover:bg-white/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky-400",
                        isUnread && "bg-sky-500/5"
                      )}
                    >
                      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", color)} />
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-100">
                          {n.title}
                          {isUnread && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                          )}
                        </p>
                        <p className="line-clamp-2 text-xs text-slate-400">{n.body}</p>
                        <p className="mt-1 text-xs text-slate-600">{n.timeLabel}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <p className="border-t border-white/5 px-4 py-2.5 text-center text-xs text-slate-600">
            ※ 通知はデモ用のサンプルです
          </p>
        </div>
      )}
    </div>
  );
}
