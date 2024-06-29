import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../api/api_instance";
import ListingCard from "../components/ListingCard";
import Loading from "../components/Loading";
import { useInfiniteQuery } from "@tanstack/react-query";

const fetchListings = async ({ queryKey, pageParam }) => {
  const searchQuery = queryKey[1];
  const urlParams = new URLSearchParams(searchQuery);
  urlParams.set("startIndex", pageParam);
  const response = await instance(`/listing?${urlParams.toString()}`);
  return response.data;
};

const Search = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState({
    searchTerm: "",
    type: "all",
    offer: false,
    parking: false,
    furnished: false,
    sort: "createdAt",
    order: "desc",
  });

  const urlParams = new URLSearchParams(window.location.search);

  const {
    data,
    isPending: loading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["searchListings", urlParams.toString()],
    queryFn: fetchListings,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length < 9 ? undefined : pages.length,
  });

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setFilter({ ...filter, searchTerm: e.target.value });
    }

    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sell"
    ) {
      setFilter({ ...filter, type: e.target.id });
    }

    if (
      e.target.id === "offer" ||
      e.target.id === "parking" ||
      e.target.id === "furnished"
    ) {
      setFilter({ ...filter, [e.target.id]: e.target.checked });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0];
      const order = e.target.value.split("_")[1];

      setFilter({ ...filter, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", filter.searchTerm);
    urlParams.set("type", filter.type);
    urlParams.set("offer", filter.offer);
    urlParams.set("parking", filter.parking);
    urlParams.set("furnished", filter.furnished);
    urlParams.set("sort", filter.sort);
    urlParams.set("order", filter.order);

    navigate(`/search/?${urlParams.toString()}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const offerFromUrl = urlParams.get("offer");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      offerFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setFilter({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        offer: offerFromUrl === "true" ? true : false,
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }
  }, [window.location.search]);

  return (
    <div className="flex flex-col md:flex-row">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 p-7 border-b-2 md:border-r-2 md:min-h-screen flex-2"
      >
        <div className="flex items-center gap-2">
          <label className="whitespace-nowrap" htmlFor="search">
            Search Term:
          </label>
          <input
            className="p-3 rounded-md border w-full"
            type="text"
            placeholder="Search..."
            id="searchTerm"
            value={filter.searchTerm}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label>Type:</label>
          <div className="flex items-center gap-2">
            <input
              className="w-5 h-5"
              type="checkbox"
              id="all"
              checked={filter.type === "all"}
              onChange={handleChange}
            />
            <label htmlFor="all">Rent & Sale</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              className="w-5 h-5"
              type="checkbox"
              id="rent"
              checked={filter.type === "rent"}
              onChange={handleChange}
            />
            <label htmlFor="rent">Rent</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              className="w-5 h-5"
              type="checkbox"
              id="sell"
              checked={filter.type === "sell"}
              onChange={handleChange}
            />
            <label htmlFor="sell">Sale</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              className="w-5 h-5"
              type="checkbox"
              id="offer"
              checked={filter.offer}
              onChange={handleChange}
            />
            <label htmlFor="offer">Offer</label>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label>Amenities:</label>
          <div className="flex items-center gap-2">
            <input
              className="w-5 h-5"
              type="checkbox"
              id="parking"
              checked={filter.parking}
              onChange={handleChange}
            />
            <label htmlFor="parking">Parking</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              className="w-5 h-5"
              type="checkbox"
              id="furnished"
              checked={filter.furnished}
              onChange={handleChange}
            />
            <label htmlFor="furnished">Furnished</label>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort_order">Sort: </label>
          <select
            className="p-3 rounded-md border"
            id="sort_order"
            onChange={handleChange}
            value={`${filter.sort}_${filter.order}`}
          >
            <option value="regularPrice_desc">Price high to low</option>
            <option value="regularPrice_asc">Price low to high</option>
            <option value="createdAt_desc">Latest</option>
            <option value="createdAt_asc">Oldest</option>
          </select>
        </div>
        <button className="p-3 text-white bg-slate-700 rounded-md uppercase hover:opacity-95">
          search
        </button>
      </form>
      <div className="flex-1">
        <h2 className="text-3xl font-semibold text-slate-700 border-b p-3 m-5">
          Listing results:
        </h2>
        <div className="p-7 flex flex-wrap gap-4">
          {loading && <Loading />}
          {!loading && data?.pages.flat().length === 0 && (
            <p className="text-lg">No listings found!</p>
          )}
          {!loading &&
            data?.pages.map((page) =>
              page.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              )),
            )}
        </div>
        {hasNextPage && (
          <button
            onClick={fetchNextPage}
            className="text-green-700 hover:underline cursor-pointer px-7 py-3"
          >
            Show more
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
