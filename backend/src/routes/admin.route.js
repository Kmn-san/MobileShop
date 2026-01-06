import { Router } from "express";
import { createProduct, deleteProductById, getAllCustomers, getAllOrders, getAllProduct, getDashboardStats, updateOrderStatus, updateProduct } from "../controller/admin.controller.js";
import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router()

// optimization - dont repeat your code
router.use(protectRoute, adminOnly)

router.post("/products", upload.array("images", 3), createProduct)
router.get("/products", getAllProduct)
router.put("/products/:id", upload.array("images", 3), updateProduct)
router.delete("/products/:id", deleteProductById)

router.get("/orders", getAllOrders)
router.patch("/orders/:orderId/status", updateOrderStatus)

router.get("/customers", getAllCustomers)
router.get("/stats", getDashboardStats)


export default router;