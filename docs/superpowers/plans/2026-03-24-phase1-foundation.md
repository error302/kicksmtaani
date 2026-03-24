# Phase 1: Foundation & Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize the KicksMtaani monorepo with Turborepo, set up Docker Compose for local dev, configure TypeScript/ESLint/Prettier, and create the CI pipeline skeleton.

**Architecture:** Monorepo with 3 apps (web, admin, api) and 3 shared packages (db, types, config). All services containerized for local development.

**Tech Stack:** Turborepo, pnpm, Docker, Docker Compose, TypeScript, ESLint, Prettier, Husky, GitHub Actions, Prisma

---

## File Structure

```
kicksmtaani/
├── apps/
│   ├── web/              # Next.js 14 storefront (will scaffold later)
│   ├── admin/            # Next.js admin dashboard (will scaffold later)
│   └── api/              # Node.js API (will scaffold later)
├── packages/
│   ├── db/               # Prisma schema
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared ESLint, Prettier, TS config
├── infrastructure/
│   └── docker/           # Docker configurations
├── .github/
│   └── workflows/        # CI/CD pipelines
├── .husky/               # Git hooks
├── docker-compose.yml    # Local dev environment
├── turbo.json           # Turborepo config
├── package.json         # Root workspace
├── pnpm-workspace.yaml  # pnpm workspaces
├── tsconfig.json        # Base TypeScript config
├── .eslintrc.js        # ESLint config
├── .prettierrc         # Prettier config
└── .gitignore
```

---

## Tasks

### Task 1: Initialize pnpm Monorepo with Turborepo

**Files:**
- Create: `package.json` (root)
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `tsconfig.json`
- Create: `.gitignore`

- [ ] **Step 1: Create root package.json**

```json
{
  "name": "kicksmtaani",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "db:migrate": "pnpm --filter @kicksmtaani/db migrate",
    "db:seed": "pnpm --filter @kicksmtaani/db seed",
    "db:studio": "pnpm --filter @kicksmtaani/db studio"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.4.0",
    "eslint": "^8.57.0",
    "prettier": "^3.2.0"
  },
  "packageManager": "pnpm@9.0.0",
  "engines": {
    "node": ">=20"
  }
}
```

- [ ] **Step 2: Create pnpm-workspace.yaml**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 3: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env*"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "test": {
      "dependsOn": ["^test"]
    }
  }
}
```

- [ ] **Step 4: Create base tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": false,
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "removeComments": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "paths": {
      "@kicksmtaani/*": ["./packages/*/src"],
      "@kicksmtaani/db/*": ["./packages/db/src"]
    }
  },
  "exclude": ["node_modules", "dist", "build", ".next"]
}
```

- [ ] **Step 5: Create .gitignore**

```
node_modules/
dist/
build/
.next/
.turbo/
*.log
.env
.env.local
.env.*.local
.DS_Store
*.tsbuildinfo
.vercel
```

- [ ] **Step 6: Install dependencies**

Run: `npm install -g pnpm@9.0.0 && pnpm install`
Expected: Dependencies installed, pnpm-lock.yaml created

- [ ] **Step 7: Commit**

```bash
git init
git add package.json pnpm-workspace.yaml turbo.json tsconfig.json .gitignore
git commit -m "chore: initialize pnpm monorepo with Turborepo"
```

---

### Task 2: Create Shared Config Package

**Files:**
- Create: `packages/config/package.json`
- Create: `packages/config/tsconfig.json`
- Create: `packages/config/eslint.config.js`
- Create: `packages/config/.prettierrc`

- [ ] **Step 1: Create packages/config/package.json**

```json
{
  "name": "@kicksmtaani/config",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./eslint": "./eslint.config.js",
    "./prettier": "./.prettierrc"
  },
  "scripts": {
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-import": "^2.29.0",
    "eslint-plugin-simple-import-sort": "^12.0.0"
  }
}
```

- [ ] **Step 2: Create packages/config/tsconfig.json**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create packages/config/eslint.config.js**

```javascript
const prettierConfig = require('prettier');
const path = require('path');

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'import', 'simple-import-sort'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
      },
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/order': 'off',
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'off',
  },
};
```

- [ ] **Step 4: Create packages/config/.prettierrc**

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

- [ ] **Step 5: Install and commit**

Run: `pnpm install`
Run: `git add packages/config/ && git commit -m "chore: add shared config package"`

---

### Task 3: Create Shared Types Package

**Files:**
- Create: `packages/types/package.json`
- Create: `packages/types/tsconfig.json`
- Create: `packages/types/src/index.ts`

- [ ] **Step 1: Create packages/types/package.json**

