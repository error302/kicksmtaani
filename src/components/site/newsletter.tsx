"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import type { SiteSettings } from "@/lib/settings";

interface Props {
  settings: SiteSettings;
}

export function Newsletter({ settings: s }: Props) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const subscribe = async () => {
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setDone(true);
        toast.success("Subscribed");
      } else {
        toast.error("Could not subscribe");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-background/40" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-background/60">
                {s.newsletterEyebrow}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tightest leading-[0.95] mb-5">
              {s.newsletterTitle1}
              <br />
              <span className="text-background/50">{s.newsletterTitle2}</span>
            </h2>
            <p className="text-base sm:text-lg text-background/70 max-w-md leading-relaxed">
              {s.newsletterBody}
            </p>
          </div>

          {/* Right — form */}
          <div className="lg:pl-8">
            {done ? (
              <div className="border border-background/20 p-8 sm:p-10 flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-background text-foreground flex items-center justify-center flex-shrink-0">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-lg mb-1">You&apos;re in.</p>
                  <p className="text-sm text-background/70">
                    Check your inbox for a welcome discount and the next drop
                    notification.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && subscribe()}
                    placeholder="you@example.com"
                    className="flex-1 h-14 px-5 bg-transparent border border-background/30 text-background placeholder:text-background/40 focus:outline-none focus:border-background text-sm"
                  />
                  <button
                    onClick={subscribe}
                    disabled={loading}
                    className="h-14 px-7 bg-background text-foreground text-sm font-semibold tracking-wide hover:bg-background/90 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60 min-h-[48px]"
                  >
                    {loading ? "Joining..." : "Join"}
                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-background/50">
                  By subscribing, you agree to receive marketing emails from
                  {" "}{s.siteName}{s.siteNameAccent}. Unsubscribe anytime.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
