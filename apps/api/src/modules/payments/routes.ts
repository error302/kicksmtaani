import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { handleMpesaWebhook, handleFlutterwaveWebhook, handlePaypalWebhook } from "./controller.js";

const router: ExpressRouter = Router();

router.post("/webhook/mpesa", handleMpesaWebhook);
router.post("/webhook/flutterwave", handleFlutterwaveWebhook);
router.post("/webhook/paypal", handlePaypalWebhook);

export default router;
