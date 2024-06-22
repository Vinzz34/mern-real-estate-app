const Search = () => {
  return (
    <div className="flex flex-col sm:flex-row">
      <form className="flex flex-col gap-8 p-7 border-b-2 sm:border-r-2 sm:min-h-screen">
        <div className="flex items-center gap-2">
          <label className="whitespace-nowrap" htmlFor="search">
            Search Term:
          </label>
          <input
            className="p-3 rounded-md border w-full"
            type="text"
            placeholder="Search..."
            id="search"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label>Type:</label>
          <div className="flex items-center gap-2">
            <input className="w-5 h-5" type="checkbox" id="all" />
            <label htmlFor="all">Rent & Sale</label>
          </div>
          <div className="flex items-center gap-2">
            <input className="w-5 h-5" type="checkbox" id="rent" />
            <label htmlFor="rent">Rent</label>
          </div>
          <div className="flex items-center gap-2">
            <input className="w-5 h-5" type="checkbox" id="sell" />
            <label htmlFor="sell">Sale</label>
          </div>
          <div className="flex items-center gap-2">
            <input className="w-5 h-5" type="checkbox" id="offer" />
            <label htmlFor="offer">Offer</label>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label>Amenities:</label>
          <div className="flex items-center gap-2">
            <input className="w-5 h-5" type="checkbox" id="parking" />
            <label htmlFor="parking">Parking</label>
          </div>
          <div className="flex items-center gap-2">
            <input className="w-5 h-5" type="checkbox" id="furnished" />
            <label htmlFor="furnished">Furnished</label>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort_order">Sort: </label>
          <select className="p-3 rounded-md border" id="sort_order">
            <option>Price high to low</option>
            <option>Price low to high</option>
            <option>Latest</option>
            <option>Oldest</option>
          </select>
        </div>
        <button className="p-3 text-white bg-slate-700 rounded-md uppercase hover:opacity-95">
          search
        </button>
      </form>
      <div className="m-5">
        <h2 className="text-3xl font-semibold text-slate-700 border-b p-3">
          Listing results:
        </h2>
      </div>
    </div>
  );
};

export default Search;
