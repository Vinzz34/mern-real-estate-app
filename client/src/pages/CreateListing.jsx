
const CreateListing = () => {
  return (
    <section className="p-3 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-center my-7">Create a Listing</h2>
      <form className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-col gap-4 flex-1">
          <input className="p-3 rounded-md border" placeholder="Name" type="text" />
          <textarea className="p-3 rounded-md border" placeholder="Description" />
          <input className="p-3 rounded-md border" placeholder="Address" type="text" />
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input className="w-5 h-6" type="checkbox" />
              <label>Sell</label>
            </div>
            <div className="flex items-center gap-2">
              <input className="w-5 h-6" type="checkbox" />
              <label>Rent</label>
            </div>
            <div className="flex items-center gap-2">
              <input className="w-5 h-6" type="checkbox" />
              <label>Parking Spot</label>
            </div>
            <div className="flex items-center gap-2">
              <input className="w-5 h-6" type="checkbox" />
              <label>Furnished</label>
            </div>
            <div className="flex items-center gap-2">
              <input className="w-5 h-6" type="checkbox" />
              <label>Offer</label>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input className="p-3 rounded-md border border-gray-300" type="number" min={1} max={10} />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input className="p-3 rounded-md border border-gray-300" type="number" min={1} max={10} />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input className="p-3 rounded-md border border-gray-300" type="number" min={50} max={10000000} />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input className="p-3 rounded-md border border-gray-300" type="number" min={50} max={10000000} />
              <div className="flex flex-col items-center">
                <p>Discount price</p>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-bold">Images: <span className="text-gray-500 text-md font-normal">The first image will be the cover (max 6)</span></p>
          <div className="flex gap-4">
            <input className="p-3 border border-gray-300 w-full" type="file" accept="image/*" multiple />
            <button className="p-3 border border-green-700 text-green-700 rounded-sm uppercase hover:shadow-lg disabled:opacity-80">Upload</button>
          </div>
          <button className="p-3 mt-4 text-white bg-slate-700 uppercase rounded-md hover:opacity-95 disabled:opacity-80">create listing</button>
        </div>
      </form>
    </section>
  )
}

export default CreateListing