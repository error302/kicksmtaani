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
