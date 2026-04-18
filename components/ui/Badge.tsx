/**
 * 全站唯一的状态 / 标签视觉口径。
 * - tone 决定颜色意义，label 决定显示文本
 * - 模型页、Dashboard、Pricing 都从这里出，避免风格漂移
 */
type Tone =
  | "success" // Available / Active
  | "info"    // Preview / Beta / New
  | "warn"    // Limited / Pending
  | "neutral" // Coming soon / Archived
  | "dark";   // Recommended / Plan highlight

const toneClass: Record<Tone, string> = {
  success: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
  info: "bg-blue-500/10 text-blue-700 ring-blue-500/20",
  warn: "bg-amber-500/10 text-amber-700 ring-amber-500/20",
  neutral: "bg-ink-faint text-ink-tertiary ring-ink-divider/60",
  dark: "bg-bg-dark text-white ring-bg-dark/10",
};

export default function Badge({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${toneClass[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
