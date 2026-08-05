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

/**
 * localStorageの値はユーザーが自由に書き換えられるうえ、User型を変更した
 * 場合は古い形のデータが残る。JSON.parse が通っても中身がUserとは限らない
 * ため、必要なフィールドが揃っているかを確認してから採用する。
 */
function isValidUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) return false;
  const u = value as Record<string, unknown>;
  return (
    typeof u.id === "string" &&
    typeof u.name === "string" &&
    typeof u.email === "string" &&
    typeof u.avatarInitial === "string" &&
    (u.planId === null || u.planId === "basic" || u.planId === "premium")
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // SSR時点ではlocalStorageにアクセスできないため、意図的に
    // マウント後のeffectで読み込んでいる(ハイドレーション不一致を防ぐため)。
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;

      if (isValidUser(parsed)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(parsed);
      } else if (raw) {
        // 形が合わないデータを残すと毎回ここを通るので破棄する
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // JSONとして壊れている場合も同様に破棄する
      window.localStorage.removeItem(STORAGE_KEY);
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
