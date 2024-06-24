import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import instance from "../api/api_instance";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingCard from "../components/ListingCard";

const Home = () => {
  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const response = await instance("/listing?offer=true&limit=4");
        setOfferListings(response.data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const response = await instance("/listing?type=rent&limit=4");
        setRentListings(response.data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const response = await instance("/listing?type=sell&limit=4");
        setSaleListings(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto px-3 py-28">
        <h1 className="text-3xl lg:text-6xl text-slate-700 font-bold">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-xs sm:text-sm text-slate-500">
          <p>
            Vinzz Estate will help you find your home fast, easy and
            comfortable.
          </p>
          <p>Our expert support are always available.</p>
        </div>
        <Link
          to={`/search`}
          className="text-blue-800 text-xs sm:text-sm font-bold hover:underline"
        >
          Let&apos;s get started...
        </Link>
      </div>

      <div>
        {offerListings && offerListings.length > 0 && (
          <Swiper navigation>
            {offerListings.map((offerListing) => (
              <SwiperSlide key={offerListing._id}>
                <img
                  className="h-[500px] w-full object-cover"
                  src={offerListing.imageUrls[0]}
                  alt="listing cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <div className="max-w-6xl mx-auto p-3 py-10 flex flex-col gap-8">
        {offerListings && offerListings.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-600">Recent offers</h2>
            <Link
              className="text-sm text-blue-800 hover:underline block mb-2"
              to={`/search?offer=true`}
            >
              Show more offers
            </Link>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((offerListing) => (
                <ListingCard key={offerListing._id} listing={offerListing} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-600">
              Recent places for rent
            </h2>
            <Link
              className="text-sm text-blue-800 hover:underline block mb-2"
              to={`/search?type=rent`}
            >
              Show more places for rent
            </Link>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((rentListing) => (
                <ListingCard key={rentListing._id} listing={rentListing} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-600">
              Recent places for sale
            </h2>
            <Link
              className="text-sm text-blue-800 hover:underline block mb-2"
              to={`/search?type=sell`}
            >
              Show more places for sale
            </Link>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((saleListing) => (
                <ListingCard key={saleListing._id} listing={saleListing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
