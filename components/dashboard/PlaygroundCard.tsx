"use client";

import { useState } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";

const models = [
  { id: "gpt-4o-mini", label: "GPT-4o mini · fast · cheap" },
  { id: "gpt-4o", label: "GPT-4o · multimodal" },
  { id: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet · long context" },
  { id: "deepseek-chat", label: "DeepSeek Chat · cheapest" },
];

export default function PlaygroundCard({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const [model, setModel] = useState(models[0].id);
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!prompt.trim() || disabled) return;
    setRunning(true);
    setError(null);
    setOutput("");
    try {
      const res = await fetch("/api/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, prompt }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.message ?? "Request failed");
      }
      setOutput(data.output ?? "");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Playground is not available yet."
      );
    } finally {
      setRunning(false);
    }
  }

  return (
    <DashboardCard
      title="Playground"
      hint={
        disabled
          ? "Playground unlocks after activation."
          : "Quickly test a prompt. Demo output — routed through our gateway once your key is live."
      }
    >
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink-tertiary">
              Model
            </span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={disabled}
              className="w-full rounded-xl border border-ink-divider/70 bg-white px-3 py-2 text-[13px] text-ink outline-none transition-colors focus:border-ink disabled:opacity-50"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink-tertiary">
            Prompt
          </span>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={disabled}
            placeholder="Explain vector databases in one paragraph."
            className="min-h-[110px] w-full rounded-xl border border-ink-divider/70 bg-white px-3 py-2.5 text-[13px] leading-5 text-ink outline-none transition-colors focus:border-ink disabled:opacity-50"
          />
        </label>

        <button
          type="button"
          onClick={run}
          disabled={disabled || running || !prompt.trim()}
          className="btn-apple w-full disabled:opacity-50 md:w-auto md:!px-6"
        >
          {running ? "Running…" : "Run"}
        </button>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-[12.5px] text-red-600">
            {error}
          </p>
        ) : null}

        <div>
          <div className="mb-1.5 text-[11px] uppercase tracking-[0.14em] text-ink-tertiary">
            Output
          </div>
          <pre className="min-h-[100px] whitespace-pre-wrap rounded-xl border border-ink-divider/60 bg-ink-faint px-3 py-2.5 font-mono text-[12.5px] leading-5 text-ink">
            {output || (
              <span className="text-ink-tertiary">
                Output will appear here.
              </span>
            )}
          </pre>
        </div>
      </div>
    </DashboardCard>
  );
}
