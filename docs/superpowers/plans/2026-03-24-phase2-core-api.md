# Phase 2: Core API + Database Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build complete backend API with authentication, products, orders, validation, rate limiting, logging, and search integration.

**Architecture:** Express.js API with modular structure - routes, controllers, services, repositories. JWT auth with refresh tokens. Zod for validation. Winston for logging. Meilisearch for search.

**Tech Stack:** Express, JWT, bcrypt, Zod, express-rate-limit, Winston, Meilisearch, Prisma

---

## File Structure

```
apps/api/
├── src/
│   ├── index.ts                 # Entry point (exists)
│   ├── app.ts                   # Express app (exists)
│   ├── config/
│   │   └── index.ts             # Env validation with Zod
│   ├── middleware/
│   │   ├── errorHandler.ts      # Global error handler (exists)
│   │   ├── auth.ts              # JWT authentication middleware
│   │   ├── rateLimit.ts         # Rate limiting middleware
│   │   └── requestId.ts         # Request ID middleware
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── routes.ts        # Auth routes
│   │   │   ├── controller.ts    # Auth controller
│   │   │   ├── service.ts      # Auth business logic
│   │   │   ├── schema.ts       # Zod validation schemas
│   │   │   └── repository.ts   # Auth DB queries
│   │   ├── products/
│   │   │   ├── routes.ts        # Product routes
│   │   │   ├── controller.ts   # Product controller
│   │   │   ├── service.ts      # Product business logic
│   │   │   ├── schema.ts       # Zod validation schemas
│   │   │   └── repository.ts   # Product DB queries
│   │   └── orders/
│   │       ├── routes.ts        # Order routes
│   │       ├── controller.ts   # Order controller
│   │       ├── service.ts      # Order business logic
│   │       ├── schema.ts       # Zod validation schemas
│   │       └── repository.ts   # Order DB queries
│   ├── lib/
│   │   ├── jwt.ts              # JWT utilities
│   │   ├── password.ts         # bcrypt utilities
│   │   ├── meilisearch.ts      # Meilisearch client
│   │   └── logger.ts           # Winston logger
│   └── utils/
│       └── asyncHandler.ts      # Express async handler wrapper
├── tests/
│   └── unit/                    # Jest unit tests
```

---

## Tasks

### Task 1: Environment Configuration with Zod

**Files:**

- Create: `apps/api/src/config/index.ts`

- [ ] **Step 1: Install dependencies**

Run: `cd apps/api && pnpm add zod envinfo cookie-parser && pnpm add -D @types/cookie-parser`

- [ ] **Step 2: Create apps/api/src/config/index.ts**

```typescript
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  MEILISEARCH_URL: z.string().default("http://localhost:7700"),
  MEILISEARCH_KEY: z.string().default("masterKey"),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("Environment validation failed:", result.error.format());
    process.exit(1);
  }

  return result.data;
}

export const env = loadEnv();
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/config/ && git commit -m "feat(api): add Zod environment validation"
```

---

### Task 2: JWT & Password Utilities

**Files:**

- Create: `apps/api/src/lib/jwt.ts`
- Create: `apps/api/src/lib/password.ts`

- [ ] **Step 1: Install jsonwebtoken and bcryptjs**

Run: `cd apps/api && pnpm add jsonwebtoken bcryptjs && pnpm add -D @types/jsonwebtoken @types/bcryptjs`

- [ ] **Step 2: Create apps/api/src/lib/jwt.ts**

```typescript
import jwt from "jsonwebtoken";
import { env } from "../config/index.js";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "CUSTOMER" | "ADMIN" | "SUPERADMIN";
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
}
```

- [ ] **Step 3: Create apps/api/src/lib/password.ts**

```typescript
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/lib/ && git commit -m "feat(api): add JWT and password utilities"
```

---

### Task 3: Logger & Request ID Middleware

**Files:**

- Create: `apps/api/src/lib/logger.ts`
- Create: `apps/api/src/middleware/requestId.ts`

- [ ] **Step 1: Install winston and uuid**

Run: `cd apps/api && pnpm add winston uuid && pnpm add -D @types/uuid`

- [ ] **Step 2: Create apps/api/src/lib/logger.ts**

```typescript
import winston from "winston";
import { env } from "../config/index.js";

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

export const logger = winston.createLogger({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  defaultMeta: { service: "kicksmtaani-api" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});
```

