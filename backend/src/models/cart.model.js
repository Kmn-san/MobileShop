import mongoose from "mongoose"

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }
})

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    clerk: {
        type: String,
        required: true,
        unique: true
    },
    items: [cartItemSchema]
}, { timestamps: true })

export const Cart = mongoose.model("Cart", cartSchema)