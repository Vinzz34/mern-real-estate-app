import express from "express"
import { updateUser } from "../controllers/user.controller.js"
import { verifyUser } from "../middleware/verifyUser.js"

const router = express.Router()

router.use(verifyUser)
router.post('/update/:id',updateUser)

export default router