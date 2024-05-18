import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import authRouter from "./routes/auth.route.js"
import error from "./middleware/error.js"

dotenv.config()

const app = express()

mongoose.connect(process.env.MONGO)
    .then(() => {
        app.listen(3000,() => {
            console.log("Connect to database and Server running on port 3000")
        })
    })
    .catch((error) => {
        console.log(error)
    })

app.use(cors())

app.use(express.json())

app.use('/api/auth',authRouter)

app.use(error)