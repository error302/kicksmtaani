"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Upload, Star } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

type Tab = "general" | "branding" | "hero" | "announcement" | "trust" | "brands" | "editorial" | "newsletter" | "footer" | "contact" | "shipping";

const TABS: { id: Tab; label: string }[] = [
  { id: "general", label: "General" },
  { id: "branding", label: "Branding" },
  { id: "announcement", label: "Announcement" },
  { id: "hero", label: "Hero" },
  { id: "trust", label: "Trust Bar" },
  { id: "brands", label: "Brand Section" },
  { id: "editorial", label: "Editorial" },
  { id: "newsletter", label: "Newsletter" },
  { id: "footer", label: "Footer" },
  { id: "contact", label: "Contact" },
  { id: "shipping", label: "Shipping" },
];

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("general");
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery<{ settings: Record<string, any> }>({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const res = await fetch("/api/admin/settings");
      return res.json();
    },
  });

  useEffect(() => {
    if (data?.settings) {
      setForm(data.settings);
    }
  }, [data]);

  const update = (key: string, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (d.ok) {
        toast.success("Settings saved — changes are live");
        queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      } else {
        toast.error(d.error || "Save failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleFaviconUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const d = await res.json();
      if (d.ok) {
        update("faviconUrl", d.url);
        toast.success("Favicon uploaded — save to apply");
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tightest">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Edit your site copy, branding, and contact info. Changes go live instantly.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-60 min-h-[40px]"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </button>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-shrink-0 px-3.5 h-9 text-xs font-medium border transition-colors ${
              tab === t.id
                ? "bg-foreground text-background border-foreground"
                : "bg-background border-border hover:border-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-background border border-border p-5 sm:p-6"
      >
        {tab === "general" && (
          <Section title="General">
            <Input label="Site name (first part)" value={form.siteName ?? ""} onChange={(v) => update("siteName", v)} placeholder="Kicks" />
            <Input label="Site name accent (second part, red)" value={form.siteNameAccent ?? ""} onChange={(v) => update("siteNameAccent", v)} placeholder="Mtaani" />
            <Textarea label="Tagline / meta description (SEO)" value={form.tagline ?? ""} onChange={(v) => update("tagline", v)} rows={3} />
            <p className="text-xs text-muted-foreground">
              The site name appears in the header, footer, and browser tab. The accent is shown in red.
            </p>
          </Section>
        )}

        {tab === "branding" && (
          <Section title="Branding">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">Favicon (browser tab icon)</label>
              <div className="flex items-center gap-3">
                {form.faviconUrl && (
                  <img src={form.faviconUrl} alt="Favicon" className="h-10 w-10 border border-border object-contain" />
                )}
                <label className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-border hover:bg-accent transition-colors cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Upload favicon
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFaviconUpload(f);
                    }}
                  />
                </label>
                {form.faviconUrl && (
                  <button
                    onClick={() => update("faviconUrl", "")}
                    className="text-xs text-muted-foreground hover:text-[var(--kenyan-red)]"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Upload a square image (32×32 or larger). Leave empty to use the default.
              </p>
            </div>
            <Input label="Custom logo URL (optional — falls back to text wordmark)" value={form.logoUrl ?? ""} onChange={(v) => update("logoUrl", v)} placeholder="https://..." />
            <p className="text-xs text-muted-foreground">
              If set, this image replaces the text &ldquo;{form.siteName}{form.siteNameAccent}&rdquo; wordmark in the header and footer.
            </p>
          </Section>
        )}

        {tab === "announcement" && (
          <Section title="Announcement Bar">
            <p className="text-sm text-muted-foreground">
              A dismissible banner shown at the very top of your site. Use it for promotions, events, or holiday messages.
            </p>
            <Toggle label="Show announcement bar" value={form.announcementActive ?? false} onChange={(v) => update("announcementActive", v)} />
            <Input label="Announcement text" value={form.announcementText ?? ""} onChange={(v) => update("announcementText", v)} placeholder="Free delivery this weekend only!" />
            <Input label="Link (optional — where clicking goes)" value={form.announcementLink ?? ""} onChange={(v) => update("announcementLink", v)} placeholder="/#product-grid" />
          </Section>
        )}

        {tab === "hero" && (
          <Section title="Hero Section">
            <Input label="Eyebrow text (small text above headline)" value={form.heroEyebrow ?? ""} onChange={(v) => update("heroEyebrow", v)} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Headline line 1" value={form.heroTitle1 ?? ""} onChange={(v) => update("heroTitle1", v)} />
              <Input label="Headline line 2 (muted)" value={form.heroTitle2 ?? ""} onChange={(v) => update("heroTitle2", v)} />
            </div>
            <Input label="Rotating words (comma-separated)" value={form.heroRotatingWords ?? ""} onChange={(v) => update("heroRotatingWords", v)} placeholder="Authentic.,Premium.,Iconic." />
            <Textarea label="Subtitle / description" value={form.heroSubtitle ?? ""} onChange={(v) => update("heroSubtitle", v)} rows={3} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Primary button text" value={form.heroCta1 ?? ""} onChange={(v) => update("heroCta1", v)} />
              <Input label="Secondary button text" value={form.heroCta2 ?? ""} onChange={(v) => update("heroCta2", v)} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Social proof rating" value={form.heroSocialProofRating ?? ""} onChange={(v) => update("heroSocialProofRating", v)} />
              <Input label="Social proof reviews count" value={form.heroSocialProofReviews ?? ""} onChange={(v) => update("heroSocialProofReviews", v)} />
              <Input label="Brands count" value={form.heroSocialProofBrands ?? ""} onChange={(v) => update("heroSocialProofBrands", v)} />
            </div>
          </Section>
        )}

        {tab === "trust" && (
          <Section title="Trust Bar (features strip under hero)">
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Feature 1 title" value={form.trust1Title ?? ""} onChange={(v) => update("trust1Title", v)} />
              <Input label="Feature 1 subtitle" value={form.trust1Sub ?? ""} onChange={(v) => update("trust1Sub", v)} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Feature 2 title" value={form.trust2Title ?? ""} onChange={(v) => update("trust2Title", v)} />
              <Input label="Feature 2 subtitle" value={form.trust2Sub ?? ""} onChange={(v) => update("trust2Sub", v)} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Feature 3 title" value={form.trust3Title ?? ""} onChange={(v) => update("trust3Title", v)} />
              <Input label="Feature 3 subtitle" value={form.trust3Sub ?? ""} onChange={(v) => update("trust3Sub", v)} />
            </div>
          </Section>
        )}

        {tab === "brands" && (
          <Section title="Brand Showcase Section">
            <Input label="Eyebrow text" value={form.brandsEyebrow ?? ""} onChange={(v) => update("brandsEyebrow", v)} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Title line 1" value={form.brandsTitle1 ?? ""} onChange={(v) => update("brandsTitle1", v)} />
              <Input label="Title line 2 (muted)" value={form.brandsTitle2 ?? ""} onChange={(v) => update("brandsTitle2", v)} />
            </div>
            <Textarea label="Description" value={form.brandsDescription ?? ""} onChange={(v) => update("brandsDescription", v)} rows={3} />
          </Section>
        )}

        {tab === "editorial" && (
          <Section title="Editorial Section">
            <Input label="Eyebrow text" value={form.editorialEyebrow ?? ""} onChange={(v) => update("editorialEyebrow", v)} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Title line 1" value={form.editorialTitle1 ?? ""} onChange={(v) => update("editorialTitle1", v)} />
              <Input label="Title line 2 (muted)" value={form.editorialTitle2 ?? ""} onChange={(v) => update("editorialTitle2", v)} />
            </div>
            <Textarea label="Body paragraph 1" value={form.editorialBody1 ?? ""} onChange={(v) => update("editorialBody1", v)} rows={3} />
            <Textarea label="Body paragraph 2" value={form.editorialBody2 ?? ""} onChange={(v) => update("editorialBody2", v)} rows={3} />
            <Input label="CTA button text" value={form.editorialCta ?? ""} onChange={(v) => update("editorialCta", v)} />
          </Section>
        )}

        {tab === "newsletter" && (
          <Section title="Newsletter Section">
            <Input label="Eyebrow text" value={form.newsletterEyebrow ?? ""} onChange={(v) => update("newsletterEyebrow", v)} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Title line 1" value={form.newsletterTitle1 ?? ""} onChange={(v) => update("newsletterTitle1", v)} />
              <Input label="Title line 2 (muted)" value={form.newsletterTitle2 ?? ""} onChange={(v) => update("newsletterTitle2", v)} />
            </div>
            <Textarea label="Body text" value={form.newsletterBody ?? ""} onChange={(v) => update("newsletterBody", v)} rows={3} />
          </Section>
        )}

        {tab === "footer" && (
          <Section title="Footer">
            <Textarea label="Footer tagline" value={form.footerTagline ?? ""} onChange={(v) => update("footerTagline", v)} rows={2} />
            <Input label="Copyright text" value={form.footerCopyright ?? ""} onChange={(v) => update("footerCopyright", v)} />
          </Section>
        )}

        {tab === "contact" && (
          <Section title="Contact Information">
            <Input label="Phone number" value={form.contactPhone ?? ""} onChange={(v) => update("contactPhone", v)} />
            <Input label="Email address" value={form.contactEmail ?? ""} onChange={(v) => update("contactEmail", v)} />
            <Textarea label="Address / location" value={form.contactAddress ?? ""} onChange={(v) => update("contactAddress", v)} rows={2} />
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Instagram URL" value={form.socialInstagram ?? ""} onChange={(v) => update("socialInstagram", v)} placeholder="https://instagram.com/..." />
              <Input label="Twitter / X URL" value={form.socialTwitter ?? ""} onChange={(v) => update("socialTwitter", v)} placeholder="https://x.com/..." />
              <Input label="Facebook URL" value={form.socialFacebook ?? ""} onChange={(v) => update("socialFacebook", v)} placeholder="https://facebook.com/..." />
            </div>
          </Section>
        )}

        {tab === "shipping" && (
          <Section title="Shipping & Currency">
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Shipping fee (KES)" value={form.shippingFee ?? ""} onChange={(v) => update("shippingFee", v)} />
              <Input label="Free shipping threshold (KES)" value={form.shippingFreeThreshold ?? ""} onChange={(v) => update("shippingFreeThreshold", v)} />
              <Input label="Currency symbol" value={form.currency ?? ""} onChange={(v) => update("currency", v)} />
            </div>
            <p className="text-xs text-muted-foreground">
              Orders above the threshold get free shipping. The currency symbol is shown before prices on the storefront.
            </p>
          </Section>
        )}
      </motion.div>

      {/* Sticky save bar on mobile */}
      <div className="sm:hidden sticky bottom-0 left-0 right-0 bg-background border-t border-border p-3 -mx-4 sm:-mx-6 lg:-mx-8 flex justify-end safe-bottom">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider">{title}</h2>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 3, placeholder }: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider mb-1.5 block">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
      />
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer py-2">
      <span className="text-sm font-medium">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-foreground" : "bg-muted"}`}
        aria-pressed={value}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </button>
    </label>
  );
}
