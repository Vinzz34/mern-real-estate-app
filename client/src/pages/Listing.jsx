import { useState } from "react";
import instance from "../api/api_instance";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";
import Contact from "../components/Contact";
import Loading from "../components/Loading";
import { useUserStore } from "../store";
import { useQuery } from "@tanstack/react-query";

const fetchListing = async (id) => {
  const response = await instance.get(`/listing/${id}`);
  return response.data;
};

const Listing = () => {
  SwiperCore.use([Navigation]);
  const { id } = useParams();

  const { user } = useUserStore();

  const [copy, setCopy] = useState(false);
  const [contact, setContact] = useState(false);

  const {
    data: listing,
    isLoading: loading,
    error,
  } = useQuery({ queryKey: ["listing", id], queryFn: () => fetchListing(id) });

  return (
    <div>
      {" "}
      {loading && <Loading />}{" "}
      {error && (
        <div className="text-2xl text-center">Something went wrong!</div>
      )}{" "}
      {listing && !loading && !error && (
        <div>
          {" "}
          <Swiper navigation>
            {" "}
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <img
                  className="h-[550px] w-full object-cover"
                  src={url}
                  alt="listing image"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopy(true);
              setTimeout(() => {
                setCopy(false);
              }, 3000);
            }}
            className="fixed top-[13%] right-[3%] bg-gray-300 w-12 h-12 rounded-full z-10 grid place-items-center cursor-pointer"
          >
            <FaShare />
          </div>
          {copy && (
            <div className="bg-gray-300 p-3 rounded-md fixed top-[22%] right-[3%] z-10">
              Link Copied!
            </div>
          )}
          <div className="max-w-4xl mx-auto my-7 p-3">
            <h2 className="text-2xl font-semibold mb-6">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-us")
                : listing.regularPrice.toLocaleString("en-us")}
              {listing.type === "rent" && " / month"}
            </h2>

            <div className="flex gap-2 text-sm items-center mb-2">
              <FaMapMarkerAlt className="text-green-700" />
              <p className="text-slate-700 font-semibold">{listing.address}</p>
            </div>

            <div className="flex gap-6 mb-3 items-center">
              <div className="max-w-[200px] bg-red-900 p-1 text-white rounded-md flex-1 text-center">
                {listing.type === "sale" ? "For Sale" : "For Rent"}
              </div>
              {listing.offer && (
                <div className="max-w-[200px] bg-green-900 p-1 text-white rounded-md flex-1 text-center">
                  ${+listing.regularPrice - +listing.discountPrice} discount
                </div>
              )}
            </div>

            <div className="mb-2">
              <span className="text-slate-700 font-semibold">
                Description -
              </span>
              <span> {listing.description}</span>
            </div>

            <div className="flex gap-5 text-green-900 items-center flex-wrap mb-6">
              <div className="flex gap-1 items-center">
                <FaBed />
                <p className="font-semibold text-sm">
                  {listing.beds > 1
                    ? `${listing.beds} beds`
                    : `${listing.beds} bed `}
                </p>
              </div>

              <div className="flex gap-1 items-center">
                <FaBath />
                <p className="font-semibold text-sm">
                  {listing.baths > 1
                    ? `${listing.baths} baths`
                    : `${listing.baths} bath `}
                </p>
              </div>

              <div className="flex gap-1 items-center">
                <FaParking />
                <p className="font-semibold text-sm">
                  {listing.parking ? "Parking spot" : "No Parking"}
                </p>
              </div>

              <div className="flex gap-1 items-center">
                <FaChair />
                <p className="font-semibold text-sm">
                  {listing.furnished ? "Furnished" : "Unfurnished"}
                </p>
              </div>
            </div>

            {user && user._id !== listing.userRef && (
              <button
                onClick={() => setContact(true)}
                className={`${contact ? "hidden" : ""} bg-slate-700 text-white w-full uppercase p-3 rounded-md hover:opacity-95`}
              >
                Contact landlord
              </button>
            )}

            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Listing;
