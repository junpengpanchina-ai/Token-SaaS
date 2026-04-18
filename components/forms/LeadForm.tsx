"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type LeadFormProps = {
  source?: string;
};

/**
 * 统一留资表单。
 * - URL 里的 ?plan= / ?topic= 会被带进 payload 的 source 字段，方便销售分类
 * - 提交成功 / 失败都有明确反馈
 * - 字段精简到 Name / Email / Telegram / Company / Message，超出的以后再加
 */
export default function LeadForm({ source = "contact-page" }: LeadFormProps) {
  const search = useSearchParams();
  const plan = search?.get("plan");
  const topic = search?.get("topic");

  const [form, setForm] = useState({
    name: "",
    email: "",
    telegram: "",
    company: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 根据 plan / topic 给 message 预填，让销售知道客户从哪来
  useEffect(() => {
    if (form.message) return;
    if (plan) {
      setForm((f) => ({
        ...f,
        message: `I'm interested in the ${plan} plan.`,
      }));
    } else if (topic === "channel") {
      setForm((f) => ({
        ...f,
        message: "I'd like to discuss channel / reseller cooperation.",
      }));
    } else if (topic === "whitelabel") {
      setForm((f) => ({
        ...f,
        message: "I'm looking for a white-label solution.",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, topic]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);

    try {
      const composedSource = [source, plan && `plan:${plan}`, topic && `topic:${topic}`]
        .filter(Boolean)
        .join("|");

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: composedSource }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Submission failed");
      }

      setStatus("success");
      setForm({ name: "", email: "", telegram: "", company: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
        <div className="text-[18px] font-semibold text-emerald-900">
          Request received.
        </div>
        <p className="mt-3 text-[14px] leading-6 text-emerald-800">
          Our team will reply within one business day. Access is activated
          after a short review.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-[13px] font-medium text-emerald-900 underline-offset-2 hover:underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm"
    >
      <h2 className="text-[18px] font-semibold text-ink">
        Tell us about your project
      </h2>
      <p className="mt-1 text-[13px] text-ink-secondary">
        We reply within one business day.
      </p>

      <div className="mt-6 grid gap-4">
        <Field
          label="Name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />
        <Field
          label="Work email"
          type="email"
          required
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
        />
        <Field
          label="Telegram (optional)"
          value={form.telegram}
          onChange={(v) => setForm({ ...form, telegram: v })}
          placeholder="@handle"
        />
        <Field
          label="Company / Team"
          value={form.company}
          onChange={(v) => setForm({ ...form, company: v })}
        />
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-ink-secondary">
            What do you need?
          </label>
          <textarea
            className="w-full min-h-[120px] rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
            placeholder="Use case, expected volume, target models…"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-apple mt-6 w-full disabled:opacity-50"
      >
        {status === "loading" ? "Submitting…" : "Submit request"}
      </button>

      {status === "error" ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">
          {errorMsg ?? "Submission failed. Please try again."}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-ink-secondary">
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </label>
      <input
        type={type}
        required={required}
        className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
