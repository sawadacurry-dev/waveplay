import type { SportCategory } from "@/types/match";

export const SPORT_BADGE_STYLES: Record<SportCategory, string> = {
  "beach-volleyball": "bg-sky-500/15 text-sky-400 ring-sky-500/30",
  "beach-tennis": "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  "beach-soccer": "bg-orange-500/15 text-orange-400 ring-orange-500/30",
  footvolley: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
  surfing: "bg-cyan-500/15 text-cyan-400 ring-cyan-500/30",
};

export const SPORT_FILTERS: { value: SportCategory | "all"; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "beach-volleyball", label: "ビーチバレーボール" },
  { value: "beach-tennis", label: "ビーチテニス" },
  { value: "beach-soccer", label: "ビーチサッカー" },
  { value: "footvolley", label: "フットバレー" },
  { value: "surfing", label: "サーフィン" },
];