- [ ] **Step 3: Create apps/api/src/middleware/requestId.ts**

```typescript
import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from "express";

export interface RequestWithId extends Request {
  id: string;
}

export function requestIdMiddleware(
  req: RequestWithId,
  res: Response,
  next: NextFunction,
) {
  req.id = (req.headers["x-request-id"] as string) || uuidv4();
  res.setHeader("x-request-id", req.id);
  next();
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/lib/ apps/api/src/middleware/ && git commit -m "feat(api): add Winston logger and request ID middleware"
```

---

### Task 4: Rate Limiting Middleware

**Files:**

- Create: `apps/api/src/middleware/rateLimit.ts`

- [ ] **Step 1: Install express-rate-limit**

Run: `cd apps/api && pnpm add express-rate-limit`

- [ ] **Step 2: Create apps/api/src/middleware/rateLimit.ts**

```typescript
import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests, please try again later",
    },
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many auth attempts, please try again later",
    },
  },
  skipSuccessfulRequests: true,
});
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/middleware/rateLimit.ts && git commit -m "feat(api): add rate limiting middleware"
```

---

### Task 5: Auth Middleware & Async Handler

**Files:**

- Create: `apps/api/src/middleware/auth.ts`
- Create: `apps/api/src/utils/asyncHandler.ts`

- [ ] **Step 1: Create apps/api/src/middleware/auth.ts**

```typescript
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../lib/jwt.js";

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "No token provided" },
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Invalid or expired token" },
    });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { code: "FORBIDDEN", message: "Insufficient permissions" },
      });
    }

    next();
  };
}
```

- [ ] **Step 2: Create apps/api/src/utils/asyncHandler.ts**

```typescript
import { Request, Response, NextFunction, RequestHandler } from "express";

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/middleware/auth.ts apps/api/src/utils/asyncHandler.ts && git commit -m "feat(api): add auth middleware and async handler"
```

---

### Task 6: Auth Module - Repository, Service, Controller, Routes

**Files:**

- Create: `apps/api/src/modules/auth/repository.ts`
- Create: `apps/api/src/modules/auth/service.ts`
- Create: `apps/api/src/modules/auth/schema.ts`
- Create: `apps/api/src/modules/auth/controller.ts`
- Create: `apps/api/src/modules/auth/routes.ts`

- [ ] **Step 1: Create apps/api/src/modules/auth/schema.ts**

```typescript
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(
      /^\+254[7-9]\d{8}$/,
      "Invalid Kenyan phone number (e.g., +254712345678)",
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
```

- [ ] **Step 2: Create apps/api/src/modules/auth/repository.ts**

```typescript
import { prisma } from "@kicksmtaani/db";
import { hashPassword, verifyPassword } from "../../lib/password.js";

export async function createUser(data: {
  email: string;
  phone: string;
  password: string;
  fullName: string;
}) {
  const passwordHash = await hashPassword(data.password);
  return prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      phone: data.phone,
      passwordHash,
      fullName: data.fullName,
    },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

export async function validateUserPassword(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return null;

  return user;
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}
```

- [ ] **Step 3: Create apps/api/src/modules/auth/service.ts**

```typescript
import {
  registerSchema,
  loginSchema,
  RegisterInput,
  LoginInput,
} from "./schema.js";
import {
  createUser,
  validateUserPassword,
  findUserById,
} from "./repository.js";
import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
} from "../../lib/jwt.js";
import { logger } from "../../lib/logger.js";

export async function register(input: RegisterInput) {
  const data = registerSchema.parse(input);

  const user = await createUser({
    email: data.email,
    phone: data.phone,
    password: data.password,
    fullName: data.fullName,
  });

  logger.info("User registered", { userId: user.id, email: user.email });

  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

export async function login(input: LoginInput) {
  const data = loginSchema.parse(input);

  const user = await validateUserPassword(data.email, data.password);
  if (!user) {
    throw {
      statusCode: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password",
    };
  }

  logger.info("User logged in", { userId: user.id });

  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

export async function getProfile(userId: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw { statusCode: 404, code: "NOT_FOUND", message: "User not found" };
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };
}
```

- [ ] **Step 4: Create apps/api/src/modules/auth/controller.ts**

