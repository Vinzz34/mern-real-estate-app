import express from "express";
import {
  updateUser,
  deleteUser,
  getUserListings,
  getUser,
} from "../controllers/user.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";

const router = express.Router();

router.use(verifyUser);
router.patch("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.get("/listings/:id", getUserListings);
router.get("/:id", getUser);

export default router;
