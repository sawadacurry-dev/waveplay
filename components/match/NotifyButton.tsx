"use client";

import { useState } from "react";
import { Bell, BellRing } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * 試合開始の通知登録ボタン。
 *
 * MVPでは押した状態をこのコンポーネントのローカル状態で保持するだけで、
 * リロードすると戻る。Phase2で「フォロー」APIに繋ぐ際は、この useState を
 * サーバーへのPOSTに差し替えれば見た目は変えずに移行できる。
 */
export function NotifyButton({ matchLabel }: { matchLabel: string }) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <Button
      variant="secondary"
      onClick={() => setIsSubscribed((v) => !v)}
      aria-pressed={isSubscribed}
      aria-label={
        isSubscribed
          ? `${matchLabel} の開始通知を解除`
          : `${matchLabel} の開始通知を受け取る`
      }
      icon={
        isSubscribed ? (
          <BellRing className="h-4 w-4 text-sky-400" />
        ) : (
          <Bell className="h-4 w-4" />
        )
      }
    >
      {isSubscribed ? "設定済み" : "通知"}
    </Button>
  );
}