```typescript
import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as authService from "./service.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);

  res.status(201).json({
    success: true,
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({
    success: true,
    data: { user: result.user, accessToken: result.accessToken },
  });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const profile = await authService.getProfile(user.userId);

  res.json({
    success: true,
    data: profile,
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("refreshToken");

  res.json({
    success: true,
    data: { message: "Logged out successfully" },
  });
});
```

- [ ] **Step 5: Create apps/api/src/modules/auth/routes.ts**

```typescript
import { Router } from "express";
import * as authController from "./controller.js";
import { authenticate } from "../../middleware/auth.js";
import {
  authRateLimiter,
  generalRateLimiter,
} from "../../middleware/rateLimit.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  asyncHandler(authController.register),
);
router.post("/login", authRateLimiter, asyncHandler(authController.login));
router.post("/logout", authenticate, asyncHandler(authController.logout));
router.get("/me", authenticate, asyncHandler(authController.getProfile));

export default router;
```

- [ ] **Step 6: Commit**

```bash
git add apps/api/src/modules/auth/ && git commit -m "feat(api): add authentication module with register/login"
```

---

### Task 7: Products Module - Repository, Service, Controller, Routes

**Files:**

- Create: `apps/api/src/modules/products/schema.ts`
- Create: `apps/api/src/modules/products/repository.ts`
- Create: `apps/api/src/modules/products/service.ts`
- Create: `apps/api/src/modules/products/controller.ts`
- Create: `apps/api/src/modules/products/routes.ts`

- [ ] **Step 1: Create apps/api/src/modules/products/schema.ts**

```typescript
import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(["MEN", "WOMEN", "BOYS", "GIRLS", "KIDS"]),
  brand: z.string().optional(),
  basePrice: z.number().positive(),
  images: z.array(z.string().url()).optional(),
  variants: z
    .array(
      z.object({
        size: z.string(),
        color: z.string().optional(),
        sku: z.string(),
        stockQty: z.number().int().min(0),
        priceOverride: z.number().optional(),
      }),
    )
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  category: z.enum(["MEN", "WOMEN", "BOYS", "GIRLS", "KIDS"]).optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
```

- [ ] **Step 2: Create apps/api/src/modules/products/repository.ts**

```typescript
import { prisma, ProductCategory } from "@kicksmtaani/db";
import { ProductQuery } from "./schema.js";

export async function createProduct(data: any) {
  const { variants, ...productData } = data;

  return prisma.product.create({
    data: {
      ...productData,
      variants: variants ? { create: variants } : undefined,
    },
    include: { variants: true },
  });
}

export async function getProducts(query: ProductQuery) {
  const { category, brand, minPrice, maxPrice, page, limit } = query;

  const where: any = {};

  if (category) where.category = category;
  if (brand) where.brand = brand;
  if (minPrice || maxPrice) {
    where.basePrice = {};
    if (minPrice) where.basePrice.gte = minPrice;
    if (maxPrice) where.basePrice.lte = maxPrice;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { variants: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, limit };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { variants: true },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  });
}

export async function updateProduct(id: string, data: any) {
  const { variants, ...productData } = data;

  return prisma.product.update({
    where: { id },
    data: {
      ...productData,
      variants: variants ? { deleteMany: {}, create: variants } : undefined,
    },
    include: { variants: true },
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.update({
    where: { id },
    data: { isActive: false },
  });
}

export async function getAllBrands() {
  const products = await prisma.product.findMany({
    select: { brand: true },
    distinct: ["brand"],
    where: { brand: { not: null } },
  });

  return products.map((p) => p.brand).filter(Boolean);
}
```

- [ ] **Step 3: Create apps/api/src/modules/products/service.ts**

