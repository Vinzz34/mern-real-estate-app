import { getApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import instance from "../api/api_instance";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store";
import { useMutation } from "@tanstack/react-query";

const CreateListing = () => {
  const navigate = useNavigate();

  const { user } = useUserStore();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "rent",
    parking: false,
    furnished: false,
    offer: false,
    beds: 1,
    baths: 1,
    regularPrice: 0,
    discountPrice: 0,
    imageUrls: [],
  });

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadImageError, setUploadImageError] = useState(false);

  const handleUpload = () => {
    if (files.length > 0 && files.length < 7) {
      setUploading(true);
      setUploadImageError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(uploadImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setUploading(false);
          setUploadImageError(false);
        })
        // eslint-disable-next-line no-unused-vars
        .catch((error) => {
          setUploadImageError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setUploadImageError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const uploadImage = async (file) => {
    return new Promise(function (resolve, reject) {
      const app = getApp();
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        },
      );
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sell" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "text" ||
      e.target.type === "textarea" ||
      e.target.type === "number"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const {
    mutate,
    isPending: loading,
    error,
  } = useMutation({
    mutationFn: async () => {
      if (formData.imageUrls.length < 1) {
        throw new Error("You must upload at least one image");
      }

      if (+formData.regularPrice < +formData.discountPrice) {
        throw new Error("Discount price must be lower than regular price");
      }

      const { data } = await instance.post(`/listing/create/`, {
        ...formData,
        userRef: user._id,
      });
      navigate(`/listing/${data._id}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutate();
  };

  const handleImageDelete = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  return (
    <section className="p-3 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-col gap-4 flex-1">
          <input
            onChange={handleChange}
            required
            minLength={10}
            maxLength={62}
            value={formData.name}
            className="p-3 rounded-md border"
            placeholder="Name"
            id="name"
            type="text"
          />
          <textarea
            onChange={handleChange}
            required
            value={formData.description}
            className="p-3 rounded-md border"
            placeholder="Description"
            id="description"
          />
          <input
            onChange={handleChange}
            required
            value={formData.address}
            className="p-3 rounded-md border"
            placeholder="Address"
            id="address"
            type="text"
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                checked={formData.type === "sell"}
                className="w-5 h-6"
                id="sell"
                type="checkbox"
              />
              <label>Sell</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                checked={formData.type === "rent"}
                className="w-5 h-6"
                id="rent"
                type="checkbox"
              />
              <label>Rent</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                checked={formData.parking}
                className="w-5 h-6"
                id="parking"
                type="checkbox"
              />
              <label>Parking Spot</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                checked={formData.furnished}
                className="w-5 h-6"
                id="furnished"
                type="checkbox"
              />
              <label>Furnished</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                checked={formData.offer}
                className="w-5 h-6"
                id="offer"
                type="checkbox"
              />
              <label>Offer</label>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                value={formData.beds}
                className="p-3 rounded-md border border-gray-300"
                type="number"
                id="beds"
                required
                min={1}
                max={10}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                value={formData.baths}
                className="p-3 rounded-md border border-gray-300"
                type="number"
                id="baths"
                required
                min={1}
                max={10}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleChange}
                value={formData.regularPrice}
                className="p-3 rounded-md border border-gray-300"
                type="number"
                id="regularPrice"
                required
                min={50}
                max={10000000}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  onChange={handleChange}
                  value={formData.discountPrice}
                  className="p-3 rounded-md border border-gray-300"
                  type="number"
                  id="discountPrice"
                  required
                  min={50}
                  max={10000000}
                />
                <div className="flex flex-col items-center">
                  <p>Discount price</p>
                  <span className="text-xs">($ / Month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-bold">
            Images:{" "}
            <span className="text-gray-500 text-md font-normal">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 w-full"
              type="file"
              accept="image/*"
              multiple
            />
            <button
              onClick={handleUpload}
              type="button"
              className="p-3 border border-green-700 text-green-700 rounded-sm uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {uploadImageError && (
            <p className="text-red-700 text-sm">{uploadImageError}</p>
          )}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                className="border p-3 flex justify-between items-center"
                key={index}
              >
                <img
                  className="w-20 h-20 object-contain"
                  src={url}
                  alt="listing-image"
                />
                <button
                  onClick={() => handleImageDelete(index)}
                  type="button"
                  className="p-3 text-red-700 uppercase hover:opacity-75"
                >
                  delete
                </button>
              </div>
            ))}
          <button
            disabled={uploading || loading}
            className="p-3 mt-4 text-white bg-slate-700 uppercase rounded-md hover:opacity-95 disabled:opacity-80"
          >
            create listing
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </section>
  );
};

export default CreateListing;
