import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { DemoProfile } from "@/lib/dashboard/demo";
import { siteConfig } from "@/data/site";

/**
 * 登录后的第一眼：当前账户状态。
 * - pending_activation: 未开通 → 明确告诉客户下一步做什么
 * - active:             已开通 → 展示当前计划
 * - suspended:          已暂停 → 让客户联系支持
 */
export default function StatusBanner({
  name,
  profile,
}: {
  name: string;
  profile: DemoProfile;
}) {
  if (profile.status === "pending_activation") {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge tone="warn">Pending activation</Badge>
              <span className="text-[12px] text-amber-900/70">
                Review usually completes within one business day
              </span>
            </div>
            <h1 className="mt-3 text-[22px] font-semibold text-amber-950 md:text-[26px]">
              Welcome, {name}.
            </h1>
            <p className="mt-2 max-w-[60ch] text-[14px] leading-6 text-amber-900">
              Your account is under review. Once approved, your API key, base
              URL, and plan will show up right here.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link href="/contact" className="btn-apple">
            Contact sales to speed up
          </Link>
          <a
            href={`mailto:${siteConfig.email}?subject=Activation%20for%20${encodeURIComponent(
              name
            )}`}
            className="link-apple"
          >
            Email {siteConfig.email}
          </a>
        </div>
      </div>
    );
  }

  if (profile.status === "suspended") {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-7 md:p-8">
        <Badge tone="warn">Suspended</Badge>
        <h1 className="mt-3 text-[22px] font-semibold text-red-950 md:text-[26px]">
          Access is currently paused.
        </h1>
        <p className="mt-2 max-w-[60ch] text-[14px] leading-6 text-red-900">
          Please reach out to our team to review your account.
        </p>
        <Link href="/contact" className="btn-apple mt-6 inline-flex">
          Contact support
        </Link>
      </div>
    );
  }

  const planLabel =
    profile.plan === "none" ? "No plan" : capitalize(profile.plan);

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-7 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge tone="success">Active</Badge>
          <h1 className="mt-3 text-[22px] font-semibold text-ink md:text-[26px]">
            Welcome back, {name}.
          </h1>
          <p className="mt-1 text-[13px] text-ink-secondary">
            Current plan · <span className="font-medium text-ink">{planLabel}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="btn-apple-ghost">
            Change plan
          </Link>
          <Link href="/contact" className="link-apple">
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
