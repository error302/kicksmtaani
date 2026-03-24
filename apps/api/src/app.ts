import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler";
import { requestIdMiddleware } from "./middleware/requestId";
import { generalRateLimiter } from "./middleware/rateLimit";
import authRoutes from "./modules/auth/routes";
import productRoutes from "./modules/products/routes";
import orderRoutes from "./modules/orders/routes";
import paymentRoutes from "./modules/payments/routes";
import adminRoutes from "./modules/admin/routes";
import { logger } from "./lib/logger";
import { initMeilisearch } from "./lib/meilisearch";

export const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing with size limit
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
app.use("/api/v1", paymentRoutes);
app.use("/api/v1/admin", adminRoutes);

// Initialize Meilisearch
initMeilisearch().catch((err) =>
  logger.error("Meilisearch init failed", { err }),
);

// Error handler (must be last)
app.use(errorHandler);
