"use client";

import { Loader2, Volume2, VolumeX, AlertTriangle } from "lucide-react";
import { useIVSPlayer } from "@/hooks/useIVSPlayer";
import { cn } from "@/lib/utils";

interface IVSPlayerProps {
  playbackUrl: string;
  autoplay?: boolean;
  className?: string;
}

export function IVSPlayer({ playbackUrl, autoplay = true, className }: IVSPlayerProps) {
  const { videoRef, state, isMuted, errorMessage, toggleMute } = useIVSPlayer({
    playbackUrl,
    autoplay,
    muted: true,
  });

  const isLoading = state === "loading" || state === "buffering";

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-xl bg-black",
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

      {state === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 px-4 text-center">
          <AlertTriangle className="h-8 w-8 text-red-400" />
          <p className="text-sm text-slate-300">
            {errorMessage ?? "配信を読み込めませんでした"}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={toggleMute}
        aria-label={isMuted ? "ミュート解除" : "ミュート"}
        className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-sky-400"
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