```typescript
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  CreateProductInput,
  UpdateProductInput,
} from "./schema.js";
import * as productRepo from "./repository.js";
import { logger } from "../../lib/logger.js";
import {
  indexProduct,
  deleteProduct as deleteFromSearch,
} from "../../lib/meilisearch.js";

export async function createProduct(input: CreateProductInput) {
  const data = createProductSchema.parse(input);

  const product = await productRepo.createProduct({
    ...data,
    basePrice: data.basePrice,
  });

  logger.info("Product created", { productId: product.id, name: product.name });

  try {
    await indexProduct(product);
  } catch (error) {
    logger.error("Failed to index product in Meilisearch", {
      error,
      productId: product.id,
    });
  }

  return product;
}

export async function listProducts(query: any) {
  const data = productQuerySchema.parse(query);
  return productRepo.getProducts(data);
}

export async function getProduct(slugOrId: string) {
  const product =
    (await productRepo.getProductBySlug(slugOrId)) ||
    (await productRepo.getProductById(slugOrId));

  if (!product) {
    throw { statusCode: 404, code: "NOT_FOUND", message: "Product not found" };
  }

  return product;
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const data = updateProductSchema.parse(input);

  const product = await productRepo.updateProduct(id, data);

  logger.info("Product updated", { productId: id });

  try {
    await indexProduct(product);
  } catch (error) {
    logger.error("Failed to re-index product", { error, productId: id });
  }

  return product;
}

export async function deleteProduct(id: string) {
  await productRepo.deleteProduct(id);

  logger.info("Product deleted (soft)", { productId: id });

  try {
    await deleteFromSearch(id);
  } catch (error) {
    logger.error("Failed to remove product from search", {
      error,
      productId: id,
    });
  }
}

export async function getBrands() {
  return productRepo.getAllBrands();
}
```

- [ ] **Step 4: Create apps/api/src/modules/products/controller.ts**

```typescript
import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as productService from "./service.js";

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await productService.createProduct(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  },
);

export const listProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await productService.listProducts(req.query);

    res.json({
      success: true,
      data: result.products,
      meta: {
        page: result.page,
        total: result.total,
        limit: result.limit,
      },
    });
  },
);

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getProduct(req.params.slug);

  res.json({
    success: true,
    data: product,
  });
});

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await productService.updateProduct(req.params.id, req.body);

    res.json({
      success: true,
      data: product,
    });
  },
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    await productService.deleteProduct(req.params.id);

    res.json({
      success: true,
      data: { message: "Product deleted" },
    });
  },
);

export const getBrands = asyncHandler(async (_req: Request, res: Response) => {
  const brands = await productService.getBrands();

  res.json({
    success: true,
    data: brands,
  });
});
```

- [ ] **Step 5: Create apps/api/src/modules/products/routes.ts**

```typescript
import { Router } from "express";
import * as productController from "./controller.js";
import { authenticate, requireRole } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(productController.listProducts));
router.get("/brands", asyncHandler(productController.getBrands));
router.get("/:slug", asyncHandler(productController.getProduct));

router.post(
  "/",
  authenticate,
  requireRole("ADMIN", "SUPERADMIN"),
  asyncHandler(productController.createProduct),
);
router.put(
  "/:id",
  authenticate,
  requireRole("ADMIN", "SUPERADMIN"),
  asyncHandler(productController.updateProduct),
);
router.delete(
  "/:id",
  authenticate,
  requireRole("ADMIN", "SUPERADMIN"),
  asyncHandler(productController.deleteProduct),
);

export default router;
```

- [ ] **Step 6: Commit**

```bash
git add apps/api/src/modules/products/ && git commit -m "feat(api): add products module with CRUD operations"
```

---

### Task 8: Meilisearch Integration

**Files:**

- Create: `apps/api/src/lib/meilisearch.ts`

- [ ] **Step 1: Install meilisearch**

Run: `cd apps/api && pnpm add meilisearch`

- [ ] **Step 2: Create apps/api/src/lib/meilisearch.ts**

```typescript
import { MeiliSearch } from "meilisearch";
import { env } from "../config/index.js";
import { logger } from "./logger.js";

const client = new MeiliSearch({
  host: env.MEILISEARCH_URL,
  apiKey: env.MEILISEARCH_KEY,
});

const PRODUCTS_INDEX = "products";

export async function initMeilisearch() {
  try {
    await client.createIndex(PRODUCTS_INDEX, { primaryKey: "id" });

    await client.index(PRODUCTS_INDEX).updateSettings({
      searchableAttributes: ["name", "description", "brand", "category"],
      filterableAttributes: ["category", "brand", "basePrice", "isActive"],
      sortableAttributes: ["basePrice", "createdAt"],
    });

    logger.info("Meilisearch initialized");
  } catch (error: any) {
    if (error.code !== "index_already_exists") {
      logger.error("Failed to initialize Meilisearch", { error });
    }
  }
}

export async function indexProduct(product: any) {
  const document = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: product.category,
    brand: product.brand,
    basePrice: Number(product.basePrice),
    images: product.images,
    isActive: product.isActive,
    createdAt: product.createdAt?.getTime(),
  };

  await client.index(PRODUCTS_INDEX).addDocuments([document]);
}

export async function deleteProduct(productId: string) {
  await client.index(PRODUCTS_INDEX).deleteDocument(productId);
}

export async function searchProducts(
  query: string,
  options: { category?: string; brand?: string; limit?: number },
) {
  const filters: string[] = ["isActive = true"];

  if (options.category) filters.push(`category = "${options.category}"`);
  if (options.brand) filters.push(`brand = "${options.brand}"`);

  return client.index(PRODUCTS_INDEX).search(query, {
    filter: filters.join(" AND "),
    limit: options.limit || 20,
  });
}

export { client as meilisearchClient };
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/lib/meilisearch.ts && git commit -m "feat(api): add Meilisearch integration for product search"
```

