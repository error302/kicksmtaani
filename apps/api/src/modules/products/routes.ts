import { Router } from "express";
import * as productController from "./controller.js";
import { authenticate, requireRole } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { searchProducts } from "../../lib/meilisearch.js";

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

export default router;
