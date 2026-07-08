"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Mail, Lock, User, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be 6+ characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) {
        toast.error(data.error || "Registration failed");
        setLoading(false);
        return;
      }
      // Auto sign in
      const signinRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      setLoading(false);
      if (signinRes?.error) {
        toast.error("Account created — please sign in");
        router.push("/auth/login");
        return;
      }
      toast.success("Welcome to KicksMtaani");
      router.push(callbackUrl);
      router.refresh();
    } catch {
      toast.error("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
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
            Create account
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Join the KicksMtaani community.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              icon={User}
              label="Full name"
              value={form.fullName}
              onChange={(v) => setForm({ ...form, fullName: v })}
              placeholder="Jane Wanjiru"
            />
            <Field
              icon={Mail}
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              placeholder="you@example.com"
              required
            />
            <Field
              icon={Phone}
              label="Phone (M-Pesa)"
              type="tel"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
              placeholder="07XX XXX XXX"
            />
            <Field
              icon={Lock}
              label="Password"
              type="password"
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
              placeholder="6+ characters"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-foreground text-background text-sm font-semibold tracking-wide hover:bg-foreground/90 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60 min-h-[48px]"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Already have an account?{" "}
            <Link
              href={`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="text-foreground underline hover:text-[var(--kenyan-red)]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative bg-foreground">
        <img
          src="https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=1200&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-background">
          <p className="text-xs uppercase tracking-[0.25em] text-background/60 mb-4">
            Join the community
          </p>
          <h2 className="text-4xl font-semibold tracking-tightest leading-tight">
            First in line
            <br />
            for every
            <br />
            <span className="text-[var(--kenyan-red)]">drop.</span>
          </h2>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  icon: any;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-foreground mb-1.5 block">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 pl-10 pr-4 text-sm border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );
}
