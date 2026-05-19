import { Router, Request, Response } from "express";
import * as productController from "./controller.js";
import { authenticate, requireRole } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { searchProducts } from "../../lib/meilisearch.js";

const router = Router();

router.get("/", asyncHandler(productController.listProducts));
router.get("/brands", asyncHandler(productController.getBrands));

router.get(
  "/search",
  asyncHandler(async (req: Request, res: Response) => {
    const { q, category, brand, minPrice, maxPrice, sort, limit } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_QUERY", message: "Search query required" },
      });
    }

    const results = await searchProducts(q, {
      category: category as string,
      brand: brand as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort: sort as string,
      limit: limit ? parseInt(limit as string) : 20,
    });

    res.json({
      success: true,
      data: results.hits,
      meta: { query: q, estimatedHits: results.estimatedTotalHits },
    });
  }),
);

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
