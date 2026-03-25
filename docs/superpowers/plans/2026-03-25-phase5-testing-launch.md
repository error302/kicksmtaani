# Phase 5: Testing, Hardening & Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete security hardening, testing, performance optimization, and prepare for production launch.

**Architecture:**

- Security: OWASP Top 10 compliance, npm audit, secrets scanning
- Testing: Playwright E2E tests, k6 load tests
- Performance: Lighthouse CI, image optimization
- Deployment: Vercel for web, Railway/Fly.io for API

**Tech Stack:** Playwright, k6, Lighthouse CI, Sentry, GitHub Actions

---

## Tasks

### Task 1: Security Audit & Fixes

**Files:**

- Create: `SECURITY.md`
- Modify: Various files for security fixes

- [ ] **Step 1: Run npm audit**

```bash
pnpm audit --fix
```

- [ ] **Step 2: Add security headers to Next.js**

Create/update `apps/web/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ],
};

module.exports = nextConfig;
```

- [ ] **Step 3: Add rate limiting to Express**

Check if rate limiting is properly configured in all routes.

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "security: add headers and audit fixes"
```

---

### Task 2: Playwright E2E Tests

**Files:**

- Create: `apps/web/e2e/` directory
- Create: `apps/web/playwright.config.ts`
- Create: `apps/web/e2e/homepage.spec.ts`
- Create: `apps/web/e2e/auth.spec.ts`
- Create: `apps/web/e2e/checkout.spec.ts`

- [ ] **Step 1: Install Playwright**

```bash
cd apps/web && pnpm add -D @playwright/test
```

- [ ] **Step 2: Create Playwright config**

```typescript
// apps/web/playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 3: Create homepage test**

```typescript
// apps/web/e2e/homepage.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should display hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("SNEAKROOM");
  });

  test("should navigate to products", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Shop Collection");
    await expect(page).toHaveURL("/products");
  });

  test("should display categories", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Men")).toBeVisible();
    await expect(page.locator("text=Women")).toBeVisible();
  });
});
```

- [ ] **Step 4: Create auth test**

```typescript
// apps/web/e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should display login form", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test("should display register form", async ({ page }) => {
    await page.goto("/auth/register");
    await expect(page.locator('input[name="fullName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test("should show error for invalid login", async ({ page }) => {
    await page.goto("/auth/login");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');
    // Wait for error message
    await expect(page.locator(".bg-red-50")).toBeVisible({ timeout: 5000 });
  });
});
```

- [ ] **Step 5: Create checkout test**

```typescript
// apps/web/e2e/checkout.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Checkout Flow", () => {
  test("should show empty cart message", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page.locator("text=Your cart is empty")).toBeVisible();
  });

  test("should navigate to products from empty cart", async ({ page }) => {
    await page.goto("/checkout");
    await page.click("text=Continue Shopping");
    await expect(page).toHaveURL("/products");
  });
});
```

- [ ] **Step 6: Add test script to package.json**

```json
"scripts": {
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

- [ ] **Step 7: Commit**

```bash
git add apps/web/e2e/ apps/web/playwright.config.ts apps/web/package.json && git commit -m "test(web): add playwright e2e tests"
```

---

### Task 3: k6 Load Testing

**Files:**

- Create: `tests/load/checkout.js`
- Create: `tests/load/api.js`

- [ ] **Step 1: Create API load test**

```javascript
// tests/load/api.js
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "1m", target: 50 },
    { duration: "30s", target: 100 },
    { duration: "30s", target: 0 },
  ],
};

const BASE_URL = __ENV.API_URL || "http://localhost:4000/api/v1";

export default function () {
  // Test products endpoint
  const productsRes = http.get(`${BASE_URL}/products`);
  check(productsRes, {
    "products status 200": (r) => r.status === 200,
    "products response time < 500ms": (r) => r.timings.duration < 500,
  });

  // Test single product
  const productRes = http.get(`${BASE_URL}/products?limit=1`);
  check(productRes, {
    "product query status 200": (r) => r.status === 200,
  });

  sleep(1);
}
```

- [ ] **Step 2: Commit**

```bash
git add tests/ && git commit -m "test: add k6 load tests"
```

---

### Task 4: Error Tracking with Sentry

**Files:**

- Modify: `apps/web/package.json`
- Create: `apps/web/sentry.client.config.ts`
- Create: `apps/web/sentry.server.config.ts`

- [ ] **Step 1: Install Sentry**

```bash
cd apps/web && pnpm add @sentry/nextjs
```

- [ ] **Step 2: Create Sentry client config**

```typescript
// apps/web/sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
});
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/ && git commit -m "feat(web): add sentry error tracking"
```

---

### Task 5: GitHub Actions CI/CD

**Files:**

- Modify: `.github/workflows/ci.yml`
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Update CI workflow**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm build

  e2e:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @kicksmtaani/web test:e2e
```

- [ ] **Step 2: Commit**

```bash
git add .github/ && git commit -m "ci: add e2e tests to pipeline"
```

---

### Task 6: README & Documentation

**Files:**

- Create/update: `README.md`

- [ ] **Step 1: Create comprehensive README**

````markdown
# KicksMtaani — SneakRoom

Premium sneaker e-commerce platform for Kenya.

## Quick Start

```bash
# Clone
git clone https://github.com/error302/kicksmtaani.git
cd kicksmtaani

# Install
pnpm install

# Setup environment
cp .env.example .env

# Start services
docker compose up -d

# Run database migrations
pnpm db:migrate

# Seed database
pnpm db:seed

# Start development
pnpm dev
```
````

## Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Backend:** Express.js, Prisma ORM
- **Database:** PostgreSQL
- **Search:** Meilisearch
- **Payments:** M-Pesa (Daraja), Flutterwave
- **Notifications:** Africa's Talking (SMS), Nodemailer (Email)

## Project Structure

```
kicksmtaani/
├── apps/
│   ├── web/          # Next.js storefront
│   └── api/          # Express API
├── packages/
│   ├── db/           # Prisma schema
│   ├── types/        # Shared types
│   └── config/       # Shared config
└── docker-compose.yml
```

## API Endpoints

### Auth

- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get profile

### Products

- `GET /api/v1/products` - List products
- `GET /api/v1/products/:slug` - Get product

### Orders

- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - List orders
- `POST /api/v1/orders/:id/pay` - Initiate payment

### Admin

- `GET /api/v1/admin/stats` - Dashboard stats
- `GET /api/v1/admin/orders` - Manage orders
- `GET /api/v1/admin/products` - Manage products

## Deployment

### Vercel (Web)

```bash
vercel --prod
```

### Railway (API)

```bash
railway up
```

## License

MIT

````

- [ ] **Step 2: Commit**

```bash
git add README.md && git commit -m "docs: comprehensive readme"
````

---

## Phase 5 Completion Checklist

- [ ] Task 1: Security audit & fixes
- [ ] Task 2: Playwright E2E tests
- [ ] Task 3: k6 load tests
- [ ] Task 4: Error tracking (Sentry)
- [ ] Task 5: CI/CD pipeline
- [ ] Task 6: Documentation
