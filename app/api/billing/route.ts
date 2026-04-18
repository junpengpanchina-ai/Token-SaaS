import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { demoTransactions } from "@/lib/dashboard/demo";

/**
 * STUB: billing info for current user.
 *
 * 后续接入：
 *   - Stripe webhook → `orders` 表（见 docs/ops/schema.sql）
 *   - `profiles.plan`、`profiles.credits` 为真实值
 */
export async function GET() {
  const { mode } = await getSession();
  if (mode === "anon") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    transactions: demoTransactions,
    stub: true,
  });
}
