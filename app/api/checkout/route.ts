import { NextResponse } from "next/server";

export async function POST() {
  try {
    // TODO: 接 Stripe Checkout
    return NextResponse.json({
      success: true,
      message: "Checkout route placeholder.",
    });
  } catch (error) {
    console.error("checkout route error:", error);
    return NextResponse.json(
      { success: false, message: "Checkout failed." },
      { status: 500 }
    );
  }
}
