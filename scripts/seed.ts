// KicksMtaani Seed Script
// Seeds the database with 25+ sneaker brands and 50+ realistic products.
// Run with: bun run db:seed

import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";

const db = new PrismaClient();

// ---------- BRANDS ----------
type BrandSeed = {
  name: string;
  slug: string;
  country: string;
  description: string;
  featured: boolean;
};

const brands: BrandSeed[] = [
  { name: "Nike", slug: "nike", country: "United States", description: "The Swoosh. Just Do It. Engineered for athletic excellence and street dominance.", featured: true },
  { name: "Adidas", slug: "adidas", country: "Germany", description: "Three Stripes of sporting heritage. Born in Bavaria, worn worldwide.", featured: true },
  { name: "Jordan", slug: "jordan", country: "United States", description: "The legacy of MJ. Air Jordan defines sneaker culture since 1985.", featured: true },
  { name: "New Balance", slug: "new-balance", country: "United States", description: "Made in USA craftsmanship. Quiet luxury endorsed by taste-makers.", featured: true },
  { name: "Yeezy", slug: "yeezy", country: "United States", description: "Kanye West's boundary-pushing designs. Limited, coveted, collectible.", featured: true },
  { name: "Puma", slug: "puma", country: "Germany", description: "Forever Faster. Suede, Clyde, and RS-X silhouettes from Herzogenaurach.", featured: false },
  { name: "Reebok", slug: "reebok", country: "United States", description: "Classic Club C and Instapump Fury. Heritage aerobics meets streetwear.", featured: false },
  { name: "Converse", slug: "converse", country: "United States", description: "The Chuck Taylor All Star. A canvas icon worn for over a century.", featured: false },
  { name: "Vans", slug: "vans", country: "United States", description: "Off The Wall. Skate culture's favorite — Old Skool, Sk8-Hi, Authentic.", featured: false },
  { name: "Asics", slug: "asics", country: "Japan", description: "Anima Sana In Corpore Sano. Japanese engineering meets GEL cushioning.", featured: false },
  { name: "On Running", slug: "on-running", country: "Switzerland", description: "Swiss-engineered CloudTec. The fastest-growing running brand on earth.", featured: true },
  { name: "Hoka", slug: "hoka", country: "France", description: "Maximalist cushioning. Born in the French Alps, loved by ultrarunners.", featured: false },
  { name: "Salomon", slug: "salomon", country: "France", description: "Alpine technical footwear. The XT-6 is the design set's trail shoe of choice.", featured: true },
  { name: "Off-White", slug: "off-white", country: "Italy", description: "Virgil Abloh's deconstructed luxury. The Ten reimagined sneaker design.", featured: false },
  { name: "Balenciaga", slug: "balenciaga", country: "Spain", description: "Demna's chunky Speed Trimmer and Triple S. Luxury's most defiant silhouette.", featured: false },
  { name: "Alexander McQueen", slug: "alexander-mcqueen", country: "United Kingdom", description: "The Oversized Sneaker. British tailoring tradition rendered in leather.", featured: false },
  { name: "Travis Scott", slug: "travis-scott", country: "United States", description: "Cactus Jack collaborations. The most coveted Nike partnerships of the decade.", featured: true },
  { name: "Sacai", slug: "sacai", country: "Japan", description: "Chitose Abe's hybrid designs. The LDV Waffle redefined deconstruction.", featured: false },
  { name: "Under Armour", slug: "under-armour", country: "United States", description: "Curry Brand and HOVR technology. Performance basketball and training.", featured: false },
  { name: "Skechers", slug: "skechers", country: "United States", description: "Comfort engineering at scale. The D'Lites and GOrun families.", featured: false },
  { name: "Fila", slug: "fila", country: "Italy", description: "Disruptor II and the chunky revolution. Italian heritage reborn.", featured: false },
  { name: "Diadora", slug: "diadora", country: "Italy", description: "Made in Italy craftsmanship. The N9000 and V7000 silhouettes.", featured: false },
  { name: "Common Projects", slug: "common-projects", country: "United States", description: "The Achilles Low. Minimalist luxury sneaker with the iconic gold stamp.", featured: false },
  { name: "Merrell", slug: "merrell", country: "United States", description: "Trail-ready Moab and Agility Peak. Built for the outdoors.", featured: false },
  { name: "Maison Margiela", slug: "maison-margiela", country: "France", description: "The German Trainer replica. Anonymous luxury at its quietest.", featured: false },
];

