import mongoose from "mongoose"
import {ENV} from "./env.js"

export const connectDB = async() =>{
    try {
        const conn = await mongoose.connect(ENV.DB_URL)
        console.log('✅ Connect to MONGODB');
        
    } catch (error) {
        console.error('💣 MONGODB connection error')
        process.exit(1)// exit code i means failure , 0 means success 
    }
}
