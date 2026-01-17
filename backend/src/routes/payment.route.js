import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPaymentIntent, handleWebhook } from "../controller/payment.controller.js";

const router = Router()

//payment req => payment intent
router.post("/create-intent", protectRoute, createPaymentIntent)

//No auth need- Stripe validates via signature
router.post("/webhook", handleWebhook)

export default router