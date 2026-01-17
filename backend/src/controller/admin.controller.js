import cloudinary from "../config/cloudinary.js"
import { Product } from "../models/product.model.js"
import { Order } from "../models/order.model.js"
import { User } from "../models/user.model.js"


export async function createProduct(req, res) {
    try {
        const { name, description, price, stock, category } = req.body

        if (!name || !description || !price || !stock || !category) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" })
        }

        if (req.files.length > 3) {
            return res.status(400).json({ message: "Maximum 3 images allowed" })
        }

        const uploadPromises = req.files.map((file) => {
            return cloudinary.uploader.upload(file.path, {
                folder: "products"
            })
        })

        const uploadResult = await Promise.all(uploadPromises)
        //secure_url for each images
        const imageUrls = uploadResult.map((result) => result.secure_url)

        const product = await Product.create({
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            category,
            images: imageUrls
        })

        res.status(201).json(product)

    } catch (error) {
        console.error("Error creating product: ", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export async function getAllProduct(_, res) {
    try {
        //-1 means decending order: most recent product first
        const products = await Product.find().sort({ createdAt: -1 })
        res.status(200).json(products)
    } catch (error) {
        console.error("Error fetching product: ", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export async function updateProduct(req, res) {
    try {
        const { id } = req.params
        const { name, description, price, stock, category } = req.body

        const existingProduct = await Product.findById(id)

        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" })
        }

        if (name) existingProduct.name = name
        if (description) existingProduct.description = description
        if (price !== undefined) existingProduct.price = parseFloat(price)
        if (stock !== undefined) existingProduct.stock = parseInt(stock)
        if (category) existingProduct.category = category

        //handle image update if new images are uploaded
        if (req.files && req.files.length > 0) {
            if (req.files.length > 3) {
                return res.status(400).json({ message: "Maximum 3 images allowed" })
            }

            const uploadPromises = req.files.map((file) => {
                return cloudinary.uploader.upload(file.path, {
                    folder: "products"
                })
            })
            const uploadResults = await Promise.all(uploadPromises)
            existingProduct.images = uploadResults.map((result) => result.secure_url)
        }

        const updatedProduct = await existingProduct.save()

        res.status(200).json(updatedProduct)

    } catch (error) {
        console.error("Error updating product: ", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export async function getAllOrders(req, res) {
    try {
        //populate from that id mongoDB may find the user model to find name email ex
        const orders = await Order.find()
            .populate("userId", "name email")
            .populate("orderItems.productId") 
            .sort({ createdAt: -1 })


        res.status(200).json({ orders })

    } catch (error) {
        console.error("Error fetching orders: ", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export async function updateOrderStatus(req, res) {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        
        

        if (!["pending", "shipped", "delivered"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" })
        }

        const existingOrder = await Order.findById(orderId)
        if (!existingOrder) {
            return res.status(404).json({ error: "Order not found" })
        }

        existingOrder.status = status

        if (status === "shipped" && !existingOrder.shippedAt) {
            existingOrder.shippedAt = new Date()
        }

        if (status === "delivered" && !existingOrder.deliveredAt) {
            existingOrder.deliveredAt = new Date()
        }

        const updatedOrder = await existingOrder.save()
        res.status(200).json({ message: "Order status updated successfully", updatedOrder })

    } catch (error) {
        console.error("Error fetching orders: ", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export async function getAllCustomers(_, res) {
    try {
        const customers = await User.find().sort({ createdAt: -1 }); //latest user first
        res.status(200).json({ customers })
    } catch (error) {
        console.error("Error fetching users: ", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export async function getDashboardStats(_, res) {
    try {
        const totalOrders = await Order.countDocuments()
        const revenueResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalPrice" }
                }
            }
        ])

        const totalRevenue = revenueResult[0]?.total || 0
        const totalCustomers = await User.countDocuments()

        const totalProducts = await Product.countDocuments()

        res.status(200).json({
            totalRevenue,
            totalOrders,
            totalCustomers,
            totalProducts
        })
    } catch (error) {
        console.error("Error fetching dashboard stats: ", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export async function deleteProductById(req, res) {
    try {
        const { id } = req.params
        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        //delete image from cloudinary
        if (product.images && product.images.length > 0) {
            const deletePromises = product.images.map((imageUrl) => {
                // Extract public_id from URL (assumes format: .../products/publicId.ext)
                const publicId = "products/" + imageUrl.split("/products/")[1]?.split(".")[0];
                if (publicId) return cloudinary.uploader.destroy(publicId)
            })
            await Promise.all(deletePromises.filter(Boolean))
        }

        await Product.findByIdAndDelete(id)
        res.status(200).json({ message: "Delete product successfully" })
    } catch (error) {
        console.error("Error deleting product: ", error.message)
        res.status(500).json({ message: "Internal server error" })
    }

}