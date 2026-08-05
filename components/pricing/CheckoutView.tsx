"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";
import { PLANS, type PlanId } from "@/types/user";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function CheckoutView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, subscribe } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 処理中に別ページへ移動された場合、あとから router.push が走って
  // 意図しない画面遷移が起きるのを防ぐ
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const planId = searchParams.get("plan") as PlanId | null;
  const plan = PLANS.find((p) => p.id === planId);

  if (!user) {
    return (
      <Card className="p-6 text-center text-sm text-slate-400">
        ログインが必要です。
        <Link href="/login" className="ml-1 text-sky-400 hover:underline">
          ログインする
        </Link>
      </Card>
    );
  }

  if (!plan) {
    return (
      <Card className="p-6 text-center text-sm text-slate-400">
        プランが選択されていません。
        <Link href="/pricing" className="ml-1 text-sky-400 hover:underline">
          プラン一覧へ
        </Link>
      </Card>
    );
  }

  function handleConfirm() {
    setIsProcessing(true);

    // ------------------------------------------------------------------
    // 【実装ポイント】本番実装ではここでカード番号等を直接扱わない。
    // 代表的な実装パターン:
    //   1. サーバー側(Route Handler)で Stripe Checkout Session を作成
    //   2. stripe.redirectToCheckout() でStripeがホストする決済画面へ遷移
    //   3. 決済完了後、StripeのWebhookでサブスクリプション状態をDBに反映
    // カード番号の入力欄をこのアプリ側で持たないことで、PCI DSS対応の
    // 範囲を最小化できる。
    // ------------------------------------------------------------------
    timerRef.current = setTimeout(() => {
      if (plan) subscribe(plan.id);
      router.push("/account");
    }, 800);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">お支払い内容の確認</h1>
        <p className="text-sm text-slate-500">最終確認後、決済画面に進みます</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <p className="font-semibold text-slate-100">{plan.name}</p>
            <p className="text-xs text-slate-500">{plan.description}</p>
          </div>
          <p className="font-bold text-slate-100">
            ¥{plan.priceMonthly.toLocaleString()}
            <span className="text-xs font-normal text-slate-500"> / 月</span>
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 text-sm">
          <span className="text-slate-400">本日のお支払い</span>
          <span className="font-bold text-slate-100">
            ¥{plan.priceMonthly.toLocaleString()}
          </span>
        </div>
      </Card>

      <Card className="flex items-start gap-3 p-4 text-xs text-slate-500">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
        お支払い情報は決済代行サービス(Stripe等)が安全に処理します。カード番号が
        WAVEPLAYのサーバーに保存されることはありません。
      </Card>

      <Button
        onClick={handleConfirm}
        disabled={isProcessing}
        icon={<Lock className="h-4 w-4" />}
        className="w-full justify-center"
      >
        {isProcessing ? "処理中..." : "決済画面へ進む"}
      </Button>

      <p className="text-center text-xs text-slate-500">
        ※現在は開発中のデモです。実際の決済は発生しません。
      </p>
    </div>
  );
}
