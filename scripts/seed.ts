// KicksMtaani Seed Script
// Seeds the database with 25+ sneaker brands and 50+ realistic products.
// Run with: bun run db:seed

import { PrismaClient } from "@prisma/client";

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

  // ================================================================
  // EXPANDED INVENTORY — 65+ more products
  // ================================================================

  // ---------- MORE AIR JORDANS ----------
  {
    brandSlug: "jordan", name: "Air Jordan 3 Retro 'White Cement'", slug: "air-jordan-3-white-cement",
    category: "MEN", basePrice: 27999, compareAt: 32000,
    description: "Tinker Hatfield's 1988 design introduced elephant print and the Jumpman logo. The White Cement is the silhouette that saved Jordan Brand.",
    images: [img("1600269452121-4f2416e55c28"), img("1549298916-b41d501d3772"), img("1606107557195-0e29a4b5b4aa")],
    sizes: ["40","41","42","43","44","45","46"], colors: [{ name: "White Cement", hex: "#F5F5F0" }, { name: "Black Cement", hex: "#0A0A0A" }],
    rating: 4.9, reviewCount: 1842, isFeatured: true, tags: ["Grail","Iconic"],
  },
  {
    brandSlug: "jordan", name: "Air Jordan 4 Retro 'Military Black'", slug: "air-jordan-4-military-black",
    category: "MEN", basePrice: 26999,
    description: "The Military Black colorway returns. Premium nubuck upper, visible Air cushioning, and the iconic mesh side panels.",
    images: [img("1556906781-9a412961c28c"), img("1600269452121-4f2416e55c28"), img("1606107557195-0e29a4b5b4aa")],
    sizes: ["40","41","42","43","44","45","46"], colors: [{ name: "Military Black", hex: "#1A1A1A" }],
    rating: 4.8, reviewCount: 967, isNew: true,
  },
  {
    brandSlug: "jordan", name: "Air Jordan 5 Retro 'Grape'", slug: "air-jordan-5-grape",
    category: "MEN", basePrice: 26999,
    description: "1990 design inspired by WWII fighter planes. Reflective tongue, shark teeth midsole, and the legendary Grape colorway.",
    images: [img("1595950653106-6c9ebd614d3a"), img("1600185365483-52d0b3a4c1e0"), img("1549298916-b41d501d3772")],
    sizes: ["40","41","42","43","44","45","46"], colors: [{ name: "Grape", hex: "#7B3F9C" }, { name: "Fire Red", hex: "#C8102E" }],
    rating: 4.8, reviewCount: 612,
  },
  {
    brandSlug: "jordan", name: "Air Jordan 6 Retro 'Carmine'", slug: "air-jordan-6-carmine",
    category: "MEN", basePrice: 27999,
    description: "The first Jordan with a molded back tab and lace locks. The Carmine colorway is one of the most sought-after 6s ever.",
    images: [img("1608231387042-66d1773070a5"), img("1600269452121-4f2416e55c28"), img("1542291026-7eec264c27ff")],
    sizes: ["40","41","42","43","44","45","46"], colors: [{ name: "Carmine", hex: "#C8102E" }],
    rating: 4.7, reviewCount: 489, isNew: true,
  },
  {
    brandSlug: "jordan", name: "Air Jordan 11 Retro 'Cool Grey'", slug: "air-jordan-11-cool-grey",
    category: "MEN", basePrice: 28999, compareAt: 33000,
    description: "Patent leather masterpiece in Cool Grey. The 11 is widely considered the greatest Jordan silhouette of all time.",
    images: [img("1600185365926-3a2ce3cdb9eb"), img("1549298916-b41d501d3772"), img("1606107557195-0e29a4b5b4aa")],
    sizes: ["40","41","42","43","44","45","46","47"], colors: [{ name: "Cool Grey", hex: "#9CA3AF" }],
    rating: 5.0, reviewCount: 1287, isFeatured: true, tags: ["Grail"],
  },
  {
    brandSlug: "jordan", name: "Jordan 1 Low 'Shadow'", slug: "jordan-1-low-shadow",
    category: "UNISEX", basePrice: 13999,
    description: "The low-top version of the iconic Jordan 1. Black and grey colorway that goes with everything.",
    images: [img("1605348532760-6753d2c43329"), img("1549298916-b41d501d3772"), img("1600185365483-52d0b3a4c1e0")],
    sizes: ["38","39","40","41","42","43","44"], colors: [{ name: "Shadow", hex: "#6B7280" }],
    rating: 4.6, reviewCount: 423,
  },
  {
    brandSlug: "jordan", name: "Air Jordan 1 Mid 'Bred Toe'", slug: "air-jordan-1-mid-bred-toe",
    category: "UNISEX", basePrice: 15999,
    description: "The Mid silhouette in the coveted Bred Toe colorway. Black, red, and white panels on premium leather.",
    images: [img("1556906781-9a412961c28c"), img("1605348532760-6753d2c43329"), img("1595950653106-6c9ebd614d3a")],
    sizes: ["38","39","40","41","42","43","44","45"], colors: [{ name: "Bred Toe", hex: "#C8102E" }],
    rating: 4.5, reviewCount: 678, isNew: true,
  },

  // ---------- MORE NIKE DUNKS ----------
  {
    brandSlug: "nike", name: "Nike Dunk Low 'Panda'", slug: "nike-dunk-low-panda",
    category: "UNISEX", basePrice: 13999, compareAt: 16500,
    description: "The Panda Dunk. Black and white colorway that became 2022's most-worn sneaker. Still going strong.",
    images: [img("1556906781-9a412961c28c"), img("1595950653106-6c9ebd614d3a"), img("1605348532760-6753d2c43329")],
    sizes: ["38","39","40","41","42","43","44"], colors: [{ name: "Panda", hex: "#0A0A0A" }],
    rating: 4.8, reviewCount: 5821, isFeatured: true, tags: ["Bestseller","Trending"],
  },
  {
    brandSlug: "nike", name: "Nike Dunk Low 'UNC'", slug: "nike-dunk-low-unc",
    category: "UNISEX", basePrice: 14999,
    description: "University Blue and white. The UNC Dunk Low is a clean colorway inspired by Michael Jordan's alma mater.",
    images: [img("1600269452121-4f2416e55c28"), img("1542291026-7eec264c27ff"), img("1606107557195-0e29a4b5b4aa")],
    sizes: ["38","39","40","41","42","43","44"], colors: [{ name: "UNC", hex: "#7BAEDB" }],
    rating: 4.7, reviewCount: 1834, isNew: true,
  },
  {
    brandSlug: "nike", name: "Nike Dunk Low 'Kentucky'", slug: "nike-dunk-low-kentucky",
    category: "UNISEX", basePrice: 14999,
    description: "2020 retro of the 1985 Kentucky collegiate colorway. Royal blue overlays on white leather.",
    images: [img("1595950653106-6c9ebd614d3a"), img("1556906781-9a412961c28c"), img("1608231387042-66d1773070a5")],
    sizes: ["38","39","40","41","42","43","44"], colors: [{ name: "Kentucky", hex: "#1B2A4A" }],
    rating: 4.7, reviewCount: 967,
  },
  {
    brandSlug: "nike", name: "Nike Dunk Low 'Syracuse'", slug: "nike-dunk-low-syracuse",
    category: "UNISEX", basePrice: 14999,
    description: "Orange and white collegiate colorway from the 1985 Be True to Your School series.",
    images: [img("1605348532760-6753d2c43329"), img("1549298916-b41d501d3772"), img("1600185365483-52d0b3a4c1e0")],
    sizes: ["38","39","40","41","42","43","44"], colors: [{ name: "Syracuse", hex: "#FF7F27" }],
    rating: 4.6, reviewCount: 712, isNew: true,
  },
  {
    brandSlug: "nike", name: "Nike Dunk High '1985'", slug: "nike-dunk-high-1985",
    category: "UNISEX", basePrice: 15999,
    description: "The high-top Dunk returns in its original 1985 form. Padded collar, classic color-blocking, retro cool.",
    images: [img("1608231387042-66d1773070a5"), img("1600269452121-4f2416e55c28"), img("1542291026-7eec264c27ff")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Varsity Red", hex: "#C8102E" }, { name: "Royal", hex: "#1B2A4A" }],
    rating: 4.7, reviewCount: 543,
  },
  {
    brandSlug: "nike", name: "Nike Air Max 1 'Patta Waves'", slug: "nike-air-max-1-patta-waves",
    category: "UNISEX", basePrice: 22999, compareAt: 26000,
    description: "Patta x Nike Air Max 1 in the legendary Waves colorway. One of the most coveted AM1 collabs of the decade.",
    images: [img("1549298916-b41d501d3772"), img("1600185365483-52d0b3a4c1e0"), img("1608231387042-66d1773070a5")],
    sizes: ["40","41","42","43","44","45"], colors: [{ name: "Waves Monarch", hex: "#F2C200" }],
    rating: 4.9, reviewCount: 234, isFeatured: true, tags: ["Collab","Grail"],
  },
  {
    brandSlug: "nike", name: "Nike Blazer Mid '77", slug: "nike-blazer-mid-77",
    category: "UNISEX", basePrice: 11999,
    description: "1977 basketball silhouette. Vintage leather, exposed foam, oversized Swoosh. The Blazer is timeless.",
    images: [img("1606107557195-0e29a4b5b4aa"), img("1595950653106-6c9ebd614d3a"), img("1549298916-b41d501d3772")],
    sizes: ["38","39","40","41","42","43","44","45"], colors: [{ name: "White/Black", hex: "#FFFFFF" }, { name: "Vintage Yellow", hex: "#F2C200" }],
    rating: 4.6, reviewCount: 891,
  },

  // ---------- MORE YEEZY ----------
  {
    brandSlug: "yeezy", name: "Adidas Yeezy Boost 350 V2 'Bred'", slug: "yeezy-boost-350-v2-bred",
    category: "UNISEX", basePrice: 34999, compareAt: 40000,
    description: "The all-black Bred colorway. Primeknit upper with SPLY-350 branding and a full-length BOOST midsole.",
    images: [img("1606107557195-0e29a4b5b4aa"), img("1600269452121-4f2416e55c28"), img("1542291026-7eec264c27ff")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Bred", hex: "#0A0A0A" }],
    rating: 4.9, reviewCount: 1432, isFeatured: true, tags: ["Grail"],
  },
  {
    brandSlug: "yeezy", name: "Adidas Yeezy Boost 350 V2 'Beluga'", slug: "yeezy-boost-350-v2-beluga",
    category: "UNISEX", basePrice: 32999,
    description: "Grey Primeknit with the bold orange SPLY-350 stripe. The Beluga is one of the most recognizable Yeezys ever.",
    images: [img("1600185365483-52d0b3a4c1e0"), img("1606107557195-0e29a4b5b4aa"), img("1549298916-b41d501d3772")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Beluga", hex: "#9CA3AF" }],
    rating: 4.8, reviewCount: 1023,
  },
  {
    brandSlug: "yeezy", name: "Adidas Yeezy Boost 350 V2 'Zebra'", slug: "yeezy-boost-350-v2-zebra",
    category: "UNISEX", basePrice: 33999,
    description: "Black and white zebra-striped Primeknit with red SPLY-350. One of the most-hyped Yeezys of all time.",
    images: [img("1542291026-7eec264c27ff"), img("1605348532760-6753d2c43329"), img("1608231387042-66d1773070a5")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Zebra", hex: "#FFFFFF" }],
    rating: 4.9, reviewCount: 1187, isFeatured: true, tags: ["Grail"],
  },
  {
    brandSlug: "yeezy", name: "Adidas Yeezy Boost 700 'Wave Runner'", slug: "yeezy-boost-700-wave-runner",
    category: "UNISEX", basePrice: 29999,
    description: "The dad shoe that started it all. Chunky midsole, layered upper, and the iconic Wave Runner colorway.",
    images: [img("1608231387042-66d1773070a5"), img("1549298916-b41d501d3772"), img("1600269452121-4f2416e55c28")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Wave Runner", hex: "#9CA3AF" }],
    rating: 4.7, reviewCount: 645, isNew: true,
  },
  {
    brandSlug: "yeezy", name: "Adidas Yeezy Foam Runner 'Onyx'", slug: "yeezy-foam-runner-onyx",
    category: "UNISEX", basePrice: 12999,
    description: "EVA foam one-piece construction in Onyx black. The Foam Runner redefined casual footwear.",
    images: [img("1595950653106-6c9ebd614d3a"), img("1605348532760-6753d2c43329"), img("1600185365483-52d0b3a4c1e0")],
    sizes: ["38","39","40","41","42","43","44","45"], colors: [{ name: "Onyx", hex: "#0A0A0A" }, { name: "Sand", hex: "#D6C7A8" }],
    rating: 4.6, reviewCount: 892, isNew: true,
  },
  {
    brandSlug: "yeezy", name: "Adidas Yeezy 450 'Cloud White'", slug: "yeezy-450-cloud-white",
    category: "UNISEX", basePrice: 27999,
    description: "The 450's alien-like sculpted sole and sock-like upper made it one of Yeezy's most divisive and beloved designs.",
    images: [img("1600185365926-3a2ce3cdb9eb"), img("1606107557195-0e29a4b5b4aa"), img("1542291026-7eec264c27ff")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Cloud White", hex: "#FFFFFF" }],
    rating: 4.5, reviewCount: 234, isNew: true,
  },

  // ---------- MORE LUXURY ----------
  {
    brandSlug: "balenciaga", name: "Balenciaga Triple S", slug: "balenciaga-triple-s",
    category: "MEN", basePrice: 78000, compareAt: 92000,
    description: "The chunky sneaker that defined an era. Triple-stacked midsole, distressed leather, and unmistakable Balenciaga branding.",
    images: [img("1549298916-b41d501d3772"), img("1608231387042-66d1773070a5"), img("1600269452121-4f2416e55c28")],
    sizes: ["40","41","42","43","44","45","46"], colors: [{ name: "Black", hex: "#0A0A0A" }, { name: "Cream", hex: "#F5F0E1" }],
    rating: 4.7, reviewCount: 412, isFeatured: true, tags: ["Luxury","Chunky"],
  },
  {
    brandSlug: "balenciaga", name: "Balenciaga Track Sneaker", slug: "balenciaga-track-sneaker",
    category: "MEN", basePrice: 72000,
    description: "96 layered panels creating a deconstructed running silhouette. The Track is Balenciaga's most complex sneaker.",
    images: [img("1608231387042-66d1773070a5"), img("1600185365483-52d0b3a4c1e0"), img("1595950653106-6c9ebd614d3a")],
    sizes: ["40","41","42","43","44","45"], colors: [{ name: "Black", hex: "#0A0A0A" }, { name: "White", hex: "#FFFFFF" }],
    rating: 4.6, reviewCount: 187, isNew: true,
  },
  {
    brandSlug: "maison-margiela", name: "Maison Margiela Replica 'Painted'", slug: "maison-margiela-replica-painted",
    category: "MEN", basePrice: 68000,
    description: "The Replica with a hand-painted distressed finish. Each pair is unique. Anonymous luxury at its most artistic.",
    images: [img("1542291026-7eec264c27ff"), img("1606107557195-0e29a4b5b4aa"), img("1600185365483-52d0b3a4c1e0")],
    sizes: ["40","41","42","43","44","45"], colors: [{ name: "Painted White", hex: "#F5F5F0" }],
    rating: 4.8, reviewCount: 142, isFeatured: true, tags: ["Luxury"],
  },
  {
    brandSlug: "alexander-mcqueen", name: "Alexander McQueen Oversized 'Pink'", slug: "alexander-mcqueen-oversized-pink",
    category: "WOMEN", basePrice: 54000,
    description: "The Oversized silhouette in soft pink leather with a chunky white sole. Quiet luxury with a touch of color.",
    images: [img("1549298916-b41d501d3772"), img("1605348532760-6753d2c43329"), img("1608231387042-66d1773070a5")],
    sizes: ["36","37","38","39","40","41"], colors: [{ name: "Ballet Pink", hex: "#F2C4C8" }],
    rating: 4.8, reviewCount: 287, isNew: true,
  },
  {
    brandSlug: "common-projects", name: "Common Projects Achilles Low 'Black'", slug: "common-projects-achilles-low-black",
    category: "MEN", basePrice: 58000,
    description: "The Achilles Low in black calf leather. The minimalist luxury sneaker with the iconic gold-stamped serial number.",
    images: [img("1549298916-b41d501d3772"), img("1600269452121-4f2416e55c28"), img("1606107557195-0e29a4b5b4aa")],
    sizes: ["40","41","42","43","44","45","46"], colors: [{ name: "Black", hex: "#0A0A0A" }],
    rating: 4.9, reviewCount: 198, tags: ["Luxury","Quiet"],
  },
  {
    brandSlug: "common-projects", name: "Common Projects Tournament Low", slug: "common-projects-tournament-low",
    category: "MEN", basePrice: 62000,
    description: "The Tournament Low. Suede and leather panels on a vintage tennis silhouette. Italian craftsmanship throughout.",
    images: [img("1600185365483-52d0b3a4c1e0"), img("1608231387042-66d1773070a5"), img("1549298916-b41d501d3772")],
    sizes: ["40","41","42","43","44","45"], colors: [{ name: "Bone", hex: "#E8E4D9" }, { name: "Navy", hex: "#1B2A4A" }],
    rating: 4.8, reviewCount: 96, isNew: true,
  },
  {
    brandSlug: "off-white", name: "Off-White x Nike Dunk Low 'Lot 01'", slug: "off-white-x-nike-dunk-low-lot-01",
    category: "UNISEX", basePrice: 52000,
    description: "Virgil Abloh's 50-pair Dunk Lot release. Lot 01 in green with signature Off-White detailing and zip-tie.",
    images: [img("1605348532760-6753d2c43329"), img("1549298916-b41d501d3772"), img("1600269452121-4f2416e55c28")],
    sizes: ["40","41","42","43","44","45"], colors: [{ name: "Lot 01 Green", hex: "#3B7A57" }],
    rating: 4.9, reviewCount: 156, isFeatured: true, tags: ["Grail","Collab"],
  },

  // ---------- MORE RUNNING ----------
  {
    brandSlug: "hoka", name: "Hoka Bondi 8", slug: "hoka-bondi-8",
    category: "UNISEX", basePrice: 21999,
    description: "The most cushioned Hoka. 39mm of stack height for a plush, comfortable ride on any distance.",
    images: [img("1606107557195-0e29a4b5b4aa"), img("1542291026-7eec264c27ff"), img("1595950653106-6c9ebd614d3a")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Black", hex: "#0A0A0A" }, { name: "White", hex: "#FFFFFF" }],
    rating: 4.8, reviewCount: 823, isNew: true,
  },
  {
    brandSlug: "hoka", name: "Hoka Speedgoat 5", slug: "hoka-speedgoat-5",
    category: "UNISEX", basePrice: 23999,
    description: "Trail-running icon named after Karl Meltzer. Vibram Megagrip outsole, aggressive lugs, max cushioning.",
    images: [img("1608231387042-66d1773070a5"), img("1549298916-b41d501d3772"), img("1600185365483-52d0b3a4c1e0")],
    sizes: ["39","40","41","42","43","44","45","46"], colors: [{ name: "Forest", hex: "#3B5C3A" }, { name: "Coral", hex: "#FF6B5C" }],
    rating: 4.8, reviewCount: 412,
  },
  {
    brandSlug: "on-running", name: "On Cloudboom Echo 3", slug: "on-cloudboom-echo-3",
    category: "UNISEX", basePrice: 32999,
    description: "Carbon-plated marathon racer. Swiss engineering, CloudTec cushioning, and a propulsive ride for PRs.",
    images: [img("1600185365926-3a2ce3cdb9eb"), img("1606107557195-0e29a4b5b4aa"), img("1556906781-9a412961c28c")],
    sizes: ["40","41","42","43","44","45","46"], colors: [{ name: "Eclipse Frost", hex: "#1B2A4A" }, { name: "Sand", hex: "#D6C7A8" }],
    rating: 4.7, reviewCount: 234, isFeatured: true, tags: ["Performance","Marathon"],
  },
  {
    brandSlug: "on-running", name: "On Cloud X", slug: "on-cloud-x",
    category: "UNISEX", basePrice: 19999,
    description: "Versatile training shoe for runs, gym, and everything between. Engineered mesh upper, CloudTec cushioning.",
    images: [img("1542291026-7eec264c27ff"), img("1606107557195-0e29a4b5b4aa"), img("1595950653106-6c9ebd614d3a")],
    sizes: ["38","39","40","41","42","43","44","45"], colors: [{ name: "Black", hex: "#0A0A0A" }, { name: "Haze", hex: "#9CA3AF" }],
    rating: 4.7, reviewCount: 678,
  },
  {
    brandSlug: "asics", name: "ASICS Gel-Nimbus 26", slug: "asics-gel-nimbus-26",
    category: "UNISEX", basePrice: 21999,
    description: "Premium daily trainer with FF Blast+ Eco cushioning and PureGel for unmatched comfort on long runs.",
    images: [img("1608231387042-66d1773070a5"), img("1549298916-b41d501d3772"), img("1600185365483-52d0b3a4c1e0")],
    sizes: ["39","40","41","42","43","44","45","46"], colors: [{ name: "Black", hex: "#0A0A0A" }, { name: "Aquamarine", hex: "#7BAEDB" }],
    rating: 4.8, reviewCount: 567, isNew: true,
  },
  {
    brandSlug: "asics", name: "ASICS Gel-1130", slug: "asics-gel-1130",
    category: "UNISEX", basePrice: 13999,
    description: "Y2K runner with GEL cushioning and mesh upper. The 1130 has become a streetwear favorite for its retro aesthetic.",
    images: [img("1595950653106-6c9ebd614d3a"), img("1556906781-9a412961c28c"), img("1605348532760-6753d2c43329")],
    sizes: ["38","39","40","41","42","43","44"], colors: [{ name: "Cream Black", hex: "#E8E4D9" }, { name: "Glacier Grey", hex: "#9CA3AF" }],
    rating: 4.6, reviewCount: 423, isNew: true,
  },
  {
    brandSlug: "new-balance", name: "New Balance Fresh Foam X 1080v13", slug: "new-balance-fresh-foam-x-1080v13",
    category: "UNISEX", basePrice: 23999,
    description: "The most cushioned Fresh Foam. Premium daily trainer with a plush ride and breathable Hypoknit upper.",
    images: [img("1542291026-7eec264c27ff"), img("1608231387042-66d1773070a5"), img("1606107557195-0e29a4b5b4aa")],
    sizes: ["39","40","41","42","43","44","45","46"], colors: [{ name: "Black", hex: "#0A0A0A" }, { name: "Lunar Bleach", hex: "#F5F0E1" }],
    rating: 4.8, reviewCount: 891,
  },
  {
    brandSlug: "new-balance", name: "New Balance 9060", slug: "new-balance-9060",
    category: "UNISEX", basePrice: 19999,
    description: "Y2K-inspired design with ABZORB and SBS cushioning. The 9060 is the modern evolution of the 990 series.",
    images: [img("1600269452121-4f2416e55c28"), img("1608231387042-66d1773070a5"), img("1595950653106-6c9ebd614d3a")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Sea Salt", hex: "#F5F5F0" }, { name: "Phantom", hex: "#1A1A1A" }],
    rating: 4.7, reviewCount: 612, isNew: true,
  },

  // ---------- MORE KIDS ----------
  {
    brandSlug: "jordan", name: "Jordan 1 Retro High OG 'GS'", slug: "jordan-1-retro-high-og-gs",
    category: "KIDS", basePrice: 14999,
    description: "The iconic Jordan 1 High in grade-school sizes. Same design, same heritage — for the next generation of ballers.",
    images: [img("1595950653106-6c9ebd614d3a"), img("1600269452121-4f2416e55c28"), img("1556906781-9a412961c28c")],
    sizes: ["32","33","34","35","36","37"], colors: [{ name: "Bred", hex: "#C8102E" }, { name: "Chicago", hex: "#FFFFFF" }],
    rating: 4.8, reviewCount: 287, isNew: true,
  },
  {
    brandSlug: "new-balance", name: "New Balance 327 'Youth'", slug: "new-balance-327-youth",
    category: "KIDS", basePrice: 8499,
    description: "Retro runner silhouette sized for kids. Sawtooth outsole, oversized N, and 70s running aesthetic.",
    images: [img("1605348532760-6753d2c43329"), img("1549298916-b41d501d3772"), img("1608231387042-66d1773070a5")],
    sizes: ["32","33","34","35","36"], colors: [{ name: "Sea Salt", hex: "#F5F5F0" }, { name: "Black", hex: "#0A0A0A" }],
    rating: 4.6, reviewCount: 156,
  },
  {
    brandSlug: "adidas", name: "Adidas Samba Youth", slug: "adidas-samba-youth",
    category: "KIDS", basePrice: 7499,
    description: "The Samba OG in youth sizes. Classic T-toe, gum sole, and three stripes — sized down for the next generation.",
    images: [img("1549298916-b41d501d3772"), img("1600185365483-52d0b3a4c1e0"), img("1608231387042-66d1773070a5")],
    sizes: ["32","33","34","35","36"], colors: [{ name: "White/Black", hex: "#FFFFFF" }],
    rating: 4.7, reviewCount: 198, isNew: true,
  },
  {
    brandSlug: "vans", name: "Vans Old Skool Youth", slug: "vans-old-skool-youth",
    category: "KIDS", basePrice: 6999,
    description: "The Sidestripe classic in youth sizes. Durable canvas and suede upper with the waffle outsole.",
    images: [img("1605348532760-6753d2c43329"), img("1556906781-9a412961c28c"), img("1595950653106-6c9ebd614d3a")],
    sizes: ["32","33","34","35","36"], colors: [{ name: "Black/White", hex: "#0A0A0A" }, { name: "Checkerboard", hex: "#FFFFFF" }],
    rating: 4.7, reviewCount: 234,
  },

  // ---------- MORE ADIDAS ----------
  {
    brandSlug: "adidas", name: "Adidas Gazelle Indoor", slug: "adidas-gazelle-indoor",
    category: "UNISEX", basePrice: 12999,
    description: "1968 indoor football silhouette reborn. Suede upper, T-toe, gum sole. The Gazelle is the quiet classic of the moment.",
    images: [img("1608231387042-66d1773070a5"), img("1595950653106-6c9ebd614d3a"), img("1600269452121-4f2416e55c28")],
    sizes: ["38","39","40","41","42","43","44"], colors: [{ name: "Bliss Pink", hex: "#F2C4C8" }, { name: "Collegiate Green", hex: "#3B5C3A" }],
    rating: 4.7, reviewCount: 645, isNew: true,
  },
  {
    brandSlug: "adidas", name: "Adidas Stan Smith", slug: "adidas-stan-smith",
    category: "UNISEX", basePrice: 10999, compareAt: 12999,
    description: "The 1971 tennis icon. Clean leather upper, perforated three stripes, and Stan Smith's portrait on the tongue.",
    images: [img("1549298916-b41d501d3772"), img("1608231387042-66d1773070a5"), img("1600185365483-52d0b3a4c1e0")],
    sizes: ["38","39","40","41","42","43","44","45"], colors: [{ name: "Footwear White", hex: "#FFFFFF" }, { name: "Cloud White Green", hex: "#3B5C3A" }],
    rating: 4.7, reviewCount: 2871,
  },
  {
    brandSlug: "adidas", name: "Adidas Ultra Boost 1.0", slug: "adidas-ultra-boost-1-0",
    category: "UNISEX", basePrice: 20999,
    description: "The 2015 original returns. Primeknit upper, full-length BOOST, Torsion System. The 1.0 is the purist's Ultra Boost.",
    images: [img("1606107557195-0e29a4b5b4aa"), img("1542291026-7eec264c27ff"), img("1600185365926-3a2ce3cdb9eb")],
    sizes: ["39","40","41","42","43","44","45","46"], colors: [{ name: "Core Black", hex: "#0A0A0A" }, { name: "Triple White", hex: "#FFFFFF" }],
    rating: 4.8, reviewCount: 1234,
  },
  {
    brandSlug: "adidas", name: "Adidas Adimolar", slug: "adidas-adimolar",
    category: "UNISEX", basePrice: 9999,
    description: "Preppy tennis aesthetic with a modern twist. Suede overlays, leather upper, and a vintage-inspired cupsole.",
    images: [img("1556906781-9a412961c28c"), img("1605348532760-6753d2c43329"), img("1595950653106-6c9ebd614d3a")],
    sizes: ["38","39","40","41","42","43","44"], colors: [{ name: "Wonder Beige", hex: "#E8E4D9" }, { name: "Black", hex: "#0A0A0A" }],
    rating: 4.5, reviewCount: 312, isNew: true,
  },

  // ---------- MORE NIKE ----------
  {
    brandSlug: "nike", name: "Nike Air Max 97 'Silver Bullet'", slug: "nike-air-max-97-silver-bullet",
    category: "UNISEX", basePrice: 19999, compareAt: 23000,
    description: "1997 design inspired by Japanese bullet trains. Reflective silver upper with full-length visible Air.",
    images: [img("1542291026-7eec264c27ff"), img("1600269452121-4f2416e55c28"), img("1606107557195-0e29a4b5b4aa")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Silver Bullet", hex: "#C0C0C0" }, { name: "Triple Black", hex: "#0A0A0A" }],
    rating: 4.8, reviewCount: 1567, isFeatured: true, tags: ["Iconic"],
  },
  {
    brandSlug: "nike", name: "Nike Air Max 270", slug: "nike-air-max-270",
    category: "UNISEX", basePrice: 16999,
    description: "The first lifestyle Air Max. 270 degrees of visible Air in the heel for all-day comfort and street-ready style.",
    images: [img("1600185365483-52d0b3a4c1e0"), img("1606107557195-0e29a4b5b4aa"), img("1595950653106-6c9ebd614d3a")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Triple Black", hex: "#0A0A0A" }, { name: "Pure Platinum", hex: "#9CA3AF" }],
    rating: 4.6, reviewCount: 892,
  },
  {
    brandSlug: "nike", name: "Nike Cortez 'Forrest Gump'", slug: "nike-cortez-forrest-gump",
    category: "UNISEX", basePrice: 8999,
    description: "1972 running icon. Made famous by Forrest Gump. Leather upper, herringbone outsole, timeless silhouette.",
    images: [img("1608231387042-66d1773070a5"), img("1549298916-b41d501d3772"), img("1600269452121-4f2416e55c28")],
    sizes: ["38","39","40","41","42","43","44"], colors: [{ name: "Forrest Gump", hex: "#C8102E" }, { name: "White Varsity Royal", hex: "#1B2A4A" }],
    rating: 4.6, reviewCount: 423,
  },

  // ---------- MORE TRAVIS SCOTT / SACAI ----------
  {
    brandSlug: "travis-scott", name: "Travis Scott x Nike Air Jordan 1 Low 'Reverse Mocha'", slug: "travis-scott-x-nike-air-jordan-1-low-reverse-mocha",
    category: "MEN", basePrice: 62000, compareAt: 75000,
    description: "The Reverse Mocha Low — Cactus Jack's signature backward Swoosh in premium brown suede. One of the most coveted Lows ever.",
    images: [img("1600185365926-3a2ce3cdb9eb"), img("1542291026-7eec264c27ff"), img("1600269452121-4f2416e55c28")],
    sizes: ["40","41","42","43","44","45","46"], colors: [{ name: "Reverse Mocha", hex: "#7C5E3C" }],
    rating: 5.0, reviewCount: 312, isFeatured: true, tags: ["Grail","Collab"],
  },
  {
    brandSlug: "travis-scott", name: "Travis Scott x Nike Air Jordan 4 'Cactus Jack'", slug: "travis-scott-x-nike-air-jordan-4-cactus-jack",
    category: "MEN", basePrice: 72000,
    description: "The Cactus Jack AJ4. Olive suede upper, Travis's signature backwards tongue tag, and a hidden glow-in-the-dark outsole.",
    images: [img("1556906781-9a412961c28c"), img("1600269452121-4f2416e55c28"), img("1606107557195-0e29a4b5b4aa")],
    sizes: ["40","41","42","43","44","45","46"], colors: [{ name: "Cactus Jack Olive", hex: "#3B5C3A" }],
    rating: 5.0, reviewCount: 198, isFeatured: true, tags: ["Grail","Collab"],
  },
  {
    brandSlug: "sacai", name: "Sacai x Nike Cortez 4.0", slug: "sacai-x-nike-cortez-4-0",
    category: "UNISEX", basePrice: 38000,
    description: "Chitose Abe's hybrid Cortez 4.0. Double Swooshes, spliced midsole, and a deconstructed aesthetic that defined an era.",
    images: [img("1595950653106-6c9ebd614d3a"), img("1605348532760-6753d2c43329"), img("1549298916-b41d501d3772")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Malachite", hex: "#3B7A57" }, { name: "Phantom", hex: "#1A1A1A" }],
    rating: 4.8, reviewCount: 187, isNew: true, tags: ["Collab","Design"],
  },
  {
    brandSlug: "sacai", name: "Sacai x Nike Vaporwaffle", slug: "sacai-x-nike-vaporwaffle",
    category: "UNISEX", basePrice: 39999,
    description: "The Vaporwaffle continues Sacai's deconstruction of Nike running silhouettes. Double tongues, double Swooshes, double midsoles.",
    images: [img("1608231387042-66d1773070a5"), img("1556906781-9a412961c28c"), img("1600185365483-52d0b3a4c1e0")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Sail Venom Red", hex: "#C8102E" }, { name: "Black Anthracite", hex: "#0A0A0A" }],
    rating: 4.8, reviewCount: 234, isFeatured: true, tags: ["Collab","Design"],
  },

  // ---------- MORE WOMEN'S ----------
  {
    brandSlug: "nike", name: "Nike Air Force 1 Shadow 'Pastel'", slug: "nike-air-force-1-shadow-pastel",
    category: "WOMEN", basePrice: 15999,
    description: "The AF1 Shadow doubles down on layers. Pastel colorway with a chunkier, more feminine take on the classic.",
    images: [img("1549298916-b41d501d3772"), img("1605348532760-6753d2c43329"), img("1600185365483-52d0b3a4c1e0")],
    sizes: ["36","37","38","39","40","41"], colors: [{ name: "Pastel Pink", hex: "#F2C4C8" }, { name: "Pastel Blue", hex: "#7BAEDB" }],
    rating: 4.7, reviewCount: 412, isNew: true,
  },
  {
    brandSlug: "adidas", name: "Adidas Forum Low 'Women'", slug: "adidas-forum-low-women",
    category: "WOMEN", basePrice: 12999,
    description: "1984 basketball icon with the signature X-strap. The Forum Low in women's sizing — vintage court style.",
    images: [img("1608231387042-66d1773070a5"), img("1549298916-b41d501d3772"), img("1600269452121-4f2416e55c28")],
    sizes: ["36","37","38","39","40","41"], colors: [{ name: "Cloud White", hex: "#FFFFFF" }, { name: "Wonder Beige", hex: "#E8E4D9" }],
    rating: 4.6, reviewCount: 234,
  },
  {
    brandSlug: "puma", name: "Puma Carina 'Women'", slug: "puma-carina-women",
    category: "WOMEN", basePrice: 8999,
    description: "Retro court silhouette for women. Soft leather upper, thick platform midsole, and the classic Formstripe.",
    images: [img("1605348532760-6753d2c43329"), img("1556906781-9a412961c28c"), img("1595950653106-6c9ebd614d3a")],
    sizes: ["36","37","38","39","40","41"], colors: [{ name: "White", hex: "#FFFFFF" }, { name: "Rose", hex: "#F2C4C8" }],
    rating: 4.5, reviewCount: 178,
  },

  // ---------- MORE SALOMON / OUTDOOR ----------
  {
    brandSlug: "salomon", name: "Salomon XT-Wings 2", slug: "salomon-xt-wings-2",
    category: "UNISEX", basePrice: 22999,
    description: "The XT-Wings 2 returns with the Quicklace system and Agile Chassis System. Trail-running tech meets streetwear.",
    images: [img("1608231387042-66d1773070a5"), img("1595950653106-6c9ebd614d3a"), img("1549298916-b41d501d3772")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Black Phantom", hex: "#0A0A0A" }, { name: "Vanilla", hex: "#E8E4D9" }],
    rating: 4.7, reviewCount: 312, isNew: true,
  },
  {
    brandSlug: "salomon", name: "Salomon Snowcross", slug: "salomon-snowcross",
    category: "UNISEX", basePrice: 25999,
    description: "Winter-ready with aggressive lug pattern and waterproof Gore-Tex membrane. Built for snow, ice, and everything between.",
    images: [img("1600185365483-52d0b3a4c1e0"), img("1608231387042-66d1773070a5"), img("1600269452121-4f2416e55c28")],
    sizes: ["40","41","42","43","44","45","46"], colors: [{ name: "Black", hex: "#0A0A0A" }, { name: "Beluga", hex: "#6B7280" }],
    rating: 4.8, reviewCount: 156,
  },

  // ---------- MORE HERITAGE ----------
  {
    brandSlug: "converse", name: "Converse Chuck 70 High", slug: "converse-chuck-70-high",
    category: "UNISEX", basePrice: 11999,
    description: "The 1970s reissue of the Chuck Taylor. Heavier canvas, ortholite insole, vintage midsole — a premium upgrade.",
    images: [img("1549298916-b41d501d3772"), img("1600269452121-4f2416e55c28"), img("1606107557195-0e29a4b5b4aa")],
    sizes: ["37","38","39","40","41","42","43","44"], colors: [{ name: "Optical White", hex: "#FFFFFF" }, { name: "Black", hex: "#0A0A0A" }, { name: "Natural", hex: "#E8E4D9" }],
    rating: 4.8, reviewCount: 1834,
  },
  {
    brandSlug: "converse", name: "Converse Run Star Motion", slug: "converse-run-star-motion",
    category: "WOMEN", basePrice: 14999,
    description: "The Chuck Taylor reimagined with a chunky, wavy two-part platform sole. Modern, bold, and unmistakably Converse.",
    images: [img("1605348532760-6753d2c43329"), img("1549298916-b41d501d3772"), img("1600185365483-52d0b3a4c1e0")],
    sizes: ["36","37","38","39","40","41"], colors: [{ name: "Black White", hex: "#0A0A0A" }, { name: "Egret", hex: "#E8E4D9" }],
    rating: 4.6, reviewCount: 287, isNew: true,
  },
  {
    brandSlug: "vans", name: "Vans Sk8-Hi", slug: "vans-sk8-hi",
    category: "UNISEX", basePrice: 10499,
    description: "The high-top with the iconic Sidestripe. Padded collar, reinforced toecap, and the waffle outsole that defined skate culture.",
    images: [img("1595950653106-6c9ebd614d3a"), img("1605348532760-6753d2c43329"), img("1556906781-9a412961c28c")],
    sizes: ["37","38","39","40","41","42","43","44","45"], colors: [{ name: "Black/Bone", hex: "#0A0A0A" }, { name: "Checkerboard", hex: "#FFFFFF" }],
    rating: 4.8, reviewCount: 1542,
  },
  {
    brandSlug: "vans", name: "Vans Knu-Skool", slug: "vans-knu-skool",
    category: "UNISEX", basePrice: 11999,
    description: "90s-inspired chunky take on the Old Skool. Bulbous tongue, oversized Sidestripe, and a chunky cupsole.",
    images: [img("1608231387042-66d1773070a5"), img("1556906781-9a412961c28c"), img("1600185365483-52d0b3a4c1e0")],
    sizes: ["38","39","40","41","42","43","44"], colors: [{ name: "Sugar", hex: "#F2C4C8" }, { name: "Black", hex: "#0A0A0A" }],
    rating: 4.5, reviewCount: 198, isNew: true,
  },

  // ---------- MORE PUMA / REEBOK ----------
  {
    brandSlug: "puma", name: "Puma RS-X", slug: "puma-rs-x",
    category: "UNISEX", basePrice: 13999,
    description: "RS (Running System) tech reimagined with chunky layered design. 80s running aesthetic with modern cushioning.",
    images: [img("1556906781-9a412961c28c"), img("1605348532760-6753d2c43329"), img("1595950653106-6c9ebd614d3a")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Puma White Black", hex: "#FFFFFF" }, { name: "Cell Alien", hex: "#1A1A1A" }],
    rating: 4.5, reviewCount: 412,
  },
  {
    brandSlug: "puma", name: "Puma Clyde", slug: "puma-clyde",
    category: "UNISEX", basePrice: 10999,
    description: "Walt Clyde Frazier's 1973 signature shoe. Suede upper, Formstripe, and the cleanest lines in basketball history.",
    images: [img("1608231387042-66d1773070a5"), img("1549298916-b41d501d3772"), img("1600269452121-4f2416e55c28")],
    sizes: ["38","39","40","41","42","43","44","45"], colors: [{ name: "Burgundy", hex: "#7B2D3F" }, { name: "Black", hex: "#0A0A0A" }],
    rating: 4.6, reviewCount: 287,
  },
  {
    brandSlug: "reebok", name: "Reebok Question Mid", slug: "reebok-question-mid",
    category: "MEN", basePrice: 16999,
    description: "Allen Iverson's 1996 signature shoe. Hexalite cushioning, pearlized leather, and a silhouette that defined a generation.",
    images: [img("1549298916-b41d501d3772"), img("1600269452121-4f2416e55c28"), img("1606107557195-0e29a4b5b4aa")],
    sizes: ["40","41","42","43","44","45","46"], colors: [{ name: "Red Toe", hex: "#C8102E" }, { name: "Blue Toe", hex: "#1B2A4A" }],
    rating: 4.7, reviewCount: 423,
  },
  {
    brandSlug: "reebok", name: "Reebok Instapump Fury", slug: "reebok-instapump-fury",
    category: "UNISEX", basePrice: 18999,
    description: "1994 design with The Pump technology and a carbon-fiber plate. No laces — just inflatable chambers for a custom fit.",
    images: [img("1605348532760-6753d2c43329"), img("1549298916-b41d501d3772"), img("1608231387042-66d1773070a5")],
    sizes: ["38","39","40","41","42","43","44","45"], colors: [{ name: "Venom Red", hex: "#C8102E" }, { name: "Black", hex: "#0A0A0A" }],
    rating: 4.6, reviewCount: 187, isNew: true,
  },

  // ---------- MORE UNDER ARMOUR / SKECHERS / FILA ----------
  {
    brandSlug: "under-armour", name: "UA Curry Flow 9", slug: "ua-curry-flow-9",
    category: "MEN", basePrice: 19999, compareAt: 23000,
    description: "Stephen Curry's ninth signature. UA Flow cushioning, knit upper, and the court-ready traction that broke records.",
    images: [img("1600269452121-4f2416e55c28"), img("1542291026-7eec264c27ff"), img("1606107557195-0e29a4b5b4aa")],
    sizes: ["40","41","42","43","44","45","46"], colors: [{ name: "Dub Nation", hex: "#1B4A9C" }, { name: "Black", hex: "#0A0A0A" }],
    rating: 4.7, reviewCount: 312,
  },
  {
    brandSlug: "skechers", name: "Skechers GOrun Razor Excess", slug: "skechers-gorun-razor-excess",
    category: "UNISEX", basePrice: 13999,
    description: "Carbon-plated running shoe at an accessible price. Fast, light, and built for tempo runs and race day.",
    images: [img("1595950653106-6c9ebd614d3a"), img("1608231387042-66d1773070a5"), img("1549298916-b41d501d3772")],
    sizes: ["39","40","41","42","43","44","45"], colors: [{ name: "Black Red", hex: "#0A0A0A" }, { name: "Lime", hex: "#A8D600" }],
    rating: 4.6, reviewCount: 198,
  },
  {
    brandSlug: "fila", name: "Fila MB sneaker", slug: "fila-mb-sneaker",
    category: "WOMEN", basePrice: 12999,
    description: "The MB (Mind Body) sneaker. Chunky layered design with leather and mesh panels for a 90s-inspired street look.",
    images: [img("1605348532760-6753d2c43329"), img("1549298916-b41d501d3772"), img("1600185365483-52d0b3a4c1e0")],
    sizes: ["36","37","38","39","40","41"], colors: [{ name: "White", hex: "#FFFFFF" }, { name: "Sand", hex: "#D6C7A8" }],
    rating: 4.4, reviewCount: 156,
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
