import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import listingRouter from "./routes/listing.route.js"
import error from "./middleware/error.js"
import cookieParser from "cookie-parser"

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

app.use(cors({credentials: true, origin: process.env.CLIENT_URL}));

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/listing',listingRouter)

app.use(error)