---

### Task 9: Orders Module - Repository, Service, Controller, Routes

**Files:**

- Create: `apps/api/src/modules/orders/schema.ts`
- Create: `apps/api/src/modules/orders/repository.ts`
- Create: `apps/api/src/modules/orders/service.ts`
- Create: `apps/api/src/modules/orders/controller.ts`
- Create: `apps/api/src/modules/orders/routes.ts`

- [ ] **Step 1: Create apps/api/src/modules/orders/schema.ts**

```typescript
import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().uuid(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
  deliveryAddress: z.object({
    name: z.string().min(1),
    phone: z.string(),
    area: z.string().min(1),
    city: z.string().min(1),
    notes: z.string().optional(),
  }),
  paymentProvider: z.enum(["MPESA", "STRIPE", "FLUTTERWAVE", "CASH"]),
  phoneNumber: z.string().optional(), // For M-Pesa
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
});

export const orderQuerySchema = z.object({
  status: z
    .enum([
      "PENDING",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED",
    ])
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderQuery = z.infer<typeof orderQuerySchema>;
```

- [ ] **Step 2: Create apps/api/src/modules/orders/repository.ts**

```typescript
import { prisma } from "@kicksmtaani/db";
import { OrderQuery } from "./schema.js";

export async function createOrder(data: {
  userId?: string;
  totalAmount: number;
  deliveryAddress: any;
  items: { variantId: string; quantity: number; price: number }[];
}) {
  return prisma.$transaction(async (tx) => {
    // Get order number
    const lastOrder = await tx.order.findFirst({
      orderBy: { createdAt: "desc" },
    });

    const orderNumber = lastOrder
      ? `KM-${String(parseInt(lastOrder.orderNumber.slice(3)) + 1).padStart(5, "0")}`
      : "KM-00001";

    // Create order with items
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: data.userId,
        totalAmount: data.totalAmount,
        deliveryAddress: data.deliveryAddress,
        items: {
          create: data.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: { include: { variant: true } }, user: true },
    });

    // Decrement stock for each item
    for (const item of data.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stockQty: { decrement: item.quantity } },
      });
    }

    return order;
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { variant: true } },
      user: true,
      payments: true,
    },
  });
}

export async function getOrders(
  userId: string,
  query: OrderQuery,
  isAdmin: boolean,
) {
  const { status, page, limit } = query;

  const where: any = {};

  if (!isAdmin) {
    where.userId = userId;
  }

  if (status) {
    where.status = status;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { user: true, items: { include: { variant: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, page, limit };
}

export async function updateOrderStatus(id: string, status: string) {
  return prisma.order.update({
    where: { id },
    data: { status: status as any },
    include: { user: true, items: { include: { variant: true } } },
  });
}

export async function createPayment(data: {
  orderId: string;
  provider: string;
  amount: number;
  phoneNumber?: string;
}) {
  return prisma.payment.create({
    data: {
      orderId: data.orderId,
      provider: data.provider as any,
      amount: data.amount,
      phoneNumber: data.phoneNumber,
      status: "PENDING",
    },
  });
}
```

- [ ] **Step 3: Create apps/api/src/modules/orders/service.ts**

