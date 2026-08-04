"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Comment {
  id: string;
  author: string;
  body: string;
}

const SEED_COMMENTS: Comment[] = [
  { id: "c1", author: "ビーチバレー好き", body: "第2セットから流れが変わりましたね" },
  { id: "c2", author: "湘南在住", body: "現地の風が強そう、サーブ読みにくそう" },
  { id: "c3", author: "観戦初心者", body: "このスコアだとどっちが有利なんですか?" },
];

/**
 * MVPではコメントはこのブラウザタブの中だけで完結するローカル状態。
 * 他の視聴者とリアルタイムに共有するには、WebSocket(API Gateway
 * WebSocket API等)やPub/Subサービスを使ったバックエンドが別途必要。
 * この見た目のまま、送信処理だけを差し替えれば移行できるように
 * UIとロジックを分けている。
 */
export function LiveCommentPanel() {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(SEED_COMMENTS);
  const [draft, setDraft] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;

    setComments((prev) => [
      ...prev,
      { id: crypto.randomUUID(), author: user?.name ?? "ゲスト", body: draft.trim() },
    ]);
    setDraft("");
  }

  return (
    <Card className="flex h-full max-h-[560px] flex-col">
      <div className="border-b border-white/5 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-200">ライブコメント</h2>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {comments.map((c) => (
          <div key={c.id} className="text-sm">
            <span className="font-semibold text-sky-400">{c.author}</span>
            <span className="ml-2 text-slate-300">{c.body}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-white/5 p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={user ? "コメントを入力" : "コメントにはログインが必要です"}
          disabled={!user}
          className="flex-1 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus-visible:border-sky-500/50 disabled:opacity-50"
        />
        <Button type="submit" disabled={!user} aria-label="送信">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
