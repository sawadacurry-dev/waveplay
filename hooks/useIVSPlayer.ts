"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaPlayer, PlayerState as IVSPlayerStateEnum } from "amazon-ivs-player";
import { createIVSPlayer, loadIVSPlayer } from "@/lib/ivs/client";
import type { IVSPlayerQuality, IVSPlayerState } from "@/types/ivs";

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
  qualities: IVSPlayerQuality[];
  currentQuality: string | null;
  play: () => void;
  pause: () => void;
  toggleMute: () => void;
  selectQuality: (name: string | null) => void;
  retry: () => void;
}

// 配信開始を待つ間の再読み込み間隔。短くしてもIVSへのリクエストが増えるだけ。
const OFFLINE_RETRY_MS = 10_000;

// IVSはチャンネルがオフライン(配信ソフトが繋がっていない)のとき404を返す。
// 設定ミス等の本当のエラーと区別するために使う。
const NOT_BROADCASTING_CODE = 404;

// AWS IVSのPlayerStateはSDK読み込み後にしか参照できないため、
// 内部的には文字列リテラルで自前のstateを管理する。
export function useIVSPlayer({
  playbackUrl,
  autoplay = true,
  muted = true,
}: UseIVSPlayerOptions): UseIVSPlayerResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<MediaPlayer | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [state, setState] = useState<IVSPlayerState>("idle");
  const [isMuted, setIsMuted] = useState(muted);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [qualities, setQualities] = useState<IVSPlayerQuality[]>([]);
  const [currentQuality, setCurrentQuality] = useState<string | null>(null);
  // retry() から初期化をやり直させるためのカウンタ
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    function clearRetryTimer() {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    }

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
          setErrorMessage(null);
          // 画質一覧は再生準備が整ってからでないと取得できない
          setQualities(player.getQualities() as IVSPlayerQuality[]);
          if (autoplay) player.play();
        });
        player.addEventListener(PlayerState.PLAYING, () => {
          if (!cancelled) setState("playing");
        });
        player.addEventListener(PlayerState.BUFFERING, () => {
          if (!cancelled) setState("buffering");
        });
        player.addEventListener(PlayerState.ENDED, () => {
          // 配信終了後もチャンネルは残るため、再開を待てるようofflineに倒す
          if (!cancelled) setState("offline");
        });

        player.addEventListener(IVS.PlayerEventType.ERROR, (err) => {
          if (cancelled) return;

          const detail = (err ?? {}) as { code?: unknown; message?: unknown };

          if (Number(detail.code) === NOT_BROADCASTING_CODE) {
            // まだ配信が始まっていないだけ。一定間隔で読み直して待つ。
            setState("offline");
            setErrorMessage(null);
            clearRetryTimer();
            retryTimerRef.current = setTimeout(() => {
              if (!cancelled) player.load(playbackUrl);
            }, OFFLINE_RETRY_MS);
            return;
          }

          setState("error");
          setErrorMessage(
            typeof detail.message === "string"
              ? detail.message
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
      clearRetryTimer();
      playerRef.current?.pause();
      playerRef.current?.delete();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playbackUrl, reloadCount]);

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

  // name が null のときは自動(ABR)に戻す
  const selectQuality = useCallback((name: string | null) => {
    const player = playerRef.current;
    if (!player) return;

    if (name === null) {
      player.setAutoQualityMode(true);
      setCurrentQuality(null);
      return;
    }

    const quality = player.getQualities().find((q) => q.name === name);
    if (!quality) return;

    player.setAutoQualityMode(false);
    player.setQuality(quality);
    setCurrentQuality(name);
  }, []);

  // 「再読み込み」用。effectを最初から走らせ直す。
  const retry = useCallback(() => setReloadCount((c) => c + 1), []);

  return {
    videoRef,
    state,
    isMuted,
    errorMessage,
    qualities,
    currentQuality,
    play,
    pause,
    toggleMute,
    selectQuality,
    retry,
  };
}
