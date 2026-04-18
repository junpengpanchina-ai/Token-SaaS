/**
 * Dashboard 演示壳用的"拟真"数据。
 *
 * 真实数据源接入后（Supabase profiles / orders + new-api），
 * 只需要把这里的函数替换成真实 fetch，不影响任何 UI 组件。
 */
import { siteConfig } from "@/data/site";

export type ProfileStatus = "pending_activation" | "active" | "suspended";

export type DemoProfile = {
  plan: "starter" | "pro" | "channel" | "none";
  status: ProfileStatus;
  credits: number;
  createdAt: string;
};

export type DemoApiKey = {
  id: string;
  label: string;
  masked: string;
  createdAt: string;
  lastUsedAt: string | null;
  status: "active" | "paused" | "revoked";
};

export type DemoTransaction = {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "paid" | "refunded" | "pending";
};

export const demoEndpoint = siteConfig.apiBaseUrl;

export const demoApiKeys: DemoApiKey[] = [
  {
    id: "key_demo_primary",
    label: "Production key",
    masked: "sk-****-**********-a8f2",
    createdAt: "2025-03-14",
    lastUsedAt: "2 minutes ago",
    status: "active",
  },
  {
    id: "key_demo_staging",
    label: "Staging key",
    masked: "sk-****-**********-c3de",
    createdAt: "2025-02-01",
    lastUsedAt: "yesterday",
    status: "paused",
  },
];

export const demoTransactions: DemoTransaction[] = [
  {
    id: "txn_demo_3",
    date: "2025-04-02",
    description: "Pro plan · monthly",
    amount: "$99.00",
    status: "paid",
  },
  {
    id: "txn_demo_2",
    date: "2025-03-02",
    description: "Pro plan · monthly",
    amount: "$99.00",
    status: "paid",
  },
  {
    id: "txn_demo_1",
    date: "2025-02-02",
    description: "Top-up",
    amount: "$50.00",
    status: "paid",
  },
];

/**
 * 默认返回 pending_activation —— 在真实 profiles 表未创建 / 该用户没有行时都安全。
 * 后续在 server 端把真实 profile fetch 出来覆盖。
 */
export function defaultProfile(): DemoProfile {
  return {
    plan: "none",
    status: "pending_activation",
    credits: 0,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Demo 模式（Supabase 未配）展示给销售看的"已开通"样貌。
 * 五大分区都是满的，方便客户看清楚产品形态。
 */
export function demoActiveProfile(): DemoProfile {
  return {
    plan: "pro",
    status: "active",
    credits: 48_210,
    createdAt: new Date().toISOString(),
  };
}
