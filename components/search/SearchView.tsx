"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import type { Match } from "@/types/match";
import { searchAll } from "@/lib/api/matches";
import { ScheduleRow } from "@/components/match/ScheduleRow";
import { ArchiveCard } from "@/components/archive/ArchiveCard";

export function SearchView({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Match[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handle = setTimeout(() => {
      startTransition(async () => {
        const r = await searchAll(query);
        setResults(r);
      });
      // URLにも反映して共有可能にする
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      router.replace(`/search${params.toString() ? `?${params}` : ""}`, {
        scroll: false,
      });
    }, 250); // 入力のたびに検索しすぎないようデバウンス

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const liveOrScheduled = results.filter((r) => r.status !== "archived");
  const archived = results.filter((r) => r.status === "archived");

  return (
    <div>
      <div className="relative mb-8">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="大会名・選手名・会場名で検索"
          className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-4 pl-12 pr-4 text-base text-slate-100 outline-none placeholder:text-slate-500 focus-visible:border-sky-500/50"
        />
      </div>

      {!query && (
        <p className="text-sm text-slate-500">
          キーワードを入力すると、試合・大会・アーカイブを横断して検索します。
        </p>
      )}

      {query && !isPending && results.length === 0 && (
        <p className="text-sm text-slate-500">
          「{query}」に一致する結果は見つかりませんでした。
        </p>
      )}

      {liveOrScheduled.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-slate-400">
            試合・スケジュール
          </h2>
          <div className="rounded-xl border border-white/10 bg-slate-900/40 px-4">
            {liveOrScheduled.map((m) => (
              <ScheduleRow key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {archived.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-400">アーカイブ</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archived.map((m) => (
              <ArchiveCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
