import Link from "next/link";
import Badge from "@/components/ui/Badge";
import DashboardCard from "@/components/dashboard/DashboardCard";
import type { DemoProfile, DemoTransaction } from "@/lib/dashboard/demo";

export default function BillingCard({
  profile,
  transactions,
}: {
  profile: DemoProfile;
  transactions: DemoTransaction[];
}) {
  const planLabel =
    profile.plan === "none" ? "No plan" : capitalize(profile.plan);
  const active = profile.status === "active";

  return (
    <DashboardCard
      title="Billing"
      hint={
        active
          ? "Plan, credits, and recent transactions."
          : "Billing details will appear here after activation."
      }
      action={
        <Link
          href="/pricing"
          className="btn-apple-ghost !px-4 !py-2 !text-[13px]"
        >
          {active ? "Upgrade" : "View plans"}
        </Link>
      }
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-ink-divider/60 bg-ink-faint/40 p-4">
          <div className="text-[11px] uppercase tracking-[0.14em] text-ink-tertiary">
            Current plan
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[18px] font-semibold text-ink">
              {planLabel}
            </span>
            {active ? (
              <Badge tone="success">Active</Badge>
            ) : (
              <Badge tone="warn">Inactive</Badge>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-ink-divider/60 bg-ink-faint/40 p-4">
          <div className="text-[11px] uppercase tracking-[0.14em] text-ink-tertiary">
            Credits
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono text-[20px] font-medium text-ink">
              {profile.credits.toLocaleString()}
            </span>
            <span className="text-[12px] text-ink-tertiary">available</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 text-[11px] uppercase tracking-[0.14em] text-ink-tertiary">
          Recent transactions
        </div>
        {active ? (
          <ul className="divide-y divide-ink-divider/60">
            {transactions.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between py-2.5 first:pt-0"
              >
                <div>
                  <div className="text-[13px] text-ink">{t.description}</div>
                  <div className="text-[11.5px] text-ink-tertiary">
                    {t.date}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[13px] text-ink">
                    {t.amount}
                  </span>
                  <Badge tone={t.status === "paid" ? "success" : "neutral"}>
                    {capitalize(t.status)}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-ink-divider/60 p-5 text-center text-[13px] text-ink-secondary">
            No transactions yet.
          </div>
        )}
      </div>
    </DashboardCard>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
