import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 視聴者数を "4,821人" のような表示用文字列にフォーマット
export function formatViewerCount(count: number): string {
  return new Intl.NumberFormat("ja-JP").format(count);
}

/**
 * 日時の表示はすべて日本時間に固定する。
 *
 * timeZone を指定しないと実行環境のタイムゾーンで描画されるため、UTCで動く
 * サーバー(Vercel等)にデプロイした瞬間に9時間ずれる。ローカル開発機は
 * たいてい日本時間なので、開発中は気づけない。
 */
const DISPLAY_TIME_ZONE = "Asia/Tokyo";

// 開始時刻を "10:00" 形式にフォーマット
export function formatTimeJST(iso: string): string {
  return new Date(iso).toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: DISPLAY_TIME_ZONE,
  });
}

// 日付をフォーマット。既定は "2024/07/10" 形式
export function formatDateJST(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }
): string {
  return new Date(date).toLocaleDateString("ja-JP", {
    ...options,
    timeZone: DISPLAY_TIME_ZONE,
  });
}
