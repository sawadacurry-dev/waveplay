"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaPlayer, PlayerState as IVSPlayerStateEnum } from "amazon-ivs-player";
import { createIVSPlayer, loadIVSPlayer } from "@/lib/ivs/client";
import type { IVSPlayerState } from "@/types/ivs";

interface UseIVSPlayerOptions {
  playbackUrl: string;
  autoplay?: boolean;
  muted?: boolean;
}

interface UseIVSPlayerResult {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  state: IVSPlayerState;
  isMuted: boolean;
  errorMessage: string | null;
  play: () => void;
  pause: () => void;
  toggleMute: () => void;
}

// AWS IVSのPlayerStateはSDK読み込み後にしか参照できないため、
// 内部的には文字列リテラルで自前のstateを管理する。
export function useIVSPlayer({
  playbackUrl,
  autoplay = true,
  muted = true,
}: UseIVSPlayerOptions): UseIVSPlayerResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<MediaPlayer | null>(null);

  const [state, setState] = useState<IVSPlayerState>("idle");
  const [isMuted, setIsMuted] = useState(muted);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      if (!videoRef.current) return;

      try {
        setState("loading");
        const IVS = await loadIVSPlayer();
        if (cancelled || !videoRef.current) return;

        const player = createIVSPlayer(IVS, videoRef.current);
        playerRef.current = player;

        player.setMuted(muted);

        const PlayerState = IVS.PlayerState as unknown as Record<
          string,
          IVSPlayerStateEnum
        >;

        player.addEventListener(PlayerState.READY, () => {
          if (cancelled) return;
          setState("ready");
          if (autoplay) player.play();
        });
        player.addEventListener(PlayerState.PLAYING, () => {
          if (!cancelled) setState("playing");
        });
        player.addEventListener(PlayerState.BUFFERING, () => {
          if (!cancelled) setState("buffering");
        });
        player.addEventListener(PlayerState.ENDED, () => {
          if (!cancelled) setState("ended");
        });
        player.addEventListener(IVS.PlayerEventType.ERROR, (err) => {
          if (cancelled) return;
          setState("error");
          setErrorMessage(
            typeof err === "object" && err && "message" in err
              ? String((err as { message: unknown }).message)
              : "配信の読み込みに失敗しました"
          );
        });

        player.load(playbackUrl);
      } catch (e) {
        if (!cancelled) {
          setState("error");
          setErrorMessage(
            e instanceof Error ? e.message : "プレイヤーの初期化に失敗しました"
          );
        }
      }
    }

    setup();

    return () => {
      cancelled = true;
      playerRef.current?.pause();
      playerRef.current?.delete();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playbackUrl]);

  const play = useCallback(() => {
    playerRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pause();
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      playerRef.current?.setMuted(next);
      return next;
    });
  }, []);

  return { videoRef, state, isMuted, errorMessage, play, pause, toggleMute };
}
