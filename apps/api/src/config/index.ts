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
