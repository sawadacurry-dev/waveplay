"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Loader2,
  Maximize,
  Minimize,
  Radio,
  RotateCw,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useIVSPlayer } from "@/hooks/useIVSPlayer";
import { cn } from "@/lib/utils";

interface IVSPlayerProps {
  playbackUrl: string;
  autoplay?: boolean;
  className?: string;
}

export function IVSPlayer({ playbackUrl, autoplay = true, className }: IVSPlayerProps) {
  const {
    videoRef,
    state,
    isMuted,
    errorMessage,
    qualities,
    currentQuality,
    toggleMute,
    selectQuality,
    retry,
  } = useIVSPlayer({ playbackUrl, autoplay, muted: true });

  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isQualityOpen, setIsQualityOpen] = useState(false);

  const isLoading = state === "loading" || state === "buffering";

  // 全画面はブラウザ側からも解除される(Escape等)ため、自前のstateではなく
  // fullscreenchangeイベントを正とする
  useEffect(() => {
    function handleChange() {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    }
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await containerRef.current.requestFullscreen();
      }
    } catch {
      // 全画面が許可されない環境(iOS Safari等)では何もしない
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative aspect-video w-full overflow-hidden rounded-xl bg-black",
        // 全画面時はaspect-videoだと余白が出るので画面全体に合わせる
        isFullscreen && "aspect-auto h-full rounded-none",
        className
      )}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        playsInline
        // autoplayはIVS Player側のplay()経由で制御するため、native属性は付けない
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
        </div>
      )}

      {state === "offline" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/90 px-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
            <Radio className="h-6 w-6 text-slate-500" />
          </span>
          <div>
            <p className="font-semibold text-slate-200">まだ配信が始まっていません</p>
            <p className="mt-1 text-sm text-slate-500">
              開始すると自動で再生されます
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <Loader2 className="h-3 w-3 animate-spin" />
            配信の開始を待っています
          </span>
        </div>
      )}

      {state === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/90 px-6 text-center">
          <AlertTriangle className="h-8 w-8 text-red-400" />
          <p className="text-sm text-slate-300">
            {errorMessage ?? "配信を読み込めませんでした"}
          </p>
          <button
            type="button"
            onClick={retry}
            className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            <RotateCw className="h-4 w-4" />
            再読み込み
          </button>
        </div>
      )}

      {/*
        操作パネル。ホバーだけで出すとタッチ端末・キーボード操作で到達できないため、
        フォーカス時と小さい画面では常に表示する。
      */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100 max-sm:opacity-100">
        {qualities.length > 0 && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsQualityOpen((v) => !v)}
              aria-label="画質を選択"
              aria-expanded={isQualityOpen}
              className="flex h-9 items-center gap-1.5 rounded-full bg-black/60 px-3 text-xs font-semibold text-white backdrop-blur transition hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-sky-400"
            >
              <Settings className="h-4 w-4" />
              {currentQuality ?? "自動"}
            </button>

            {isQualityOpen && (
              <ul className="absolute bottom-full right-0 mb-2 w-32 overflow-hidden rounded-lg border border-white/10 bg-slate-900 py-1 shadow-xl">
                <li>
                  <QualityOption
                    label="自動"
                    isActive={currentQuality === null}
                    onSelect={() => {
                      selectQuality(null);
                      setIsQualityOpen(false);
                    }}
                  />
                </li>
                {qualities.map((q) => (
                  <li key={q.name}>
                    <QualityOption
                      label={q.name}
                      isActive={currentQuality === q.name}
                      onSelect={() => {
                        selectQuality(q.name);
                        setIsQualityOpen(false);
                      }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "ミュート解除" : "ミュート"}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-sky-400"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "全画面を終了" : "全画面で表示"}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-sky-400"
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

function QualityOption({
  label,
  isActive,
  onSelect,
}: {
  label: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full px-3 py-2 text-left text-xs transition hover:bg-white/5",
        isActive ? "font-semibold text-sky-400" : "text-slate-300"
      )}
    >
      {label}
    </button>
  );
}