```json
{
  "name": "@kicksmtaani/types",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 2: Create packages/types/tsconfig.json**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create packages/types/src/index.ts with base types**

```typescript
export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPERADMIN';

export type ProductCategory = 'MEN' | 'WOMEN' | 'BOYS' | 'GIRLS' | 'KIDS';

export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'SHIPPED' 
  | 'DELIVERED' 
  | 'CANCELLED' 
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export type PaymentProvider = 'MPESA' | 'STRIPE' | 'FLUTTERWAVE' | 'CASH';

export interface Address {
  name: string;
  phone: string;
  area: string;
  city: string;
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: {
    page: number;
    total: number;
    limit: number;
  };
  error?: {
    code: string;
    message: string;
    field?: string;
  };
}
```

- [ ] **Step 4: Install and commit**

Run: `pnpm install`
Run: `git add packages/types/ && git commit -m "chore: add shared types package"`

---

### Task 4: Create Database Package (Prisma)

**Files:**
- Create: `packages/db/package.json`
- Create: `packages/db/prisma/schema.prisma`
- Create: `packages/db/tsconfig.json`
- Create: `packages/db/src/index.ts`

- [ ] **Step 1: Create packages/db/package.json**

```json
{
  "name": "@kicksmtaani/db",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./client": "./src/client.ts"
  },
  "scripts": {
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio",
    "db:seed": "tsx src/seed.ts",
    "build": "prisma generate",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@prisma/client": "^5.12.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "prisma": "^5.12.0",
    "tsx": "^4.7.0",
    "typescript": "^5.4.0"
  },
  "prisma": {
    "seed": "tsx src/seed.ts"
  }
}
```

- [ ] **Step 2: Create packages/db/prisma/schema.prisma**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  CUSTOMER
  ADMIN
  SUPERADMIN
}

enum ProductCategory {
  MEN
  WOMEN
  BOYS
  GIRLS
  KIDS
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}

enum PaymentProvider {
  MPESA
  STRIPE
  FLUTTERWAVE
  CASH
}

model User {
  id            String    @id @default(gen_random_uuid()) @db.Uuid
  email         String    @unique
  phone         String    @unique
  passwordHash  String    @map("password_hash")
  fullName      String?   @map("full_name")
  role          UserRole  @default(CUSTOMER)
  emailVerified Boolean   @default(false) @map("email_verified")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  orders        Order[]

  @@map("users")
}

model Product {
  id          String         @id @default(gen_random_uuid()) @db.Uuid
  name        String
  slug        String         @unique
  description String?        @db.Text
  category    ProductCategory
  brand       String?
  basePrice   Decimal        @map("base_price") @db.Decimal(12, 2)
  images      String[]
  isActive    Boolean        @default(true) @map("is_active")
  metaTitle   String?        @map("meta_title")
  createdAt   DateTime       @default(now()) @map("created_at")
  updatedAt   DateTime       @updatedAt @map("updated_at")

  variants    ProductVariant[]

  @@index([category])
  @@index([slug])
  @@map("products")
}

model ProductVariant {
  id            String    @id @default(gen_random_uuid()) @db.Uuid
  productId     String    @map("product_id") @db.Uuid
  size          String
  color         String?
  sku           String    @unique
  stockQty      Int       @default(0) @map("stock_qty")
  priceOverride Decimal?  @map("price_override") @db.Decimal(12, 2)
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  product       Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  orderItems    OrderItem[]

  @@unique([productId, size, color])
  @@index([productId])
  @@map("product_variants")
}

model Order {
  id              String      @id @default(gen_random_uuid()) @db.Uuid
  orderNumber     String      @unique @map("order_number")
  userId          String?     @map("user_id") @db.Uuid
  status          OrderStatus @default(PENDING)
  totalAmount     Decimal     @map("total_amount") @db.Decimal(12, 2)
  deliveryAddress Json        @map("delivery_address")
  createdAt       DateTime    @default(now()) @map("created_at")
  updatedAt       DateTime    @updatedAt @map("updated_at")

  user            User?       @relation(fields: [userId], references: [id])
  items           OrderItem[]
  payments        Payment[]

  @@index([userId])
  @@index([status])
  @@index([createdAt])
  @@map("orders")
}

model OrderItem {
  id        String   @id @default(gen_random_uuid()) @db.Uuid
  orderId   String   @map("order_id") @db.Uuid
  variantId String   @map("variant_id") @db.Uuid
  quantity  Int
  price     Decimal  @db.Decimal(12, 2)
  createdAt DateTime @default(now()) @map("created_at")

  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  variant   ProductVariant @relation(fields: [variantId], references: [id])

  @@unique([orderId, variantId])
  @@map("order_items")
}

model Payment {
  id           String         @id @default(gen_random_uuid()) @db.Uuid
  orderId      String         @map("order_id") @db.Uuid
  provider     PaymentProvider
  providerRef  String?        @map("provider_ref")
  amount       Decimal        @db.Decimal(12, 2)
  status       PaymentStatus  @default(PENDING)
  phoneNumber  String?        @map("phone_number")
  metadata     Json?
  createdAt    DateTime       @default(now()) @map("created_at")
  updatedAt    DateTime       @updatedAt @map("updated_at")

  order        Order          @relation(fields: [orderId], references: [id])

  @@index([orderId])
  @@index([provider])
  @@map("payments")
}
```

