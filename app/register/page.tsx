import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { getSession } from "@/lib/auth/session";
import { siteConfig } from "@/data/site";

export default async function RegisterPage() {
  const { user, mode } = await getSession();
  if (user) redirect("/dashboard");

  const demoMode = mode === "demo";

  return (
    <main className="py-20 md:py-28">
      <Container>
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
            <h1 className="text-[26px] font-semibold tracking-tight text-ink">
              Create account
            </h1>
            <p className="mt-2 text-[14px] text-ink-secondary">
              Continue with Google —— 登录和注册同一个入口，第一次登录会自动建账号。
            </p>

            {demoMode ? (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12.5px] leading-5 text-amber-900">
                Preview mode — sign-up is not connected here. Email{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="font-medium underline"
                >
                  {siteConfig.email}
                </a>{" "}
                or{" "}
                <Link href="/contact" className="font-medium underline">
                  contact sales
                </Link>
                .
              </div>
            ) : null}

            <div className="mt-6">
              <GoogleSignInButton
                next="/dashboard"
                label="Sign up with Google"
                disabled={demoMode}
              />
            </div>

            <p className="mt-6 text-center text-[13px] text-ink-secondary">
              Already have an account?{" "}
              <Link href="/login" className="link-apple">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
