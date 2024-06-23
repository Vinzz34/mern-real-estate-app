import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

/* eslint-disable react/prop-types */
const ListingCard = ({ listing }) => {
  return (
    <div className="w-full sm:w-[330px] rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white overflow-hidden">
      <Link to={`/listing/${listing._id}`}>
        <img
          className="h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
          src={listing.imageUrls[0]}
          alt="listing cover"
        />
        <div className="p-3 mt-2 flex flex-col gap-2">
          <p className="text-lg font-semibold truncate">{listing.name}</p>
          <div className="flex gap-2 items-center">
            <FaMapMarkerAlt className="w-4 h-4 text-green-700" />
            <p className="text-xs">{listing.address}</p>
          </div>
          <p className="text-sm line-clamp-2">{listing.description}</p>
          <p className="font-semibold mt-2">
            ${listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex gap-2">
            <p className="text-xs font-bold">
              {listing.beds} {listing.beds > 1 ? "beds" : "bed"}
            </p>
            <p className="text-xs font-bold">
              {listing.baths} {listing.baths > 1 ? "baths" : "bath"}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
