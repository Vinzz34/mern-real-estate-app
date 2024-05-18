import express from "express"
import bcrypt from "bcrypt"
import User from "../models/user.model.js"
import errorHandler from "../utils/errorHandler.js"

const router = express.Router()

router.post('/sign-up', async (req,res,next) => {
    const {username,email,password} = req.body

    const salt = bcrypt.genSaltSync()
    const hashedPassword = bcrypt.hashSync(password,salt)

    try{
        await User.create({username,email,password: hashedPassword})
        res.status(201).json("User Created Successfully")
    }
    catch(error){
        next(error)
    }

})

export default router