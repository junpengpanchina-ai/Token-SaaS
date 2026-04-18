import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import StatusBanner from "@/components/dashboard/StatusBanner";
import EndpointCard from "@/components/dashboard/EndpointCard";
import ApiKeysCard from "@/components/dashboard/ApiKeysCard";
import BillingCard from "@/components/dashboard/BillingCard";
import PlaygroundCard from "@/components/dashboard/PlaygroundCard";
import { getSession } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  defaultProfile,
  demoActiveProfile,
  demoApiKeys,
  demoEndpoint,
  demoTransactions,
  type DemoProfile,
  type ProfileStatus,
} from "@/lib/dashboard/demo";

export const metadata: Metadata = {
  title: "Dashboard",
};

const VALID_STATUS: ProfileStatus[] = [
  "pending_activation",
  "active",
  "suspended",
];

/**
 * Dashboard 首页 —— 销售演示版，永不崩。
 *
 * 三种模式：
 *   - authed: 真实用户 → 读 profiles 表；表没建或没行则 fallback 到 pending
 *   - anon:   Supabase 正常但未登录 → redirect 到 /login
 *   - demo:   Supabase 未配 / 调用失败 → 展示 active 演示数据（不 redirect，销售可看）
 */
export default async function DashboardPage() {
  const { user, mode } = await getSession();

  // 只有当 Supabase 正常 + 确实未登录，才把用户引导去登录
  if (mode === "anon") redirect("/login?next=/dashboard");

  const name =
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    user?.email ||
    (mode === "demo" ? "Demo User" : "there");

  const profile =
    mode === "demo"
      ? demoActiveProfile()
      : user
      ? await loadProfile(user.id)
      : defaultProfile();

  const isActive = profile.status === "active";
  const userIdDisplay = user?.id?.slice(0, 8) ?? "demo-user";
  const emailDisplay = user?.email ?? "demo@preview.local";

  return (
    <main className="py-12 md:py-16">
      <Container width="wide">
        <StatusBanner name={name} profile={profile} />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <EndpointCard endpoint={demoEndpoint} />
          <BillingCard profile={profile} transactions={demoTransactions} />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <ApiKeysCard
            initialKeys={isActive ? demoApiKeys : []}
            readOnly={!isActive}
          />
          <PlaygroundCard disabled={!isActive} />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-[12px] text-ink-tertiary">
          <div>
            User ID <code className="font-mono">{userIdDisplay}…</code>
            <span className="mx-2">·</span>
            {emailDisplay}
          </div>
          {mode === "authed" ? (
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-full border border-ink-divider/70 px-3 py-1 text-[12px] font-medium text-ink-secondary transition-colors hover:bg-ink-faint hover:text-ink"
              >
                Sign out
              </button>
            </form>
          ) : null}
        </div>
      </Container>
    </main>
  );
}

/**
 * 读 profiles.status —— 表不存在、行不存在、RLS 拒绝都 fallback 到 pending。
 */
async function loadProfile(userId: string): Promise<DemoProfile> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("plan, status, credits, created_at")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) return defaultProfile();

    const rawStatus = (data.status ?? "pending_activation") as ProfileStatus;
    const status = VALID_STATUS.includes(rawStatus)
      ? rawStatus
      : "pending_activation";
    const rawPlan = (data.plan ?? "none") as string;
    const plan = (["starter", "pro", "channel"].includes(rawPlan)
      ? rawPlan
      : "none") as DemoProfile["plan"];

    return {
      plan,
      status,
      credits: typeof data.credits === "number" ? data.credits : 0,
      createdAt: data.created_at ?? new Date().toISOString(),
    };
  } catch {
    return defaultProfile();
  }
}
