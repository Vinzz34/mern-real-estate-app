import Listing from "../models/listing.model.js";
import errorHandler from "../utils/errorHandler.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listing"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted Listing Successfully!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listing"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 9;
  const startIndex = parseInt(req.query.startIndex) || 0;

  let offer = req.query.offer || false;
  let furnished = req.query.furnished || false;
  let parking = req.query.parking || false;
  let type = req.query.type || "all";

  if (!offer) {
    offer = { $in: [false, true] };
  }

  if (!furnished) {
    furnished = { $in: [false, true] };
  }

  if (!parking) {
    parking = { $in: [false, true] };
  }

  if (type === "all") {
    type = { $in: ["sell", "rent"] };
  }

  const searchTerm = req.query.searchTerm || "";
  const sort = req.query.sort || "createdAt";
  const order = req.query.order || "desc";

  try {
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
