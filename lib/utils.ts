import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 視聴者数を "4,821人" のような表示用文字列にフォーマット
export function formatViewerCount(count: number): string {
  return new Intl.NumberFormat("ja-JP").format(count);
}
