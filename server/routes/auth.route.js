import express from "express"
import { signup,signin } from "../controllers.js/auth.controller.js"

const router = express.Router()

router.post('/sign-up', signup)

router.post('/sign-in', signin)

export default router