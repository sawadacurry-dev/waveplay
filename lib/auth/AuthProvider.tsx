"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PlanId, User } from "@/types/user";

/**
 * MVP用の疑似認証コンテキスト。
 *
 * 実際のバックエンドは繋がっていない。ログイン処理はメールアドレスを
 * 受け取ってブラウザのlocalStorageに保存するだけの「見た目だけ」の実装。
 *
 * Phase2で本物の認証(NextAuth.js / Amazon Cognito / Clerk等)に差し替える際は、
 * このファイルの実装だけを差し替えれば、UI側(login/account画面)は
 * ほぼ変更せずに移行できるように設計している。
 */

const STORAGE_KEY = "waveplay:mock-user";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => void;
  logout: () => void;
  subscribe: (planId: PlanId) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // SSR時点ではlocalStorageにアクセスできないため、意図的に
    // マウント後のeffectで読み込んでいる(ハイドレーション不一致を防ぐため)。
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // 壊れたデータは無視
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = useCallback((next: User | null) => {
    setUser(next);
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(
    (email: string) => {
      // 実際のパスワード検証は行わない(モック)。メールアドレスから
      // 表示名とアバターの頭文字を生成するだけ。
      const namePart = email.split("@")[0] || "ユーザー";
      persist({
        id: `mock-${namePart}`,
        name: namePart,
        email,
        avatarInitial: namePart.charAt(0).toUpperCase(),
        planId: null,
      });
    },
    [persist]
  );

  const logout = useCallback(() => persist(null), [persist]);

  const subscribe = useCallback(
    (planId: PlanId) => {
      if (!user) return;
      persist({ ...user, planId });
    },
    [user, persist]
  );

  const value = useMemo(
    () => ({ user, isLoading, login, logout, subscribe }),
    [user, isLoading, login, logout, subscribe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
