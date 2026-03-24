import { Router } from "express";
import * as authController from "./controller.js";
import { authenticate } from "../../middleware/auth.js";
import { authRateLimiter } from "../../middleware/rateLimit.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  asyncHandler(authController.register),
);
router.post("/login", authRateLimiter, asyncHandler(authController.login));
router.post("/refresh", asyncHandler(authController.refresh));
router.post("/logout", authenticate, asyncHandler(authController.logout));
router.get("/me", authenticate, asyncHandler(authController.getProfile));

export default router;
