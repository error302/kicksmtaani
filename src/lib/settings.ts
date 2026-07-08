import { db } from "@/lib/db";

/**
 * Site settings — key-value store with in-memory cache.
 * All frontend copy, branding, contact info, shipping config, etc.
 * is editable from /admin/settings so nothing is hardcoded.
 */

export interface SiteSettings {
  // General
  siteName: string;
  siteNameAccent: string; // the red part of the wordmark
  tagline: string; // browser tab description / OG description

  // Branding
  faviconUrl: string;
  logoUrl: string; // optional custom logo (falls back to text wordmark)

  // Hero
  heroEyebrow: string;
  heroTitle1: string;
  heroTitle2: string;
  heroRotatingWords: string; // comma-separated
  heroSubtitle: string;
  heroCta1: string; // primary button
  heroCta2: string; // secondary button
  heroSocialProofRating: string;
  heroSocialProofReviews: string;
  heroSocialProofBrands: string;

  // Announcement bar (top of site, dismissible)
  announcementActive: boolean;
  announcementText: string;
  announcementLink: string; // optional

  // Trust bar
  trust1Title: string;
  trust1Sub: string;
  trust2Title: string;
  trust2Sub: string;
  trust3Title: string;
  trust3Sub: string;

  // Brand showcase
  brandsEyebrow: string;
  brandsTitle1: string;
  brandsTitle2: string;
  brandsDescription: string;

  // Editorial
  editorialEyebrow: string;
  editorialTitle1: string;
  editorialTitle2: string;
  editorialBody1: string;
  editorialBody2: string;
  editorialCta: string;

  // Newsletter
  newsletterEyebrow: string;
  newsletterTitle1: string;
  newsletterTitle2: string;
  newsletterBody: string;

  // Footer
  footerTagline: string;
  footerCopyright: string;

  // Contact
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;

  // Social
  socialInstagram: string;
  socialTwitter: string;
  socialFacebook: string;

  // Shipping
  shippingFee: string; // KES
  shippingFreeThreshold: string; // KES — free shipping above this
  currency: string; // e.g. "KES"
}

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Kicks",
  siteNameAccent: "Mtaani",
  tagline:
    "Shop authentic Nike, Adidas, Jordan, Yeezy, New Balance, On Running, Salomon, Travis Scott, Off-White and 20+ more premium sneaker brands. Free delivery in Nairobi & Mombasa. 7-day returns.",

  faviconUrl: "",
  logoUrl: "",

  heroEyebrow: "Kenya's Premium Sneaker Marketplace",
  heroTitle1: "Every brand.",
  heroTitle2: "Every drop.",
  heroRotatingWords: "Authentic.,Premium.,Iconic.,Collectible.",
  heroSubtitle:
    "From Nike to New Balance, Yeezy to On Running — 25+ legendary brands, authenticated and delivered to your door across Kenya.",
  heroCta1: "Shop the collection",
  heroCta2: "Explore brands",
  heroSocialProofRating: "4.9",
  heroSocialProofReviews: "12,400+",
  heroSocialProofBrands: "25+",

  announcementActive: false,
  announcementText: "",
  announcementLink: "",

  trust1Title: "Free delivery",
  trust1Sub: "Nairobi & Mombasa · 1–2 days",
  trust2Title: "100% authentic",
  trust2Sub: "Every pair verified",
  trust3Title: "7-day returns",
  trust3Sub: "Hassle-free, no questions",

  brandsEyebrow: "The Brands",
  brandsTitle1: "Every legend,",
  brandsTitle2: "one marketplace.",
  brandsDescription:
    "From Beaverton to Herzogenaurach, Tokyo to Paris. The most coveted sneaker brands in the world — authenticated, curated, and shipped from Nairobi.",

  editorialEyebrow: "The KicksMtaani Standard",
  editorialTitle1: "Not just shoes.",
  editorialTitle2: "A statement.",
  editorialBody1:
    "KicksMtaani was born from a simple conviction: that Kenyan sneakerheads deserve the same access to global heat as anyone, anywhere — without compromise on authenticity, delivery, or service.",
  editorialBody2:
    "Every pair in our catalogue is sourced through authorised channels, inspected by hand, and shipped from Nairobi. From the icons of Beaverton to the trail-ready technicality of the French Alps, we carry the brands that matter.",
  editorialCta: "Explore the collection",

  newsletterEyebrow: "The Inner Circle",
  newsletterTitle1: "First in line",
  newsletterTitle2: "for every drop.",
  newsletterBody:
    "Members get early access to releases, private restocks, and 10% off the first order. No spam — only heat.",

  footerTagline: "Kenya's premium destination for authentic sneakers and streetwear.",
  footerCopyright: "KicksMtaani. All rights reserved.",

  contactPhone: "+254 700 000 000",
  contactEmail: "hello@kicksmtaani.co.ke",
  contactAddress: "Nairobi · Mombasa · Kisumu, Kenya",

  socialInstagram: "",
  socialTwitter: "",
  socialFacebook: "",

  shippingFee: "350",
  shippingFreeThreshold: "15000",
  currency: "KES",
};

let cache: SiteSettings | null = null;
let cacheTime = 0;
const CACHE_TTL = 30_000; // 30 seconds

export async function getSettings(): Promise<SiteSettings> {
  // Return cached if fresh
  if (cache && Date.now() - cacheTime < CACHE_TTL) {
    return cache;
  }

  try {
    const rows = await db.siteSetting.findMany();
    const map = new Map(rows.map((r) => [r.key, r.value]));

    const settings = { ...DEFAULT_SETTINGS };
    for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof SiteSettings)[]) {
      const raw = map.get(key);
      if (raw !== undefined) {
        if (typeof DEFAULT_SETTINGS[key] === "boolean") {
          (settings as any)[key] = raw === "true";
        } else {
          (settings as any)[key] = raw;
        }
      }
    }

    cache = settings;
    cacheTime = Date.now();
    return settings;
  } catch {
    // DB not ready or error — return defaults
    return DEFAULT_SETTINGS;
  }
}

export function invalidateSettingsCache() {
  cache = null;
  cacheTime = 0;
}

export async function saveSettings(values: Partial<SiteSettings>): Promise<void> {
  for (const [key, value] of Object.entries(values)) {
    const strValue = typeof value === "boolean" ? String(value) : String(value ?? "");
    await db.siteSetting.upsert({
      where: { key },
      create: { key, value: strValue },
      update: { value: strValue },
    });
  }
  invalidateSettingsCache();
}
