import { Router } from "express";
import { addAddress, addToWishlist, deleteAddress, getAddress, getWishlist, removeFromWishlist, updateAddress } from "../controller/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router()

router.use(protectRoute)

//address routes
router.post("/addresses", addAddress)
router.get("/getAddresses", getAddress)
router.put("/addresses/:addressId", updateAddress)
router.delete("/addresses/:addressId", deleteAddress)

//wishlist route
router.post("/wishlist", addToWishlist)
router.delete("/wishlist/:productId", removeFromWishlist)
router.get("/wishlist", getWishlist)

export default router

