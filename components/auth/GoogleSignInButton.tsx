"use client";

import { useState } from "react";
import { signInWithGoogle } from "@/services/auth.service";

type Props = {
  next?: string;
  label?: string;
};

/**
 * Google 登录按钮 —— 白底 + 彩色 G logo，Apple/Stripe 风格。
 * 只负责触发 OAuth，loading / 错误 UI 也在这里内聚。
 */
export default function GoogleSignInButton({
  next = "/dashboard",
  label = "Continue with Google",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle(next);
      // 成功的话浏览器会被重定向到 Google，不会走到这里
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="flex h-11 w-full items-center justify-center gap-3 rounded-full border border-neutral-300 bg-white text-[14px] font-medium text-ink transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <GoogleGlyph />
        <span>{loading ? "Redirecting…" : label}</span>
      </button>
      {error && (
        <p className="mt-3 text-center text-[13px] text-red-600">{error}</p>
      )}
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2045c0-.6382-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2582h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.6151z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2582c-.806.54-1.8368.8609-3.0477.8609-2.3441 0-4.3287-1.5832-5.0368-3.7104H.9573v2.3318C2.4382 15.9831 5.4818 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.9632 10.71c-.18-.54-.2823-1.1168-.2823-1.71s.1023-1.17.2823-1.71V4.9582H.9573C.3477 6.1727 0 7.5477 0 9s.3477 2.8273.9573 4.0418L3.9632 10.71z"
      />
      <path
        fill="#EA4335"
        d="M9 3.5795c1.3214 0 2.5077.4545 3.4405 1.3459l2.5814-2.5814C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.9632 7.29C4.6713 5.1627 6.6559 3.5795 9 3.5795z"
      />
    </svg>
  );
}
