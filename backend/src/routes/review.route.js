import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createReview, deleteReview } from "../controller/review.controller.js";

const router = Router()

router.post("/", protectRoute, createReview)
// we did not implement this function in the mobile app - in the frontend'
//but this is the backend code
router.delete("/:reviewId", protectRoute, deleteReview)

export default router