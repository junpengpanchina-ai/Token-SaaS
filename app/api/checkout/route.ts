import { NextResponse } from "next/server";

/**
 * Checkout 占位。
 *
 * 当前架构：Pricing 页按钮直接跳 Stripe Payment Link（env 里配），
 * 所以这个路由只是预留给未来的"server-side Stripe Checkout Session"方案。
 *
 * 后续接入 `stripe.checkout.sessions.create` 时换掉这里即可。
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Checkout is handled via Stripe Payment Links from the pricing page. Server-side sessions will live here in a future version.",
    },
    { status: 501 }
  );
}