```typescript
import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderQuerySchema,
  CreateOrderInput,
} from "./schema.js";
import * as orderRepo from "./repository.js";
import { prisma } from "@kicksmtaani/db";
import { logger } from "../../lib/logger.js";

export async function createOrder(
  userId: string | undefined,
  input: CreateOrderInput,
) {
  const data = createOrderSchema.parse(input);

  // Validate stock availability
  for (const item of data.items) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: item.variantId },
    });

    if (!variant) {
      throw {
        statusCode: 400,
        code: "INVALID_ITEM",
        message: `Variant ${item.variantId} not found`,
      };
    }

    if (variant.stockQty < item.quantity) {
      throw {
        statusCode: 400,
        code: "INSUFFICIENT_STOCK",
        message: `Insufficient stock for size ${variant.size}`,
      };
    }
  }

  // Calculate total
  let totalAmount = 0;
  const orderItems: { variantId: string; quantity: number; price: number }[] =
    [];

  for (const item of data.items) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: item.variantId },
      include: { product: true },
    });

    const price = variant?.priceOverride || variant?.product.basePrice || 0;
    totalAmount += price * item.quantity;
    orderItems.push({
      variantId: item.variantId,
      quantity: item.quantity,
      price,
    });
  }

  const order = await orderRepo.createOrder({
    userId,
    totalAmount,
    deliveryAddress: data.deliveryAddress,
    items: orderItems,
  });

  // Create payment record
  await orderRepo.createPayment({
    orderId: order.id,
    provider: data.paymentProvider,
    amount: totalAmount,
    phoneNumber: data.phoneNumber,
  });

  logger.info("Order created", {
    orderId: order.id,
    orderNumber: order.orderNumber,
    totalAmount,
  });

  return order;
}

export async function getOrder(id: string, userId: string, isAdmin: boolean) {
  const order = await orderRepo.getOrderById(id);

  if (!order) {
    throw { statusCode: 404, code: "NOT_FOUND", message: "Order not found" };
  }

  // Check ownership for non-admin
  if (!isAdmin && order.userId !== userId) {
    throw { statusCode: 403, code: "FORBIDDEN", message: "Access denied" };
  }

  return order;
}

export async function listOrders(userId: string, query: any, isAdmin: boolean) {
  const data = orderQuerySchema.parse(query);
  return orderRepo.getOrders(userId, data, isAdmin);
}

export async function updateOrderStatus(id: string, input: any) {
  const data = updateOrderStatusSchema.parse(input);

  const order = await orderRepo.updateOrderStatus(id, data.status);

  logger.info("Order status updated", { orderId: id, status: data.status });

  return order;
}
```

- [ ] **Step 4: Create apps/api/src/modules/orders/controller.ts**

```typescript
import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as orderService from "./service.js";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const order = await orderService.createOrder(user?.userId, req.body);

  res.status(201).json({
    success: true,
    data: order,
  });
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";

  const order = await orderService.getOrder(
    req.params.id,
    user?.userId,
    isAdmin,
  );

  res.json({
    success: true,
    data: order,
  });
});

export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";

  const result = await orderService.listOrders(
    user?.userId,
    req.query,
    isAdmin,
  );

  res.json({
    success: true,
    data: result.orders,
    meta: {
      page: result.page,
      total: result.total,
      limit: result.limit,
    },
  });
});

export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await orderService.updateOrderStatus(req.params.id, req.body);

    res.json({
      success: true,
      data: order,
    });
  },
);
```

- [ ] **Step 5: Create apps/api/src/modules/orders/routes.ts**

```typescript
import { Router } from "express";
import * as orderController from "./controller.js";
import { authenticate, requireRole } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

router.get("/", authenticate, asyncHandler(orderController.listOrders));
router.get("/:id", authenticate, asyncHandler(orderController.getOrder));
router.post("/", authenticate, asyncHandler(orderController.createOrder));
router.put(
  "/:id/status",
  authenticate,
  requireRole("ADMIN", "SUPERADMIN"),
  asyncHandler(orderController.updateOrderStatus),
);

export default router;
```

- [ ] **Step 6: Commit**

```bash
git add apps/api/src/modules/orders/ && git commit -m "feat(api): add orders module with stock management"
```

---

### Task 10: Wire Up All Routes in app.ts

**Files:**

- Modify: `apps/api/src/app.ts`

- [ ] **Step 1: Update apps/api/src/app.ts**

