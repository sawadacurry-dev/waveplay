"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Waves } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Button } from "@/components/ui/Button";

/**
 * ?redirect= は外部サイトへの誘導(オープンリダイレクト)に悪用できるため、
 * 同一サイト内の絶対パスだけを許可する。
 * "//evil.com" はブラウザからはプロトコル相対URLとして外部扱いになるので弾く。
 */
function safeRedirect(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get("redirect"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください");
      return;
    }

    // MVPでは実際の認証は行わず、入力内容からログイン状態を作るだけ。
    // Phase2でAPI呼び出しに置き換える。
    login(email);
    router.push(redirectTo);
  }

  return (
    <div className="w-full max-w-sm">
      <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-bold text-slate-100">
        <Waves className="h-6 w-6 text-sky-400" />
        WAVEPLAY
      </Link>

      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8">
        <h1 className="mb-1 text-xl font-bold text-slate-100">ログイン</h1>
        <p className="mb-6 text-sm text-slate-500">
          アカウントにログインして、ライブ配信を視聴しましょう
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-400">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus-visible:border-sky-500/50"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-medium text-slate-400"
            >
              パスワード
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus-visible:border-sky-500/50"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <Button type="submit" className="w-full justify-center">
            ログイン
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          アカウントをお持ちでない方は{" "}
          <Link href="/pricing" className="text-sky-400 hover:underline">
            プランを見る
          </Link>
        </p>
      </div>

      <p className="mt-4 text-center text-xs text-slate-600">
        ※現在は開発中のデモです。実際のメール認証は行われません。
      </p>
    </div>
  );
}
