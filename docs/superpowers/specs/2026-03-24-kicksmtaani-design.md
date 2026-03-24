# KicksMtaani - Technical Specification

## Project Overview
Multi-category family shoe e-commerce platform for East African market (adaptable to general market).

## Core Requirements
- Sell shoes online: Men, Women, Boys, Girls, Kids categories
- Accept M-Pesa STK Push (Safaricom) + Card payments (configurable adapter pattern)
- Manage inventory with sizes and variants
- Admin dashboard for order management
- Mobile-first design (most users shop on phone)
- WhatsApp order notifications
- SEO-ready for Google search traffic

## Technical Architecture

### Monorepo Structure
```
kicksmtaani/
├── apps/
│   ├── web/              # Next.js 14 storefront (customer facing)
│   ├── admin/            # Next.js admin dashboard
│   └── api/              # Node.js / Express REST API
├── packages/
│   ├── db/               # Prisma schema + migrations
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared ESLint, Prettier, TS config
├── infrastructure/
│   ├── docker/           # Dockerfiles per service
│   └── nginx/            # Reverse proxy config
├── .github/workflows/    # CI/CD pipelines
├── docker-compose.yml    # Local dev environment
└── turbo.json            # Turborepo build orchestration
```

### Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS + shadcn/ui |
| Client State | Zustand |
| Server State | React Query |
| Forms | React Hook Form + Zod |
| Backend Runtime | Node.js 20 LTS + Express |
| Database | PostgreSQL 16 |
| ORM | Prisma |
| Cache/Sessions | Redis |
| Search | Meilisearch |
| Image Storage | Cloudinary |
| Auth | JWT + Refresh Tokens |

### Payment Adapter Pattern
Interface for pluggable payment providers:
```typescript
interface PaymentProvider {
  initiatePayment(amount: number, phone: string, metadata?: Record<string, unknown>): Promise<PaymentResult>;
  verifyPayment(transactionId: string): Promise<PaymentStatus>;
  refund(transactionId: string, amount: number): Promise<RefundResult>;
  handleWebhook(payload: unknown, signature: string): Promise<WebhookEvent>;
}
```
Implementations: MpesaProvider, StripeProvider, FlutterwaveProvider

## Database Schema

### users
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | gen_random_uuid() |
| email | TEXT | Unique, lowercased, indexed |
| phone | TEXT | Kenyan format +2547XXXXXXXX |
| password_hash | TEXT | bcrypt, 12 rounds |
| full_name | TEXT | |
| role | ENUM | CUSTOMER, ADMIN, SUPERADMIN |
| email_verified | BOOLEAN | Default false |
| created_at | TIMESTAMP | Default now(), indexed |

### products
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| name | TEXT | Max 200 chars |
| slug | TEXT | URL-friendly, unique |
| description | TEXT | |
| category | ENUM | MEN, WOMEN, BOYS, GIRLS, KIDS |
| brand | TEXT | Nike, Adidas, Bata, etc. |
| base_price | DECIMAL | In KES |
| images | TEXT[] | Cloudinary URLs |
| is_active | BOOLEAN | Soft delete |
| meta_title | TEXT | SEO |
| search_vector | TSVECTOR | Full-text search |

### product_variants
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| product_id | UUID FK | → products.id |
| size | TEXT | EU/UK sizes |
| color | TEXT | Optional |
| sku | TEXT | Unique |
| stock_qty | INTEGER | Min 0 |
| price_override | DECIMAL | Optional |

### orders
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| order_number | TEXT | KM-00001 |
| user_id | UUID FK | Nullable (guest) |
| status | ENUM | PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED, REFUNDED |
| total_amount | DECIMAL | In KES |
| delivery_address | JSONB | {name, phone, area, city, notes} |
| created_at | TIMESTAMP | Indexed |

### payments
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| order_id | UUID FK | → orders.id |
| provider | ENUM | MPESA, STRIPE, FLUTTERWAVE, CASH |
| provider_ref | TEXT | Receipt / txn ID |
| amount | DECIMAL | In KES |
| status | ENUM | PENDING, SUCCESS, FAILED, REFUNDED |
| phone_number | TEXT | For M-Pesa |

## API Conventions
- Base URL: `/api/v1/`
- Response: `{ success, data, meta, error }`
- Pagination: `?page=1&limit=20`
- Dates: ISO 8601
- Errors: `{ code, message, field }`

## Development Phases

### Phase 1: Foundation & Setup (Week 1)
- Initialize monorepo with Turborepo
- Configure TypeScript (strict mode, path aliases)
- Set up ESLint + Prettier + husky
- Docker Compose: PostgreSQL, Redis, Meilisearch
- Environment variables with Zod validation
- GitHub Actions CI pipeline
- Prisma schema + first migration
- Branch protection rules
- Conventional Commits

### Phase 2: Core API + Database (Weeks 2-3)
- Full database schema implementation
- Authentication module (register, login, refresh, logout, forgot password)
- Products module (CRUD, variants, categories, stock)
- Orders module (atomic stock decrement, status machine)
- Input validation with Zod
- Rate limiting (express-rate-limit)
- Logging (Winston, Morgan)
- Unit tests (Jest)
- Meilisearch sync

### Phase 3: Storefront (Weeks 3-5)
- Homepage with hero, categories, featured products
- Category pages with filters
- Product detail page with image gallery
- Cart (slide-over, Zustand, localStorage)
- Checkout flow (3 steps)
- Search with Meilisearch
- Auth pages
- Account dashboard
- Mobile-first responsive
- SEO (meta tags, OpenGraph, sitemap, JSON-LD)

### Phase 4: Payments + Admin (Weeks 5-7)
- Payment providers implementation
- Webhook security (HMAC verification)
- Refund handling
- Admin dashboard (orders, products CRUD)
- Inventory management
- SMS notifications (Africa's Talking)
- Email notifications (Resend)
- Analytics (sales, orders, top products)

### Phase 5: Testing, Hardening & Launch (Week 8)
- Security audit (OWASP, npm audit)
- Load testing (k6)
- E2E tests (Playwright)
- Performance audit (Lighthouse)
- DNS + domain setup
- Database backups
- Soft launch
- Public launch

## Acceptance Criteria
- Page load under 2 seconds on 3G
- Support 500 concurrent users
- 99.9% uptime SLA
- Zero PCI-DSS scope via tokenization
- GDPR + Kenya Data Protection Act compliant
- Automated backups every 6 hours
- SSL/TLS everywhere, HSTS preloaded
