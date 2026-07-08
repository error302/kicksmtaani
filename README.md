# KicksMtaani — Kenya's Premium Sneaker Marketplace

A premium, mobile-first Next.js 16 single-page sneaker marketplace supporting **25+ legendary brands** — from Nike and Jordan to On Running, Salomon, Travis Scott, Off-White, Maison Margiela, and Common Projects.

Built for the Kenyan sneaker community. Authentic. Curated. Classy.

---

## ✨ Features

- **25 sneaker brands** seeded with 36 realistic products (Nike, Adidas, Jordan, Yeezy, New Balance, On Running, Salomon, Travis Scott, Off-White, Balenciaga, Sacai, Alexander McQueen, Hoka, ASICS, Vans, Converse, Puma, Reebok, Under Armour, Skechers, Fila, Diadora, Common Projects, Merrell, Maison Margiela)
- **Premium editorial UI** — minimalist, classy, mobile-perfect
- **Single-page flow**: browse → filter → quick-view → cart → checkout → success
- **Quick-view modal** with image gallery, size/color/quantity selection
- **3-step cart drawer**: bag → checkout form → order confirmation
- **M-Pesa / Card / Cash** payment selection
- **Free shipping** over KES 15,000
- **Brand filtering**, category filtering, search, and sort
- **Persistent cart** (Zustand + localStorage)
- **Newsletter** signup
- **SEO-optimized** with OpenGraph, semantic HTML, keyword-rich metadata
- **Accessibility**: ARIA labels, keyboard nav, focus rings, sr-only labels
- **Animations**: Ken Burns hero, marquee ticker, staggered product reveals

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| Database | Prisma ORM + SQLite |
| State | Zustand (cart, persisted) |
| Server State | TanStack Query |
| Animations | framer-motion |
| Toasts | sonner |
| Icons | lucide-react |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- A GitHub PAT (if you want to push)

### Install & Run

```bash
# Install dependencies
bun install

# Set up the database
bun run db:push

# Seed 25 brands + 36 products
bun scripts/seed.ts

# Start dev server
bun run dev
```

Open `http://localhost:3000` to see the site.

### Build for Production

```bash
bun run build
bun run start
```

---

## 📁 Project Structure

```
.
├── prisma/
│   └── schema.prisma              # Brand, Product, Order, NewsletterSubscriber
├── scripts/
│   └── seed.ts                    # 25 brands + 36 products seed
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── checkout/route.ts  # POST order
│   │   │   └── newsletter/route.ts # POST subscribe
│   │   ├── globals.css            # Premium design tokens + animations
│   │   ├── layout.tsx             # SEO metadata + Toaster
│   │   └── page.tsx               # Server component, fetches data
│   ├── components/
│   │   ├── site/
│   │   │   ├── site-header.tsx    # Sticky blur header, mobile sheet
│   │   │   ├── hero.tsx           # Rotating bg + rotating headline
│   │   │   ├── brand-strip.tsx    # Marquee brand ticker
│   │   │   ├── trust-bar.tsx      # Free delivery / Authentic / Returns
│   │   │   ├── brand-showcase.tsx # 25-brand grid with hover descriptions
│   │   │   ├── editorial.tsx      # "Not just shoes. A statement."
│   │   │   ├── category-strip.tsx # All/Men/Women/Unisex/Kids
│   │   │   ├── filter-bar.tsx     # Search + sort + brand + chips
│   │   │   ├── product-card.tsx   # Hover image-swap, badges, swatches
│   │   │   ├── product-grid.tsx   # Responsive grid with framer-motion
│   │   │   ├── product-modal.tsx  # Quick-view with size/color/qty
│   │   │   ├── cart-sheet.tsx     # 3-step cart → checkout → success
│   │   │   ├── newsletter.tsx     # Subscribe with success state
│   │   │   ├── site-footer.tsx    # 4 columns + giant wordmark
│   │   │   └── home-client.tsx    # Client wrapper tying it all together
│   │   └── ui/                    # shadcn/ui components
│   └── lib/
│       ├── db.ts                  # Prisma client
│       ├── store.ts               # Zustand cart (persisted)
│       ├── queries.ts             # Data access layer
│       └── types.ts               # Shared DTOs
└── package.json
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | Warm off-white `oklch(0.985 0.005 80)` |
| Foreground | Near-black `oklch(0.145 0.005 80)` |
| Accent | Kenyan red `oklch(0.55 0.22 27)` |
| Typography | Geist Sans, tracking-tightest for display |
| Radius | `0.5rem` base |
| Touch targets | Minimum 44px |
| Breakpoints | Mobile-first (sm/md/lg/xl) |

---

## 📦 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/checkout` | Place an order (email, phone, name, address, city, items, payment method) |
| `POST` | `/api/newsletter` | Subscribe an email |

---

## 🌍 Supported Brands

Nike · Adidas · Jordan · Yeezy · New Balance · On Running · Salomon · Travis Scott · Off-White · Balenciaga · Sacai · Alexander McQueen · Hoka · ASICS · Vans · Converse · Puma · Reebok · Under Armour · Skechers · Fila · Diadora · Common Projects · Merrell · Maison Margiela

---

## 📝 License

MIT — Built with care for the Kenyan sneaker community.

---

## 🙏 Acknowledgments

- Original concept: [github.com/error302/kicksmtaani](https://github.com/error302/kicksmtaani)
- Agency-agents skills applied: design-ui-designer, design-brand-guardian, design-ux-architect, engineering-frontend-developer, engineering-backend-architect, engineering-mobile-app-builder, marketing-seo-specialist, testing-accessibility-auditor
