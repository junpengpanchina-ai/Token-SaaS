"use client";

import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import DashboardCard from "@/components/dashboard/DashboardCard";
import type { DemoApiKey } from "@/lib/dashboard/demo";

/**
 * Demo-only API Keys region.
 *
 * - 从 /api/keys 读取 mock 列表（后续替换为真实后端）
 * - Create / Copy / Pause / Revoke 按钮走 /api/keys/[id]（当前返回 mock 响应）
 * - UI 上标明 "Demo" 避免销售 / 客户误会是真 key
 */
export default function ApiKeysCard({
  initialKeys,
  readOnly,
}: {
  initialKeys: DemoApiKey[];
  readOnly?: boolean;
}) {
  const [keys, setKeys] = useState<DemoApiKey[]>(initialKeys);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/keys")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.keys)) setKeys(d.keys);
      })
      .catch(() => {
        /* keep initial demo data */
      });
  }, []);

  async function createKey() {
    setCreating(true);
    try {
      const res = await fetch("/api/keys", { method: "POST" });
      const data = await res.json();
      if (data?.key) setKeys((prev) => [data.key, ...prev]);
    } finally {
      setCreating(false);
    }
  }

  async function mutateKey(id: string, action: "pause" | "resume" | "revoke") {
    setBusyId(id);
    try {
      const res = await fetch(`/api/keys/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data?.key) {
        setKeys((prev) => prev.map((k) => (k.id === id ? data.key : k)));
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <DashboardCard
      title="API keys"
      hint={
        readOnly
          ? "Keys will appear here after activation."
          : "Use these to authenticate requests. Demo data — backend wires up next."
      }
      action={
        !readOnly ? (
          <button
            type="button"
            onClick={createKey}
            disabled={creating}
            className="btn-apple-ghost !px-4 !py-2 !text-[13px] disabled:opacity-50"
          >
            {creating ? "Creating…" : "New key"}
          </button>
        ) : null
      }
    >
      {keys.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-divider/60 p-6 text-center text-[13px] text-ink-secondary">
          No API keys yet.
        </div>
      ) : (
        <ul className="divide-y divide-ink-divider/60">
          {keys.map((k) => (
            <li
              key={k.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-ink">
                    {k.label}
                  </span>
                  <StatusBadge status={k.status} />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11.5px] text-ink-tertiary">
                  <code className="font-mono text-ink-secondary">
                    {k.masked}
                  </code>
                  <span>Created {k.createdAt}</span>
                  {k.lastUsedAt ? (
                    <span>Last used {k.lastUsedAt}</span>
                  ) : null}
                </div>
              </div>

              {!readOnly ? (
                <div className="flex items-center gap-1.5">
                  <IconBtn
                    onClick={() => navigator.clipboard?.writeText(k.masked)}
                    label="Copy"
                  />
                  {k.status === "active" ? (
                    <IconBtn
                      onClick={() => mutateKey(k.id, "pause")}
                      label="Pause"
                      disabled={busyId === k.id}
                    />
                  ) : k.status === "paused" ? (
                    <IconBtn
                      onClick={() => mutateKey(k.id, "resume")}
                      label="Resume"
                      disabled={busyId === k.id}
                    />
                  ) : null}
                  {k.status !== "revoked" ? (
                    <IconBtn
                      onClick={() => mutateKey(k.id, "revoke")}
                      label="Revoke"
                      disabled={busyId === k.id}
                      danger
                    />
                  ) : null}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}

function StatusBadge({ status }: { status: DemoApiKey["status"] }) {
  if (status === "active") return <Badge tone="success">Active</Badge>;
  if (status === "paused") return <Badge tone="warn">Paused</Badge>;
  return <Badge tone="neutral">Revoked</Badge>;
}

function IconBtn({
  label,
  onClick,
  disabled,
  danger,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border border-ink-divider/70 bg-white px-2.5 py-1 text-[12px] font-medium transition-colors disabled:opacity-50 ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-ink-secondary hover:bg-ink-faint hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
