import mongoose from "mongoose"

const shippingAddressSchame = new mongoose.Schema({
    fullName: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    phoneNumber: { type: String, required: true }
})

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },// if price changes save the one that you bought
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    image: {
        type: String,
        required: true
    }
})

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    clerk: {
        type: String,
        required: true
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
        type: shippingAddressSchame,
        required: true
    },
    paymentResult: {
        id: String,
        status: String
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ["pending", "shipped", "delivered"],
        default: "pending"
    },
    deliveredAt: {
        type: Date
    },
    shippedAt: {
        type: Date
    }
}, { timestamps: true })

export const Order = mongoose.model("Order", orderSchema)