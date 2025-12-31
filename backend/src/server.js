import express from "express";
import "dotenv/config"
const PORT = process.env.PORT
const app = express()

app.get("/api/health",(req ,res) =>{
    res.status(200).json({message:"Success"})
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

})