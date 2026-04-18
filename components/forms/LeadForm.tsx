"use client";

import { useState } from "react";

export default function LeadForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    telegram: "",
    company: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setDone(false);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact-page" }),
      });

      const data = await res.json();
      if (data.success) {
        setDone(true);
        setForm({
          name: "",
          email: "",
          telegram: "",
          company: "",
          message: "",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-neutral-900">Leave your request</h2>

      <div className="mt-6 grid gap-4">
        <input
          className="rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
          placeholder="Telegram"
          value={form.telegram}
          onChange={(e) => setForm({ ...form, telegram: e.target.value })}
        />
        <input
          className="rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
          placeholder="Company / Team"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
        <textarea
          className="min-h-[120px] rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
          placeholder="What do you need?"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

      {done && (
        <p className="mt-4 text-sm text-green-600">
          Request received. We will contact you soon.
        </p>
      )}
    </form>
  );
}
