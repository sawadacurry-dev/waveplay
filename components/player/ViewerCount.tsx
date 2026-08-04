import { Users } from "lucide-react";
import { formatViewerCount } from "@/lib/utils";

export function ViewerCount({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-slate-300">
      <Users className="h-4 w-4" />
      <span>{formatViewerCount(count)}人が視聴中</span>
    </div>
  );
}
