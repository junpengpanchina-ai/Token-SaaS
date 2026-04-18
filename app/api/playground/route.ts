import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

/**
 * STUB: playground inference proxy.
 *
 * 后续接入：
 *   - 鉴权：require auth + active profile
 *   - 取该用户的真实 API key（不暴露给前端）
 *   - 转发到 `new-api` / 网关，返回上游响应
 *   - 限流：IP + 用户维度
 *
 * 当前行为：
 *   - authed / demo: 返回 demo output（销售演示用）
 *   - anon 且 Supabase 配齐: 401
 */
export async function POST(req: Request) {
  const { mode } = await getSession();
  if (mode === "anon") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    model?: string;
    prompt?: string;
  };

  const model = body.model ?? "gpt-4o-mini";
  const prompt = (body.prompt ?? "").trim();

  if (!prompt) {
    return NextResponse.json(
      { success: false, message: "Prompt is required." },
      { status: 400 }
    );
  }

  const output = `[demo · ${model}]\n\nYour prompt was received. Once your account is active, this endpoint routes to the real gateway and returns model output here.`;

  return NextResponse.json({ success: true, model, output, stub: true });
}
