import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createOrders, getUserOrders } from "../controller/order.controller.js";

const router = Router()

//create order
router.post("/",protectRoute,createOrders)
router.get("/",protectRoute,getUserOrders)


export default router