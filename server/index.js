import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.listen(3000,() => {
    console.log("Server running on port 3000")
})

mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log("Connected to database")
    })
    .catch((err) => {
        console.log(err)
    })