- [ ] **Step 3: Create packages/db/tsconfig.json**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*", "prisma/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 4: Create packages/db/src/index.ts**

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export * from '@prisma/client';
```

- [ ] **Step 5: Create .env.example**

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kicksmtaani?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# Auth
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-token-secret-change-in-production"

# Payment Providers
MPESA_CONSUMER_KEY=""
MPESA_CONSUMER_SECRET=""
MPESA_SHORTCODE=""
MPESA_PASSKEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
FLUTTERWAVE_PUBLIC_KEY=""
FLUTTERWAVE_SECRET_KEY=""

# External Services
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
AFRICASTALKING_API_KEY=""
AFRICASTALKING_USERNAME=""

# App
NODE_ENV="development"
APP_URL="http://localhost:3000"
API_URL="http://localhost:4000"
```

- [ ] **Step 6: Install and commit**

Run: `pnpm install`
Run: `git add packages/db/ .env.example && git commit -m "chore: add Prisma database package with schema"`

---

### Task 5: Create Docker Compose for Local Development

**Files:**
- Create: `docker-compose.yml`
- Create: `infrastructure/docker/Dockerfile.api`
- Create: `infrastructure/docker/Dockerfile.web`

- [ ] **Step 1: Create docker-compose.yml**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: kicksmtaani-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: kicksmtaani
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: kicksmtaani-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  meilisearch:
    image: getmeili/meilisearch:v1.6
    container_name: kicksmtaani-meilisearch
    ports:
      - "7700:7700"
    environment:
      MEILI_MASTER_KEY: masterKey
    volumes:
      - meilisearch_data:/meili_data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:7700/health"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
  meilisearch_data:
```

- [ ] **Step 2: Create infrastructure/docker/Dockerfile.api**

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@9.0.0 && pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @kicksmtaani/api build

EXPOSE 4000

CMD ["pnpm", "--filter", "@kicksmtaani/api", "dev"]
```

- [ ] **Step 3: Create infrastructure/docker/Dockerfile.web**

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@9.0.0 && pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @kicksmtaani/web build

EXPOSE 3000

CMD ["pnpm", "--filter", "@kicksmtaani/web", "dev"]
```

- [ ] **Step 4: Test Docker Compose**

Run: `docker-compose up -d`
Run: `docker ps` - should show postgres, redis, meilisearch running
Run: `docker-compose down`

- [ ] **Step 5: Commit**

```bash
git add docker-compose.yml infrastructure/docker/ .env.example
git commit -m "chore: add Docker Compose for local development"
```

---

### Task 6: Set Up GitHub Actions CI Pipeline

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/lint.yml`

- [ ] **Step 1: Create .github/workflows/ci.yml**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  typecheck:
    name: TypeCheck
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
```

- [ ] **Step 2: Commit**

```bash
git add .github/ && git commit -m "ci: add GitHub Actions CI pipeline"
```

---

### Task 7: Set Up Husky + Commitlint

**Files:**
- Modify: `package.json` (add husky scripts)
- Create: `.husky/pre-commit`
- Create: `commitlint.config.js`

- [ ] **Step 1: Install Husky and commitlint**

Run: `pnpm add -D husky @commitlint/cli @commitlint/config-conventional lint-staged`
Run: `npx husky init`

- [ ] **Step 2: Modify .husky/pre-commit**

```bash
pnpm lint-staged
```

- [ ] **Step 3: Create commitlint.config.js**

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert'],
    ],
    'subject-full-stop': [0],
    'subject-empty': [0],
  },
};
```

- [ ] **Step 4: Update package.json**

