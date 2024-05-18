import bcrypt from "bcrypt"
import User from "../models/user.model.js"
import errorHandler from "../utils/errorHandler.js"
import jwt from "jsonwebtoken"

export const signup = async (req,res,next) => {
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
}

export const signin = async (req,res,next) => {
    const {email,password} = req.body

    try{

        const validUser = await User.findOne({email})

        if(!validUser){
            return next(errorHandler(404,"User not found"))
        }

        const validPassword = bcrypt.compareSync(password,validUser.password)

        if(!validPassword){
            return next(errorHandler(401,"Invalid Password"))
        }

        const token = jwt.sign({id: validUser._id},process.env.JWT_SECRET);

        const {password: pass, ...rest} = validUser._doc

        res.cookie("access_token",token,{httpOnly: true}).status(200).json(rest)

    }
    catch(error){
        next(error)
    }

}
