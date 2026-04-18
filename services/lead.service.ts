import { postJSON } from "@/lib/api";

export async function submitLead(payload: Record<string, unknown>) {
  return postJSON("/api/leads", payload);
}
