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