Add to package.json:
```json
"lint-staged": {
  "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

Run: `pnpm install`

- [ ] **Step 5: Commit**

```bash
git add package.json .husky/ commitlint.config.js
git commit -m "chore: add Husky and commitlint"
```

---

### Task 8: Create API App Skeleton

**Files:**
- Create: `apps/api/package.json`
- Create: `apps/api/tsconfig.json`
- Create: `apps/api/src/index.ts`
- Create: `apps/api/src/app.ts`

- [ ] **Step 1: Create apps/api/package.json**

```json
{
  "name": "@kicksmtaani/api",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@kicksmtaani/config": "workspace:*",
    "@kicksmtaani/db": "workspace:*",
    "@kicksmtaani/types": "workspace:*",
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "zod": "^3.22.0",
    "dotenv": "^16.4.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/morgan": "^1.9.9",
    "tsx": "^4.7.0",
    "typescript": "^5.4.0",
    "eslint": "^8.57.0"
  }
}
```

- [ ] **Step 2: Create apps/api/tsconfig.json**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create apps/api/src/index.ts**

```typescript
import 'dotenv/config';
import { app } from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});
```

- [ ] **Step 4: Create apps/api/src/app.ts**

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);
```

- [ ] **Step 5: Create apps/api/src/middleware/errorHandler.ts**

```typescript
import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  field?: string;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message,
      field: err.field,
    },
  });
}
```

- [ ] **Step 6: Create apps/api/.env**

```bash
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kicksmtaani?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="dev-secret-change-in-production"
JWT_REFRESH_SECRET="dev-refresh-secret-change-in-production"
NODE_ENV=development
```

- [ ] **Step 7: Test API starts**

Run: `pnpm install`
Run: `pnpm --filter @kicksmtaani/api dev`
Expected: Server starts on port 4000, /health returns ok

- [ ] **Step 8: Commit**

```bash
git add apps/api/
git commit -m "feat(api): create API app skeleton with Express"
```

---

### Task 9: Create Web App Skeleton

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/next.config.js`
- Create: `apps/web/src/app/layout.tsx`
- Create: `apps/web/src/app/page.tsx`

- [ ] **Step 1: Create apps/web/package.json**

```json
{
  "name": "@kicksmtaani/web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@kicksmtaani/config": "workspace:*",
    "@kicksmtaani/types": "workspace:*",
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.28.0",
    "zod": "^3.22.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.359.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.4.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0"
  }
}
```

- [ ] **Step 2: Create apps/web/tsconfig.json**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "outDir": "./dist",
    "rootDir": "./src",
    "paths": {
      "@/*": ["./src/*"],
      "@kicksmtaani/*": ["../../packages/*/src"]
    }
  },
  "include": ["src/**/*", "next.config.js"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create apps/web/next.config.js**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@kicksmtaani/types', '@kicksmtaani/config'],
};

module.exports = nextConfig;
```

- [ ] **Step 4: Create apps/web/tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DC2626',
          dark: '#991B1B',
          light: '#FEF2F2',
        },
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 5: Create apps/web/postcss.config.js**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: Create apps/web/src/app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 249, 250, 251;
  --background-end-rgb: 255, 255, 255;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
```

- [ ] **Step 7: Create apps/web/src/app/layout.tsx**

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KicksMtaani - Premium Shoes in Kenya',
  description: 'Shop the best shoes for the whole family. Men, Women, Kids - Free delivery in Nairobi & Mombasa.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: Create apps/web/src/app/page.tsx**

```typescript
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="hero">
        <h1 className="text-4xl font-bold">
          Welcome to <span className="text-primary">KicksMtaani</span>
        </h1>
        <p className="mt-4 text-gray-600">
          Premium shoes for the whole family
        </p>
      </div>
    </main>
  );
}
```

- [ ] **Step 9: Test web builds**

Run: `pnpm install`
Run: `pnpm --filter @kicksmtaani/web dev`
Expected: Next.js dev server starts on port 3000

- [ ] **Step 10: Commit**

```bash
git add apps/web/
git commit -m "feat(web): create Next.js web app skeleton"
```

---

### Task 10: Branch Protection Rules (Documentation)

**Files:**
- Create: `.github/CODEOWNERS`

- [ ] **Step 1: Create .github/CODEOWNERS**

```
# Code Owners
* @error302

# Require PR review for main
.github/CODEOWNERS @error302
```

- [ ] **Step 2: Commit**

```bash
git add .github/CODEOWNERS
git commit -m "docs: add CODEOWNERS file"
```

---

## Phase 1 Completion Checklist

- [ ] Monorepo initialized with Turborepo
- [ ] Shared config package created
- [ ] Shared types package created
- [ ] Database package with Prisma schema created
- [ ] Docker Compose for local dev (PostgreSQL, Redis, Meilisearch)
- [ ] GitHub Actions CI pipeline
- [ ] Husky + commitlint configured
- [ ] API app skeleton running
- [ ] Web app skeleton running
- [ ] All commits made
