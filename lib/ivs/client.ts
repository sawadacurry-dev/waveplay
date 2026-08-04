import type { MediaPlayer } from "amazon-ivs-player";

/**
 * amazon-ivs-player はブラウザ環境(WebAssembly/Worker)に依存するため、
 * サーバーサイドでは絶対にimportしない。呼び出し側は必ずuseEffect等の
 * クライアントサイドから呼ぶこと。
 */
export async function loadIVSPlayer(): Promise<typeof import("amazon-ivs-player")> {
  if (typeof window === "undefined") {
    throw new Error("IVS Player はブラウザ環境でのみ読み込めます");
  }
  return import("amazon-ivs-player");
}

export function createIVSPlayer(
  IVS: typeof import("amazon-ivs-player"),
  videoElement: HTMLVideoElement
): MediaPlayer {
  if (!IVS.isPlayerSupported) {
    throw new Error("この環境ではIVS Playerがサポートされていません");
  }

  const player = IVS.create({
    // ワーカー/wasmアセットはnpmパッケージ同梱のものをそのまま使う
    wasmWorker: "/ivs-player/amazon-ivs-wasmworker.min.js",
    wasmBinary: "/ivs-player/amazon-ivs-wasmworker.min.wasm",
  });

  player.attachHTMLVideoElement(videoElement);

  return player;
}
