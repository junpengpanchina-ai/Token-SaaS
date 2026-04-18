"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardCard from "@/components/dashboard/DashboardCard";

export default function EndpointCard({ endpoint }: { endpoint: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(endpoint);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <DashboardCard
      title="API endpoint"
      hint="OpenAI-compatible base URL. Point your SDK here."
    >
      <div className="flex flex-wrap items-center gap-3">
        <code className="flex-1 min-w-[200px] truncate rounded-xl border border-ink-divider/60 bg-ink-faint px-4 py-2.5 font-mono text-[13px] text-ink">
          {endpoint}
        </code>
        <button
          type="button"
          onClick={copy}
          className="btn-apple-ghost !px-4 !py-2 !text-[13px]"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="mt-4">
        <Link href="/docs" className="link-apple">
          Read the docs
        </Link>
      </div>
    </DashboardCard>
  );
}
