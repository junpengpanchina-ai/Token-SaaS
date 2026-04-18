import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { demoApiKeys, type DemoApiKey } from "@/lib/dashboard/demo";

/**
 * STUB: API keys endpoint.
 *
 * 后续接入：
 *   - 真实数据源：`new-api` / DMIT 网关 + Supabase `api_keys` 表
 *   - 权限：require auth + `profiles.status === 'active'`
 *   - Audit：insert into `audit_events`
 *
 * 当前行为：
 *   - authed / demo 模式：返回 mock 列表
 *   - anon 且 Supabase 配齐：401
 */
export async function GET() {
  const { mode } = await getSession();
  if (mode === "anon") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    keys: demoApiKeys,
    stub: true,
  });
}

export async function POST() {
  const { mode } = await getSession();
  if (mode === "anon") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const id = `key_demo_${Math.random().toString(36).slice(2, 8)}`;
  const key: DemoApiKey = {
    id,
    label: "New key",
    masked: `sk-****-**********-${id.slice(-4)}`,
    createdAt: new Date().toISOString().slice(0, 10),
    lastUsedAt: null,
    status: "active",
  };
  return NextResponse.json({ success: true, key, stub: true });
}
