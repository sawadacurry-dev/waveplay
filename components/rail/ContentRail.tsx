"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentRailProps {
  title: string;
  moreHref?: string;
  children: ReactNode;
}

/**
 * 横スクロールする「レール」。配信サービスで一般的な、カテゴリごとに
 * タイルを横一列に並べる見せ方。
 *
 * - タッチ端末はそのままスワイプ
 * - デスクトップは端の矢印で1画面分ずつ送る
 * - キーボードはスクロールコンテナ自体をフォーカス可能にして矢印キーで操作
 *   (矢印ボタンだけだとタブ移動でタイルを totalScroll 分たどる必要があり不便)
 */
export function ContentRail({ title, moreHref, children }: ContentRailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    // 端の判定は小数誤差が出るため1pxの余裕を持たせる
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateArrows();

    // タイル数やウィンドウ幅が変わると端の判定も変わる
    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);

    return () => observer.disconnect();
  }, [updateArrows]);

  const scrollByPage = useCallback((direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    // 端のタイルが半端に切れないよう、1画面より少し少なく送る
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  }, []);

  return (
    <section className="group/rail relative py-5">
      <div className="mb-3 flex items-end justify-between gap-3 px-4 sm:px-6 lg:px-10">
        <h2 className="text-base font-bold text-slate-100 sm:text-lg">{title}</h2>
        {moreHref && (
          <Link
            href={moreHref}
            className="shrink-0 rounded text-xs text-slate-400 transition hover:text-sky-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            すべて見る &rsaquo;
          </Link>
        )}
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          onScroll={updateArrows}
          tabIndex={0}
          role="group"
          aria-label={title}
          className={cn(
            "flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-2 sm:px-6 lg:px-10",
            // スクロールバーは矢印とスワイプがあるので隠す
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky-400"
          )}
        >
          {children}
        </div>

        {canScrollLeft && (
          <RailArrow direction="left" onClick={() => scrollByPage(-1)} />
        )}
        {canScrollRight && (
          <RailArrow direction="right" onClick={() => scrollByPage(1)} />
        )}
      </div>
    </section>
  );
}

function RailArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const isLeft = direction === "left";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isLeft ? "前へスクロール" : "次へスクロール"}
      className={cn(
        "absolute top-0 z-10 hidden h-full w-10 items-center justify-center bg-gradient-to-r from-slate-950 to-transparent text-slate-100 transition",
        // 見えていない間はクリックも奪わないようにする。
        // pointer-events-none にしないと、透明な矢印が端のタイルの上に乗り、
        // タイルを押したつもりがスクロールしてしまう。
        "pointer-events-none opacity-0",
        "group-hover/rail:pointer-events-auto group-hover/rail:opacity-100",
        // キーボード操作では pointer-events に関わらずEnterで押せる
        "focus-visible:opacity-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky-400",
        // タッチ端末では矢印を出さず、スワイプに任せる
        "lg:flex",
        isLeft ? "left-0" : "right-0 bg-gradient-to-l"
      )}
    >
      {isLeft ? (
        <ChevronLeft className="h-6 w-6" />
      ) : (
        <ChevronRight className="h-6 w-6" />
      )}
    </button>
  );
}

/** レール内の1タイル分の幅を決めるラッパー */
export function RailItem({ children }: { children: ReactNode }) {
  return (
    <div className="w-[190px] shrink-0 snap-start sm:w-[240px] lg:w-[280px]">
      {children}
    </div>
  );
}
