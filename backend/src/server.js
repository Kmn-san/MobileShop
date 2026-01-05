import express from "express";
import path from "path"
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express"
import cors from "cors"

import { functions, inngest } from "./config/inngest.js";

import adminRoutes from "./routes/admin.route.js"
import userRoutes from "./routes/user.route.js"
import orderRoutes from "./routes/orders.route.js"
import reviewRoutes from "./routes/review.route.js"
import productsRoutes from "./routes/products.route.js"
import cartRoutes from "./routes/cart.route.js"

const app = express()

const __dirname = path.resolve()
app.use(express.json())
app.use(clerkMiddleware()) //add auth object under the req => req.auth
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true })) // credentials : true allows the browser to send the cookie to the server with the request

app.use("/api/inngest", serve({ client: inngest, functions }))

app.use("/api/admin", adminRoutes)
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/product", productsRoutes)
app.use("/api/cart", cartRoutes)

app.get("/api/health", (req, res) => {

    res.status(200).json({ message: "Success" })
})

//make our app ready for deployment

if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../admin/dist")))

    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"))
    })
}

const startServer = async () => {
    await connectDB();
    app.listen(ENV.PORT, () => {
        console.log("Server is up and running");
    })
}

startServer()