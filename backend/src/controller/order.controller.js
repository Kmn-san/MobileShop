import { Order } from "../models/order.model.js"
import { Product } from "../models/product.model.js"
import { Review } from "../models/review.model.js"

export async function createOrders(req, res) {
    try {
        const user = req.user
        const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ error: "No order items" })
        }

        //validate products and stock
        //todo check later if this is working or not
        for (const item of orderItems) {
            const product = await Product.findById(item.productId._id)
            if (!product) {
                return res.status(404).json({ error: `Product ${item.name} not found` })
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for ${product.name}` })
            }
        }

        const order = await Order.create({
            user: user._id,
            clerkId: user.clerkId,
            orderItems,
            shippingAddress,
            paymentResult,
            totalPrice
        })

        //update product stock
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity }
            })
        }

        res.status(201).json({ message: "Order created successfully", order })

    } catch (error) {
        console.error("Error in createOrders controller: ", error.message)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export async function getUserOrders(req, res) {
    try {
        const orders = await Order.find({ clerkId: req.user.clerkId })
            .populate("orderItems.productId")
            .sort({ createdAt: -1 })

        //check if each order has been reviewed
        //check if each order has been reviewed
        const orderIds = orders.map(order => order._id)
        const reviews = await Review.find({ orderId: { $in: orderIds } })
        const reviewedOrderIds = new Set(reviews.map(review => review.orderId.toString()))

        const orderWithReviewStatus = orders.map(order => ({
            ...order.toObject(),
            hasReviewed: reviewedOrderIds.has(order._id.toString())
        }))

        //double bang operator in js
        res.status(200).json({ orders: orderWithReviewStatus })
    } catch (error) {
        console.error("Error in getUserOrders controller: ", error.message)
        return res.status(500).json({ error: "Internal server error" })
    }
}