import express from "express"
import { createListing } from "../controllers/listing.controller.js"
import { verifyUser } from "../middleware/verifyUser.js"

const router = express.Router()

router.use(verifyUser)
router.post('/create',createListing)

export default router