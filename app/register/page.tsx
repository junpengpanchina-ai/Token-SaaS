import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function RegisterPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="py-20 md:py-28">
      <Container>
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
            <h1 className="text-[26px] font-semibold tracking-tight text-ink">
              Create account
            </h1>
            <p className="mt-2 text-[14px] text-ink-secondary">
              Continue with Google —— 登录和注册是同一个入口，第一次登录会自动建账号。
            </p>

            <div className="mt-6">
              <GoogleSignInButton
                next="/dashboard"
                label="Sign up with Google"
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
