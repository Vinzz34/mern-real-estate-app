import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../controllers/listing.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";

const router = express.Router();

router.get("/:id", getListing);
router.get("/", getListings);

router.use(verifyUser);
router.post("/create", createListing);
router.delete("/delete/:id", deleteListing);
router.patch("/update/:id", updateListing);

export default router;
