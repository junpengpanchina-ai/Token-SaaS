import Link from "next/link";
import type { ModelCard, ModelStatus } from "@/types/model";

/**
 * Apple-hybrid 模型卡片网格。
 *
 * 设计要点：
 * - 外层只有 1 层卡片边界（hairline），内部靠空白和发丝分隔，不再套小框
 * - 数字（价格、上下文、积分）全用 JetBrains Mono，开发者感就在这
 * - 状态用 Apple 式极小彩点 + 12px 细字，不做大色块
 * - hover 整张卡片轻微浮起（Apple "respond to touch"）
 */
export default function ModelGrid({
  models,
  columns = 3,
}: {
  models: ModelCard[];
  columns?: 2 | 3;
}) {
  const gridCols =
    columns === 2
      ? "md:grid-cols-2"
      : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 gap-5 ${gridCols}`}>
      {models.map((model) => (
        <ModelCardView key={model.id} model={model} />
      ))}
    </div>
  );
}

function ModelCardView({ model }: { model: ModelCard }) {
  return (
    <div className="group relative flex flex-col rounded-xl border border-ink-divider/60 bg-bg-elevated p-6 transition-all duration-300 ease-apple hover:-translate-y-0.5 hover:shadow-apple">
      {/* Header: status + category */}
      <div className="flex items-center justify-between">
        <StatusTag status={model.status} />
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-tertiary">
          {model.category}
        </span>
      </div>

      {/* Name + vendor + description */}
      <div className="mt-5">
        <div className="text-[20px] font-semibold tracking-tight text-ink">
          {model.name}
        </div>
        <div className="mt-1 text-[13px] text-ink-secondary">
          {model.vendor}
        </div>
      </div>

      <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-[13px] leading-5 text-ink-secondary">
        {model.description}
      </p>

      {/* Divider */}
      <div className="mt-6 h-px w-full bg-ink-divider/60" />

      {/* Price */}
      <div className="mt-5">
        <div className="flex items-baseline gap-2">
          <div className="font-mono text-[22px] font-medium tracking-tight text-ink">
            {formatPrice(model)}
          </div>
          <div className="text-[12px] text-ink-tertiary">
            /{model.price.unit}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
        <StatRow label="Context" value={model.contextWindow ?? "—"} />
        <StatRow
          label="Credits"
          value={model.credits ? model.credits.toLocaleString() : "—"}
        />
      </dl>

      {/* Divider */}
      <div className="mt-5 h-px w-full bg-ink-divider/60" />

      {/* Policy */}
      <div className="mt-5 space-y-1.5 text-[12px]">
        <PolicyRow
          label="Refund on violation"
          ok={model.refundOnViolation}
        />
        <PolicyRow
          label="Refund on failure"
          ok={model.refundOnFailure}
        />
      </div>

      {/* Tags: capabilities + resolutions */}
      {(model.capabilities?.length || model.resolutions?.length) ? (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {model.capabilities?.map((c) => (
            <Tag key={c}>{c}</Tag>
          ))}
          {model.resolutions?.map((r) => (
            <Tag key={r} variant="mono">
              {r}
            </Tag>
          ))}
        </div>
      ) : null}

      {/* Footer link */}
      <div className="mt-6 pt-1">
        <Link
          href={model.docsUrl ?? `/docs#${model.id}`}
          className="link-apple"
        >
          View docs
        </Link>
      </div>
    </div>
  );
}

/* ========== 小零件 ========== */

const statusTone: Record<ModelStatus, { dot: string; label: string }> = {
  available: { dot: "bg-emerald-500", label: "Available" },
  preview: { dot: "bg-blue-500", label: "Preview" },
  limited: { dot: "bg-amber-500", label: "Limited" },
  "coming-soon": { dot: "bg-ink-tertiary", label: "Coming soon" },
};

function StatusTag({ status }: { status: ModelStatus }) {
  const t = statusTone[status];
  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${t.dot}`}
        aria-hidden
      />
      <span className="text-[12px] text-ink-secondary">{t.label}</span>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-ink-tertiary">{label}</dt>
      <dd className="text-right font-mono text-ink">{value}</dd>
    </>
  );
}

function PolicyRow({
  label,
  ok,
}: {
  label: string;
  ok?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-secondary">{label}</span>
      <span
        className={`font-mono ${ok ? "text-emerald-600" : "text-ink-tertiary"}`}
        aria-label={ok ? "supported" : "not supported"}
      >
        {ok ? "✓" : "—"}
      </span>
    </div>
  );
}

function Tag({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "mono";
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-ink-divider/70 bg-ink-faint px-2 py-0.5 text-[11px] text-ink-secondary ${variant === "mono" ? "font-mono" : ""}`}
    >
      {children}
    </span>
  );
}

/* ========== 工具 ========== */

function formatPrice(m: ModelCard): string {
  const { min, max, currency } = m.price;

  if (m.status === "coming-soon") return "TBA";

  const sym = currency === "USD" ? "$" : "¥";

  if (min === max) return `${sym}${format(min)}`;
  return `${sym}${format(min)}–${sym}${format(max)}`;
}

function format(n: number): string {
  // 超小价格用完整小数（$0.00014）；较大价格最多两位（$0.60）
  if (n < 0.01) return n.toString();
  if (n < 1) return n.toFixed(n < 0.1 ? 3 : 2).replace(/0+$/, "").replace(/\.$/, "");
  return n.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}
