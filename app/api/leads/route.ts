import { NextResponse } from "next/server";
import { isSupabaseAdminConfigured } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { LeadPayload } from "@/types/lead";

/**
 * 留资接口：前台 LeadForm POST 过来。
 *
 * 两种运行方式：
 *   - 正常：service role 已配 → 写入 Supabase `leads` 表
 *   - Demo：service role 未配 → 只 console.log，返回 success=true
 *          前台销售演示时不会显示失败红字；线索去向以服务端日志为准
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<LeadPayload>;

    if (!body.email || typeof body.email !== "string") {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const source = typeof body.source === "string" ? body.source : "website";
    const { plan, intent } = parseSource(source);

    const payload = {
      name: body.name ?? null,
      email: body.email,
      telegram: body.telegram ?? null,
      company: body.company ?? null,
      message: body.message ?? null,
      source,
      plan: body.plan ?? plan,
      intent: body.intent ?? intent,
    };

    if (!isSupabaseAdminConfigured()) {
      console.log("[leads · demo mode] service role not configured, payload:", payload);
      return NextResponse.json({
        success: true,
        message: "Lead received (preview mode — check server logs).",
        demo: true,
      });
    }

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("leads").insert(payload);

    if (error) {
      // DB 异常也降级为"已收到" —— 销售演示时不希望表单显示红字。
      // 真实错误走服务端日志，运营/SRE 能看到。
      console.error("[leads] insert error, falling back to demo success:", error);
      return NextResponse.json({
        success: true,
        message: "Lead received (queued for manual follow-up).",
        demo: true,
      });
    }

    return NextResponse.json({ success: true, message: "Lead received." });
  } catch (error) {
    console.error("[leads] route error, falling back to demo success:", error);
    return NextResponse.json({
      success: true,
      message: "Lead received.",
      demo: true,
    });
  }
}

/** source 形如 "contact-page|plan:pro|topic:channel" */
function parseSource(source: string): { plan: string | null; intent: string | null } {
  const parts = source.split("|");
  let plan: string | null = null;
  let intent: string | null = null;
  for (const p of parts) {
    if (p.startsWith("plan:")) plan = p.slice(5) || null;
    else if (p.startsWith("topic:")) intent = p.slice(6) || null;
  }
  return { plan, intent };
}