```typescript
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler";
import { requestIdMiddleware } from "./middleware/requestId";
import { generalRateLimiter } from "./middleware/rateLimit";
import authRoutes from "./modules/auth/routes";
import productRoutes from "./modules/products/routes";
import orderRoutes from "./modules/orders/routes";
import { logger } from "./lib/logger";
import { initMeilisearch } from "./lib/meilisearch";

export const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing with size limit
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(require("cookie-parser")());

// Rate limiting
app.use(generalRateLimiter);

// Request ID
app.use(requestIdMiddleware);

// Logging
app.use(
  morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } }),
);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);

// Initialize Meilisearch
initMeilisearch().catch((err) =>
  logger.error("Meilisearch init failed", { err }),
);

// Error handler (must be last)
app.use(errorHandler);
```

- [ ] **Step 2: Test that API starts**

Run: `pnpm --filter @kicksmtaani/api dev`
(Ctrl+C to stop)

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/app.ts && git commit -m "feat(api): wire up all routes and middleware"
```

---

### Task 11: Add Search Endpoint

**Files:**

- Modify: `apps/api/src/modules/products/routes.ts`

- [ ] **Step 1: Add search route to products/routes.ts**

Add after the existing routes:

```typescript
router.get(
  "/search",
  asyncHandler(async (req: Request, res: Response) => {
    const { q, category, brand, limit } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_QUERY", message: "Search query required" },
      });
    }

    const results = await searchProducts(q, {
      category: category as string,
      brand: brand as string,
      limit: limit ? parseInt(limit as string) : 20,
    });

    res.json({
      success: true,
      data: results.hits,
      meta: { query: q, estimatedHits: results.estimatedTotalHits },
    });
  }),
);
```

- [ ] **Step 2: Import searchProducts**

Add at top of routes.ts:

```typescript
import { searchProducts } from "../../lib/meilisearch.js";
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/modules/products/routes.ts && git commit -m "feat(api): add product search endpoint"
```

---

## Phase 2 Completion Checklist

**IMPORTANT PREREQUISITE:** Ensure Docker is running and database is accessible.

- [ ] Task 1: Environment Configuration with Zod
- [ ] Task 2: JWT & Password Utilities
- [ ] Task 3: Logger & Request ID Middleware
- [ ] Task 4: Rate Limiting Middleware
- [ ] Task 5: Auth Middleware & Async Handler
- [ ] Task 6: Auth Module (Repository, Service, Controller, Routes)
- [ ] Task 7: Products Module (Repository, Service, Controller, Routes)
- [ ] Task 8: Meilisearch Integration
- [ ] Task 9: Orders Module (Repository, Service, Controller, Routes)
- [ ] Task 10: Wire Up All Routes in app.ts
- [ ] Task 11: Add Search Endpoint
- [ ] Task 12: Add Refresh Token Endpoint

### Task 12: Add Refresh Token Endpoint

**Files:**

- Modify: `apps/api/src/modules/auth/controller.ts`
- Modify: `apps/api/src/modules/auth/routes.ts`

- [ ] **Step 1: Add refresh controller**

Add to `apps/api/src/modules/auth/controller.ts`:

```typescript
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      error: { code: "NO_REFRESH_TOKEN", message: "Refresh token required" },
    });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await findUserById(payload.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: "INVALID_TOKEN", message: "User not found" },
      });
    }

    const newPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    res.json({
      success: true,
      data: { accessToken: generateAccessToken(newPayload) },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message: "Invalid or expired refresh token",
      },
    });
  }
});
```

Add imports at top of controller.ts:

```typescript
import {
  verifyRefreshToken,
  generateAccessToken,
  TokenPayload,
} from "../../lib/jwt.js";
import { findUserById } from "./repository.js";
```

- [ ] **Step 2: Add refresh route**

Add to `apps/api/src/modules/auth/routes.ts`:

```typescript
router.post("/refresh", asyncHandler(authController.refresh));
```

- [ ] **Step 3: Commit**

```bash
git add apps/api/src/modules/auth/ && git commit -m "feat(api): add refresh token endpoint"
```

---

### Task 13: Run Prisma Migration

**Files:**

- Create: `apps/api/prisma/migrations/`

- [ ] **Step 1: Ensure Docker services are running**

Run: `docker compose up -d` (or `docker-compose up -d`)

- [ ] **Step 2: Run Prisma migration**

Run: `pnpm --filter @kicksmtaani/db db:generate && pnpm --filter @kicksmtaani/db db:migrate`

- [ ] **Step 3: Commit**

```bash
git add packages/db/prisma/ && git commit -m "chore: add Prisma migrations"
```
