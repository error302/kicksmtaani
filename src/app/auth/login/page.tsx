"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      toast.error("Invalid email or password");
      return;
    }
    toast.success("Welcome back");
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className="w-full max-w-sm mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-12"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tightest mb-2">
            Sign in
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Welcome back to KicksMtaani.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-foreground mb-1.5 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-12 pl-10 pr-4 text-sm border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-foreground mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-10 pr-4 text-sm border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-foreground text-background text-sm font-semibold tracking-wide hover:bg-foreground/90 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60 min-h-[48px]"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            New here?{" "}
            <Link
              href={`/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="text-foreground underline hover:text-[var(--kenyan-red)]"
            >
              Create an account
            </Link>
          </p>

          <div className="mt-8 p-4 bg-muted text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Admin demo:</p>
            <p>admin@kicksmtaani.co.ke · admin12345</p>
          </div>
        </div>
      </div>

      {/* Right — editorial image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-foreground">
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-background">
          <p className="text-xs uppercase tracking-[0.25em] text-background/60 mb-4">
            KicksMtaani
          </p>
          <h2 className="text-4xl font-semibold tracking-tightest leading-tight">
            Every brand.
            <br />
            Every drop.
            <br />
            <span className="text-[var(--kenyan-red)]">Yours.</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