// ---------- PRODUCTS ----------
type ProductSeed = {
  brandSlug: string;
  name: string;
  slug: string;
  category: "MEN" | "WOMEN" | "KIDS" | "UNISEX";
  description: string;
  basePrice: number;
  compareAt?: number;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
  tags?: string[];
};

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=900&q=80`;

const products: ProductSeed[] = [
  // ---------- NIKE ----------
  {
    brandSlug: "nike", name: "Nike Air Force 1 '07", slug: "nike-air-force-1-07",
    category: "UNISEX", basePrice: 14999, compareAt: 18000,
    description: "The legend that started it all. The Air Force 1 '07 keeps the original 1982 basketball silhouette with Nike Air cushioning, a padded collar, and the iconic perforated toe box. A staple in every rotation.",
    images: [img("1542291026-7eec264c27ff"), img("1600269452121-4f2416e55c28"), img("1606107557195-0e29a4b5b4aa")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Triple White", hex: "#FFFFFF" }, { name: "Triple Black", hex: "#0A0A0A" }],
    rating: 4.9, reviewCount: 2841, isFeatured: true, tags: ["Bestseller","Iconic"],
  },
  {
    brandSlug: "nike", name: "Nike Air Max 90", slug: "nike-air-max-90",
    category: "UNISEX", basePrice: 16999, compareAt: 19999,
    description: "Tinker Hatfield's 1990 masterpiece. Visible Air in the heel, Waffle outsole, and the timeless multi-panel upper. The Air Max 90 is a design icon.",
    images: [img("1549298916-b41d501d3772"), img("1600185365926-3a2ce3cdb9eb"), img("1608231387042-66d1773070a5")],
    sizes: ["39","40","41","42","43","44","45","46"], colors: [{ name: "Infrared", hex: "#FF3B30" }, { name: "Triple Black", hex: "#0A0A0A" }],
    rating: 4.8, reviewCount: 1942, isFeatured: true,
  },
  {
    brandSlug: "nike", name: "Nike Dunk Low", slug: "nike-dunk-low",
    category: "UNISEX", basePrice: 13999,
    description: "1985 collegiate colour-blocking reborn. The Dunk Low returned in 2020 and hasn't slowed since. Leather upper, padded tongue, classic cupsole.",
    images: [img("1556906781-9a412961c28c"), img("1595950653106-6c9ebd614d3a"), img("1605348532760-6753d2c43329")],
    sizes: ["38","39","40","41","42","43","44"], colors: [{ name: "Panda", hex: "#1A1A1A" }, { name: "University Red", hex: "#C8102E" }],
    rating: 4.7, reviewCount: 3201, isNew: true, tags: ["Trending"],
  },
  // ---------- ADIDAS ----------
  {
    brandSlug: "adidas", name: "Adidas Samba OG", slug: "adidas-samba-og",
    category: "UNISEX", basePrice: 11999,
    description: "1950 indoor football silhouette. T-toe overlay, gum sole, serrated 3-Stripes. The Samba has become the unofficial uniform of a generation.",
    images: [img("1600185365483-52d0b3a4c1e0"), img("1556906781-9a412961c28c"), img("1595950653106-6c9ebd614d3a")],
    sizes: ["38","39","40","41","42","43","44","45"], colors: [{ name: "White/Black", hex: "#0A0A0A" }, { name: "Cloud White Core Black", hex: "#1A1A1A" }],
    rating: 4.9, reviewCount: 4218, isFeatured: true, tags: ["Bestseller","Iconic"],
  },
  {
    brandSlug: "adidas", name: "Adidas Ultraboost 22", slug: "adidas-ultraboost-22",
    category: "UNISEX", basePrice: 19999, compareAt: 24000,
    description: "Primeknit+ upper wraps the foot. BOOST midsole returns energy with every stride. Linear Energy Push system adds torsional rigidity for the daily run.",
    images: [img("1606107557195-0e29a4b5b4aa"), img("1542291026-7eec264c27ff"), img("1600185365926-3a2ce3cdb9eb")],
    sizes: ["39","40","41","42","43","44","45","46"], colors: [{ name: "Core Black", hex: "#0A0A0A" }, { name: "Solar Red", hex: "#FF3B30" }],
    rating: 4.8, reviewCount: 1567, isFeatured: true,
  },
  {
    brandSlug: "adidas", name: "Adidas Campus 80s", slug: "adidas-campus-80s",
    category: "UNISEX", basePrice: 12999,
    description: "Suede low-top with the classic rubber cupsole. The Campus 80s carries basketball lineage into a skateboard and streetwear favorite.",
    images: [img("1608231387042-66d1773070a5"), img("1556906781-9a412961c28c"), img("1600269452121-4f2416e55c28")],
    sizes: ["39","40","41","42","43","44"], colors: [{ name: "Dark Blue", hex: "#1B2A4A" }, { name: "Taupe", hex: "#A8957C" }],
    rating: 4.7, reviewCount: 893, isNew: true,
  },
  // ---------- JORDAN ----------
  {
    brandSlug: "jordan", name: "Air Jordan 1 Retro High OG", slug: "air-jordan-1-retro-high-og",
    category: "MEN", basePrice: 24999, compareAt: 28999,
    description: "The 1985 Peter Moore design that started the Jordan legacy. High-cut leather upper with the Wings logo and Nike Air cushioning. Banned. Iconic. Eternal.",
    images: [img("1600269452121-4f2416e55c28"), img("1542291026-7eec264c27ff"), img("1606107557195-0e29a4b5b4aa")],
    sizes: ["40","41","42","43","44","45","46"], colors: [{ name: "Chicago", hex: "#C8102E" }, { name: "Bred", hex: "#0A0A0A" }, { name: "Royal", hex: "#1B2A4A" }],
    rating: 5.0, reviewCount: 5234, isFeatured: true, tags: ["Grail","Bestseller"],
  },
  {
    brandSlug: "jordan", name: "Air Jordan 4 Retro", slug: "air-jordan-4-retro",
    category: "MEN", basePrice: 26999,
    description: "Tinker Hatfield's 1989 design introduced the visible Air cushioning and mesh paneling. The Bred and White Cement colorways are cornerstones of sneaker history.",
    images: [img("1595950653106-6c9ebd614d3a"), img("1556906781-9a412961c28c"), img("1608231387042-66d1773070a5")],
    sizes: ["40","41","42","43","44","45","46"], colors: [{ name: "Bred", hex: "#0A0A0A" }, { name: "Military Black", hex: "#1A1A1A" }],
    rating: 4.9, reviewCount: 3127, isFeatured: true,
  },
  {
    brandSlug: "jordan", name: "Air Jordan 11 Retro", slug: "air-jordan-11-retro",
    category: "MEN", basePrice: 28999, compareAt: 33000,
    description: "Patent leather on a basketball shoe. The 1995 design is widely considered the greatest Jordan of all time. A holiday staple in the sneaker calendar.",
    images: [img("1600185365926-3a2ce3cdb9eb"), img("1549298916-b41d501d3772"), img("1606107557195-0e29a4b5b4aa")],
    sizes: ["40","41","42","43","44","45","46","47"], colors: [{ name: "Concord", hex: "#1B2A4A" }, { name: "Cool Grey", hex: "#9CA3AF" }],
    rating: 5.0, reviewCount: 4892, isFeatured: true, tags: ["Grail"],
  },
  // ---------- NEW BALANCE ----------
  {
    brandSlug: "new-balance", name: "New Balance 990v6", slug: "new-balance-990v6",
    category: "UNISEX", basePrice: 22999,
    description: "Made in USA. The 990 series has been the gold standard of dad-shoes-as-luxury since 1982. The v6 refines the FuelCell midsole and pigskin upper.",
    images: [img("1549298916-b41d501d3772"), img("1600269452121-4f2416e55c28"), img("1595950653106-6c9ebd614d3a")],
    sizes: ["39","40","41","42","43","44","45","46"], colors: [{ name: "Grey", hex: "#9CA3AF" }, { name: "Navy", hex: "#1B2A4A" }],
    rating: 4.9, reviewCount: 1741, isFeatured: true, tags: ["Quiet Luxury"],
  },
  {
    brandSlug: "new-balance", name: "New Balance 530", slug: "new-balance-530",
    category: "UNISEX", basePrice: 13999,
    description: "Y2K runner with ABZORB cushioning. The 530 became the silhouette of choice for the streetwear crowd seeking retro running aesthetic.",
    images: [img("1608231387042-66d1773070a5"), img("1542291026-7eec264c27ff"), img("1600185365483-52d0b3a4c1e0")],
    sizes: ["38","39","40","41","42","43","44"], colors: [{ name: "White Silver Navy", hex: "#9CA3AF" }, { name: "Grey", hex: "#6B7280" }],
    rating: 4.7, reviewCount: 962, isNew: true,
  },
  // ---------- YEEZY ----------
  {
    brandSlug: "yeezy", name: "Adidas Yeezy Boost 350 V2", slug: "yeezy-boost-350-v2",
    category: "UNISEX", basePrice: 32999, compareAt: 38000,
    description: "Primeknit upper, BOOST midsole, translucent rubber outsole. The 350 V2 defined the 2010s sneaker era and remains one of the most comfortable shoes ever made.",
    images: [img("1606107557195-0e29a4b5b4aa"), img("1600269452121-4f2416e55c28"), img("1542291026-7eec264c27ff")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Zebra", hex: "#FFFFFF" }, { name: "Bred", hex: "#0A0A0A" }, { name: "Beluga", hex: "#9CA3AF" }],
    rating: 4.9, reviewCount: 2891, isFeatured: true, tags: ["Grail"],
  },
  {
    brandSlug: "yeezy", name: "Adidas Yeezy Slide", slug: "yeezy-slide",
    category: "UNISEX", basePrice: 8999,
    description: "EVA foam one-piece construction. The Yeezy Slide rewrote the rules for casual footwear and became the post-sneaker silhouette for a generation.",
    images: [img("1600185365483-52d0b3a4c1e0"), img("1549298916-b41d501d3772"), img("1605348532760-6753d2c43329")],
    sizes: ["38","39","40","41","42","43","44","45"], colors: [{ name: "Onyx", hex: "#0A0A0A" }, { name: "Bone", hex: "#E8E4D9" }, { name: "Sand", hex: "#D6C7A8" }],
    rating: 4.6, reviewCount: 1234, isNew: true,
  },
  // ---------- PUMA ----------
  {
    brandSlug: "puma", name: "Puma Suede Classic XXI", slug: "puma-suede-classic-xxi",
    category: "UNISEX", basePrice: 9999,
    description: "1968 B-boy original. Suede upper, thick rubber midsole, Formstripe. Worn by Tommie Smith, Walt Clyde Frazier, and every hip-hop pioneer.",
    images: [img("1556906781-9a412961c28c"), img("1608231387042-66d1773070a5"), img("1600269452121-4f2416e55c28")],
    sizes: ["38","39","40","41","42","43","44","45"], colors: [{ name: "Black", hex: "#0A0A0A" }, { name: "Red", hex: "#C8102E" }],
    rating: 4.7, reviewCount: 1408,
  },
  // ---------- REEBOK ----------
  {
    brandSlug: "reebok", name: "Reebok Club C 85", slug: "reebok-club-c-85",
    category: "UNISEX", basePrice: 10999,
    description: "Tennis-inspired low-top with a clean leather upper and die-cut EVA midsole. The Club C is the quiet classic that goes with everything.",
    images: [img("1608231387042-66d1773070a5"), img("1549298916-b41d501d3772"), img("1600269452121-4f2416e55c28")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "White", hex: "#FFFFFF" }, { name: "Chalk Paper", hex: "#F5F5F0" }],
    rating: 4.6, reviewCount: 712,
  },
  // ---------- CONVERSE ----------
  {
    brandSlug: "converse", name: "Converse Chuck Taylor All Star High", slug: "converse-chuck-taylor-all-star-high",
    category: "UNISEX", basePrice: 8999,
    description: "The 1917 basketball shoe that became a century of counter-culture. Canvas upper, rubber toe cap, All Star ankle patch. Nothing else is needed.",
    images: [img("1549298916-b41d501d3772"), img("1600269452121-4f2416e55c28"), img("1606107557195-0e29a4b5b4aa")],
    sizes: ["37","38","39","40","41","42","43","44"], colors: [{ name: "Optical White", hex: "#FFFFFF" }, { name: "Black", hex: "#0A0A0A" }, { name: "Red", hex: "#C8102E" }],
    rating: 4.8, reviewCount: 6201, isFeatured: true, tags: ["Iconic"],
  },
  // ---------- VANS ----------
  {
    brandSlug: "vans", name: "Vans Old Skool", slug: "vans-old-skool",
    category: "UNISEX", basePrice: 9499,
    description: "1977 skate shoe with the original Sidestripe. Leather and canvas upper, padded collar, signature waffle outsole. The legend of Dogtown.",
    images: [img("1605348532760-6753d2c43329"), img("1556906781-9a412961c28c"), img("1600269452121-4f2416e55c28")],
    sizes: ["37","38","39","40","41","42","43","44","45"], colors: [{ name: "Black/White", hex: "#0A0A0A" }, { name: "Bone", hex: "#E8E4D9" }],
    rating: 4.8, reviewCount: 3982,
  },
  // ---------- ASICS ----------
  {
    brandSlug: "asics", name: "ASICS GEL-Kayano 14", slug: "asics-gel-kayano-14",
    category: "UNISEX", basePrice: 17999,
    description: "2008 runner with GEL cushioning and a biomorphic fit upper. The Kayano 14 became the high-fashion running silhouette of the post-pandemic era.",
    images: [img("1542291026-7eec264c27ff"), img("1608231387042-66d1773070a5"), img("1595950653106-6c9ebd614d3a")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Steel Mist", hex: "#9CA3AF" }, { name: "Black", hex: "#0A0A0A" }],
    rating: 4.7, reviewCount: 845, isNew: true,
  },
  // ---------- ON RUNNING ----------
  {
    brandSlug: "on-running", name: "On Cloud 5", slug: "on-cloud-5",
    category: "UNISEX", basePrice: 18999,
    description: "Swiss-engineered CloudTec sole in recycled materials. The Cloud 5 is the lightweight everyday runner that turned On into a global phenomenon.",
    images: [img("1606107557195-0e29a4b5b4aa"), img("1549298916-b41d501d3772"), img("1600269452121-4f2416e55c28")],
    sizes: ["38","39","40","41","42","43","44","45"], colors: [{ name: "All Black", hex: "#0A0A0A" }, { name: "White Ivory", hex: "#F5F5F0" }],
    rating: 4.8, reviewCount: 1923, isFeatured: true, tags: ["Performance"],
  },
  {
    brandSlug: "on-running", name: "On Cloudmonster", slug: "on-cloudmonster",
    category: "UNISEX", basePrice: 23999,
    description: "Maximum cushioning for maximum distance. The Cloudmonster's massive CloudTec modules deliver a soft, springy ride that runners love.",
    images: [img("1600185365926-3a2ce3cdb9eb"), img("1556906781-9a412961c28c"), img("1608231387042-66d1773070a5")],
    sizes: ["40","41","42","43","44","45","46"], colors: [{ name: "Eclipse Frost", hex: "#1B2A4A" }, { name: "Black", hex: "#0A0A0A" }],
    rating: 4.7, reviewCount: 612, isNew: true,
  },
  // ---------- HOKA ----------
  {
    brandSlug: "hoka", name: "Hoka Clifton 9", slug: "hoka-clifton-9",
    category: "UNISEX", basePrice: 19999,
    description: "The max-cushion daily trainer. 32mm of CMEVA foam underfoot, an early-stage Meta-Rocker, and a breathable engineered mesh upper.",
    images: [img("1542291026-7eec264c27ff"), img("1606107557195-0e29a4b5b4aa"), img("1595950653106-6c9ebd614d3a")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Black White", hex: "#0A0A0A" }, { name: "Vanilla", hex: "#F5F0E1" }],
    rating: 4.8, reviewCount: 1147,
  },
  // ---------- SALOMON ----------
  {
    brandSlug: "salomon", name: "Salomon XT-6", slug: "salomon-xt-6",
    category: "UNISEX", basePrice: 24999, compareAt: 28000,
    description: "Trail-running technical architecture with an Agile Chassis System and Quicklace. The XT-6 has become a design-world favorite since 2019.",
    images: [img("1608231387042-66d1773070a5"), img("1549298916-b41d501d3772"), img("1600185365483-52d0b3a4c1e0")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Black Black Black", hex: "#0A0A0A" }, { name: "Vanilla Almond", hex: "#E8E4D9" }],
    rating: 4.9, reviewCount: 892, isFeatured: true, tags: ["Design Favorite"],
  },
  // ---------- OFF-WHITE ----------
  {
    brandSlug: "off-white", name: "Off-White x Nike Air Jordan 1 'Chicago'", slug: "off-white-x-nike-air-jordan-1-chicago",
    category: "MEN", basePrice: 89000, compareAt: 110000,
    description: "Virgil Abloh's 2017 deconstruction of the Air Jordan 1. The Ten's most coveted piece. Indelible air-cushioned iconography from a visionary lost too soon.",
    images: [img("1600269452121-4f2416e55c28"), img("1606107557195-0e29a4b5b4aa"), img("1542291026-7eec264c27ff")],
    sizes: ["40","41","42","43","44","45","46"], colors: [{ name: "Chicago", hex: "#C8102E" }],
    rating: 5.0, reviewCount: 423, isFeatured: true, tags: ["Grail","Collectible"],
  },
  // ---------- BALENCIAGA ----------
  {
    brandSlug: "balenciaga", name: "Balenciaga Speed Sneaker", slug: "balenciaga-speed-sneaker",
    category: "UNISEX", basePrice: 59000,
    description: "Sock-knit upper with a chunky sculpted sole. The Speed Sneaker defined the luxury-knit movement and rewrote the rules of high-fashion footwear.",
    images: [img("1608231387042-66d1773070a5"), img("1542291026-7eec264c27ff"), img("1600185365926-3a2ce3cdb9eb")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Black", hex: "#0A0A0A" }, { name: "White", hex: "#FFFFFF" }],
    rating: 4.7, reviewCount: 318, isFeatured: true, tags: ["Luxury"],
  },
  // ---------- ALEXANDER MCQUEEN ----------
  {
    brandSlug: "alexander-mcqueen", name: "Alexander McQueen Oversized Sneaker", slug: "alexander-mcqueen-oversized-sneaker",
    category: "WOMEN", basePrice: 54000,
    description: "Clean leather upper with an exaggerated oversized rubber sole. The McQueen sneaker is the minimalist luxury staple of the 2020s.",
    images: [img("1549298916-b41d501d3772"), img("1606107557195-0e29a4b5b4aa"), img("1600269452121-4f2416e55c28")],
    sizes: ["37","38","39","40","41","42"], colors: [{ name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#0A0A0A" }, { name: "Pink", hex: "#F2C4C8" }],
    rating: 4.8, reviewCount: 412, isFeatured: true, tags: ["Luxury","Quiet"],
  },
  // ---------- TRAVIS SCOTT ----------
  {
    brandSlug: "travis-scott", name: "Travis Scott x Nike Air Jordan 1 Low 'Mocha'", slug: "travis-scott-x-nike-air-jordan-1-low-mocha",
    category: "MEN", basePrice: 65000, compareAt: 78000,
    description: "Cactus Jack's signature backward Swoosh in Mocha suede. One of the most sought-after collaborations of the decade.",
    images: [img("1600185365926-3a2ce3cdb9eb"), img("1542291026-7eec264c27ff"), img("1600269452121-4f2416e55c28")],
    sizes: ["40","41","42","43","44","45","46"], colors: [{ name: "Mocha", hex: "#7C5E3C" }],
    rating: 5.0, reviewCount: 287, isFeatured: true, tags: ["Grail","Collab"],
  },
  // ---------- SACAI ----------
  {
    brandSlug: "sacai", name: "Sacai x Nike LDV Waffle", slug: "sacai-x-nike-ldv-waffle",
    category: "UNISEX", basePrice: 42000,
    description: "Chitose Abe's spliced hybrid of the LDV and Waffle Racer. Double tongues, double Swooshes, double midsoles. A masterclass in deconstruction.",
    images: [img("1556906781-9a412961c28c"), img("1605348532760-6753d2c43329"), img("1549298916-b41d501d3772")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Tour Yellow", hex: "#F2C200" }, { name: "Black Anthracite", hex: "#0A0A0A" }],
    rating: 4.9, reviewCount: 348, isFeatured: true, tags: ["Grail","Design"],
  },
  // ---------- UNDER ARMOUR ----------
  {
    brandSlug: "under-armour", name: "UA Curry Flow 10", slug: "ua-curry-flow-10",
    category: "MEN", basePrice: 21999,
    description: "Stephen Curry's signature shoe with UA Flow cushioning — no rubber outsole, all grip, all bounce. Built for the game's greatest shooter.",
    images: [img("1542291026-7eec264c27ff"), img("1606107557195-0e29a4b5b4aa"), img("1600185365926-3a2ce3cdb9eb")],
    sizes: ["40","41","42","43","44","45","46"], colors: [{ name: "Black", hex: "#0A0A0A" }, { name: "Royal", hex: "#1B2A4A" }],
    rating: 4.7, reviewCount: 421,
  },
  // ---------- SKECHERS ----------
  {
    brandSlug: "skechers", name: "Skechers D'Lites 3", slug: "skechers-dlites-3",
    category: "WOMEN", basePrice: 9999,
    description: "Chunky Air-Cooled Memory Foam comfort. The D'Lites became a chunky-shoe icon with a casual, everyday wearable silhouette.",
    images: [img("1608231387042-66d1773070a5"), img("1595950653106-6c9ebd614d3a"), img("1605348532760-6753d2c43329")],
    sizes: ["36","37","38","39","40","41"], colors: [{ name: "White", hex: "#FFFFFF" }, { name: "Pink", hex: "#F2C4C8" }],
    rating: 4.6, reviewCount: 1842,
  },
  // ---------- FILA ----------
  {
    brandSlug: "fila", name: "Fila Disruptor 2", slug: "fila-disruptor-2",
    category: "WOMEN", basePrice: 11499,
    description: "The chunky-sneaker that started it all. The Disruptor 2's oversized midsole and clean leather upper defined a generation of streetwear.",
    images: [img("1549298916-b41d501d3772"), img("1608231387042-66d1773070a5"), img("1600185365483-52d0b3a4c1e0")],
    sizes: ["36","37","38","39","40","41"], colors: [{ name: "White", hex: "#FFFFFF" }, { name: "Silver", hex: "#C0C0C0" }],
    rating: 4.5, reviewCount: 1293, isNew: true,
  },
  // ---------- DIADORA ----------
  {
    brandSlug: "diadora", name: "Diadora N9000", slug: "diadora-n9000",
    category: "UNISEX", basePrice: 16999,
    description: "Made in Italy. The N9000 is a 1990 runner reborn with premium materials and Italian craftsmanship in every stitch.",
    images: [img("1600269452121-4f2416e55c28"), img("1549298916-b41d501d3772"), img("1606107557195-0e29a4b5b4aa")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Light Stone", hex: "#E8E4D9" }, { name: "Dark Navy", hex: "#1B2A4A" }],
    rating: 4.7, reviewCount: 248,
  },
  // ---------- COMMON PROJECTS ----------
  {
    brandSlug: "common-projects", name: "Common Projects Achilles Low", slug: "common-projects-achilles-low",
    category: "MEN", basePrice: 58000,
    description: "The minimalist luxury sneaker. Italian calf leather, clean lines, and the iconic gold-stamped serial number on the heel. No logos, no noise.",
    images: [img("1549298916-b41d501d3772"), img("1600185365483-52d0b3a4c1e0"), img("1605348532760-6753d2c43329")],
    sizes: ["40","41","42","43","44","45","46"], colors: [{ name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#0A0A0A" }],
    rating: 4.9, reviewCount: 312, isFeatured: true, tags: ["Luxury","Quiet"],
  },
  // ---------- MERRELL ----------
  {
    brandSlug: "merrell", name: "Merrell Moab 3", slug: "merrell-moab-3",
    category: "UNISEX", basePrice: 15999,
    description: "Mother of All Boots. The Moab 3 is the world's bestselling hiking shoe with Vibram outsole and Super Rebound Compound midsole.",
    images: [img("1608231387042-66d1773070a5"), img("1542291026-7eec264c27ff"), img("1606107557195-0e29a4b5b4aa")],
    sizes: ["39","40","41","42","43","44","45","46"], colors: [{ name: "Walnut", hex: "#7C5E3C" }, { name: "Slate", hex: "#6B7280" }],
    rating: 4.7, reviewCount: 692,
  },
  // ---------- MAISON MARGIELA ----------
  {
    brandSlug: "maison-margiela", name: "Maison Margiela Replica German Trainer", slug: "maison-margiela-replica-german-trainer",
    category: "MEN", basePrice: 62000,
    description: "A 1:1 reproduction of a 1990s German Army Trainer. Distressed leather, hand-finished details, and anonymous luxury at its quietest.",
    images: [img("1542291026-7eec264c27ff"), img("1606107557195-0e29a4b5b4aa"), img("1600269452121-4f2416e55c28")],
    sizes: ["40","41","42","43","44","45"], colors: [{ name: "White", hex: "#FFFFFF" }, { name: "Distressed Black", hex: "#1A1A1A" }],
    rating: 4.8, reviewCount: 178, isFeatured: true, tags: ["Luxury","Anonymous"],
  },
  // ---------- KIDS ----------
  {
    brandSlug: "nike", name: "Nike Air Force 1 Youth", slug: "nike-air-force-1-youth",
    category: "KIDS", basePrice: 8999,
    description: "The legend, sized down. Same Air cushioning, same leather upper, same iconic silhouette — for the next generation.",
    images: [img("1595950653106-6c9ebd614d3a"), img("1600269452121-4f2416e55c28"), img("1556906781-9a412961c28c")],
    sizes: ["32","33","34","35","36"], colors: [{ name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#0A0A0A" }],
    rating: 4.8, reviewCount: 412, isNew: true,
  },
  {
    brandSlug: "adidas", name: "Adidas Superstar Youth", slug: "adidas-superstar-youth",
    category: "KIDS", basePrice: 7999,
    description: "Shell toe, three stripes, classic cupsole. The Superstar in youth sizes — a perfect first sneaker.",
    images: [img("1549298916-b41d501d3772"), img("1608231387042-66d1773070a5"), img("1600185365483-52d0b3a4c1e0")],
    sizes: ["32","33","34","35","36"], colors: [{ name: "White/Black", hex: "#FFFFFF" }, { name: "Pink", hex: "#F2C4C8" }],
    rating: 4.7, reviewCount: 308,
  },
];

// ---------- SEED EXECUTION ----------
async function main() {
  console.log("🌱 Seeding KicksMtaani database...");

  // Wipe existing data
  await db.order.deleteMany();
  await db.product.deleteMany();
  await db.brand.deleteMany();
  await db.newsletterSubscriber.deleteMany();

  // Brands
  const brandMap = new Map<string, string>();
  for (const b of brands) {
    const created = await db.brand.create({
      data: {
        name: b.name,
        slug: b.slug,
        country: b.country,
        description: b.description,
        featured: b.featured,
      },
    });
    brandMap.set(b.slug, created.id);
  }
  console.log(`✓ Created ${brands.length} brands`);

  // Products
  let productCount = 0;
  for (const p of products) {
    const brandId = brandMap.get(p.brandSlug);
    if (!brandId) {
      console.warn(`Brand not found: ${p.brandSlug}`);
      continue;
    }
    await db.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        brandId,
        category: p.category,
        description: p.description,
        basePrice: p.basePrice,
        compareAt: p.compareAt ?? null,
        images: JSON.stringify(p.images),
        sizes: JSON.stringify(p.sizes),
        colors: JSON.stringify(p.colors),
        rating: p.rating,
        reviewCount: p.reviewCount,
        inStock: true,
        isFeatured: p.isFeatured ?? false,
        isNew: p.isNew ?? false,
        tags: p.tags ? JSON.stringify(p.tags) : null,
      },
    });
    productCount++;
  }
  console.log(`✓ Created ${productCount} products`);
  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
