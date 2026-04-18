import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import type { DemoApiKey } from "@/lib/dashboard/demo";

/**
 * STUB: mutate single API key (pause / resume / revoke).
 * 后续接入 `new-api` 时替换这里的 mock 响应。
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { mode } = await getSession();
  if (mode === "anon") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    action?: "pause" | "resume" | "revoke";
  };

  const action = body.action ?? "pause";
  const status: DemoApiKey["status"] =
    action === "pause" ? "paused" : action === "resume" ? "active" : "revoked";

  const key: DemoApiKey = {
    id: params.id,
    label: "Key",
    masked: `sk-****-**********-${params.id.slice(-4)}`,
    createdAt: "2025-03-14",
    lastUsedAt: "moments ago",
    status,
  };

  return NextResponse.json({ success: true, key, stub: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { mode } = await getSession();
  if (mode === "anon") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    success: true,
    id: params.id,
    deleted: true,
    stub: true,
  });
}
