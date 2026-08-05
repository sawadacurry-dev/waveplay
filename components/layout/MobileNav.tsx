"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/constants/nav";
import { useAuth } from "@/lib/auth/AuthProvider";
import { cn } from "@/lib/utils";

/**
 * md未満ではデスクトップ用のナビが非表示になるため、代わりにこのメニューを出す。
 * これが無いとスマホからスケジュール・アーカイブ・大会情報に到達できない。
 */
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  // 開いている間は背面のスクロールを止める
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
        aria-expanded={isOpen}
        className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <>
          {/* ヘッダー(h-16)の下を覆う暗幕。タップで閉じる */}
          <button
            type="button"
            aria-label="メニューを閉じる"
            onClick={() => setIsOpen(false)}
            className="fixed inset-x-0 bottom-0 top-16 z-40 bg-black/60 backdrop-blur-sm"
          />

          <nav className="fixed inset-x-0 top-16 z-50 border-b border-white/10 bg-slate-950 px-4 pb-6 pt-4 shadow-xl shadow-black/40">
            <ul className="space-y-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setIsOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition",
                        isActive
                          ? "bg-sky-500/15 text-sky-300"
                          : "text-slate-300 hover:bg-white/5 hover:text-slate-100"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 border-t border-white/5 pt-4">
              <Link
                href={user ? "/account" : "/login"}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center rounded-lg bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                {user ? "マイアカウント" : "視聴登録・ログイン"}
              </Link>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
