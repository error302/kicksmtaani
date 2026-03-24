import { z } from "zod";

const mpesaSchema = z.object({
  consumerKey: z.string().min(1, "MPESA_CONSUMER_KEY is required"),
  consumerSecret: z.string().min(1, "MPESA_CONSUMER_SECRET is required"),
  shortcode: z.string().min(1, "MPESA_SHORTCODE is required"),
  passkey: z.string().min(1, "MPESA_PASSKEY is required"),
  callbackUrl: z.string().url("MPESA_CALLBACK_URL must be a valid URL"),
});

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
  MPESA_CONSUMER_KEY: z.string().default(""),
  MPESA_CONSUMER_SECRET: z.string().default(""),
  MPESA_SHORTCODE: z.string().default(""),
  MPESA_PASSKEY: z.string().default(""),
  MPESA_CALLBACK_URL: z.string().default(""),
  FLUTTERWAVE_PUBLIC_KEY: z.string().default(""),
  FLUTTERWAVE_SECRET_KEY: z.string().default(""),
  FLUTTERWAVE_CALLBACK_URL: z.string().default(""),
});

export type Env = z.infer<typeof envSchema>;
export type MpesaConfig = z.infer<typeof mpesaSchema>;

export interface FlutterwaveConfig {
  publicKey: string;
  secretKey: string;
  callbackUrl: string;
}

function loadEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("Environment validation failed:", result.error.format());
    process.exit(1);
  }

  return result.data;
}

export const env = loadEnv();

export const config = {
  mpesa: {
    consumerKey: env.MPESA_CONSUMER_KEY,
    consumerSecret: env.MPESA_CONSUMER_SECRET,
    shortcode: env.MPESA_SHORTCODE,
    passkey: env.MPESA_PASSKEY,
    callbackUrl: env.MPESA_CALLBACK_URL,
  },
  flutterwave: {
    publicKey: env.FLUTTERWAVE_PUBLIC_KEY,
    secretKey: env.FLUTTERWAVE_SECRET_KEY,
    callbackUrl: env.FLUTTERWAVE_CALLBACK_URL,
  },
};
