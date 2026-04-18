import { postJSON } from "@/lib/api";

export async function startCheckout(payload: Record<string, unknown>) {
  return postJSON("/api/checkout", payload);
}
