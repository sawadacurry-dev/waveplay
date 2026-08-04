import type { LucideIcon } from "lucide-react";
import { Radio, CalendarCheck, Trophy, Users } from "lucide-react";
import type { HomeStats } from "@/types/match";
import { Card } from "@/components/ui/Card";
import { formatViewerCount } from "@/lib/utils";

interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
  color: string;
}

export function StatsBar({ stats }: { stats: HomeStats }) {
  const items: StatItem[] = [
    {
      icon: Radio,
      value: String(stats.liveCount),
      label: "ライブ配信中",
      color: "text-sky-400",
    },
    {
      icon: CalendarCheck,
      value: String(stats.todayMatchCount),
      label: "本日の試合数",
      color: "text-emerald-400",
    },
    {
      icon: Trophy,
      value: String(stats.registeredSportsCount),
      label: "登録スポーツ",
      color: "text-amber-400",
    },
    {
      icon: Users,
      value: formatViewerCount(stats.totalViewers),
      label: "視聴者総数",
      color: "text-violet-400",
    },
  ];

  return (
    <Card className="mx-auto grid max-w-6xl grid-cols-2 divide-white/5 sm:grid-cols-4 sm:divide-x">
      {items.map(({ icon: Icon, value, label, color }) => (
        <div key={label} className="flex items-center gap-3 px-6 py-5">
          <Icon className={color} />
          <div>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        </div>
      ))}
    </Card>
  );
}
