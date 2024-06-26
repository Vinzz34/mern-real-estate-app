import { useForm } from "react-hook-form";
import validator from "validator";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { getApp } from "firebase/app";
import instance from "../api/api_instance";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";

const fetchListings = async (userId) => {
  const { data } = await instance.get("/user/listings/" + userId);
  return data;
};

const deleteRequest = async (id) => {
  await instance.delete("/listing/delete/" + id);
};

const Profile = () => {
  const { user, setUser } = useUserStore();

  const queryClient = useQueryClient();

  const fileRef = useRef();

  const navigate = useNavigate();

  const [file, setFile] = useState();
  const [filePerc, setFilePerc] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [showListings, setShowListings] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: user.username,
      email: user.email,
    },
  });

  useEffect(() => {
    const handleFileUpload = async (file) => {
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
          setFilePerc(Math.round(progress));
        },
        // eslint-disable-next-line no-unused-vars
        (error) => {
          setFileError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setValue("avatar", downloadURL);
          });
        },
      );
    };
    if (file) {
      handleFileUpload(file);
    }
  }, [file, setValue]);

  const onSubmit = async (data) => {
    let { password, ...rest } = data;
    if (password === "") password = undefined;

    try {
      const response = await instance.patch(`/user/update/${user._id}`, {
        ...rest,
        password,
      });
      setUser(response.data);
      setUpdateStatus(true);
    } catch (error) {
      console.log(error.response);
      setError("root", {
        message: error.response.data.message,
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      await instance.delete(`/user/delete/${user._id}`);
      setUser(null);
    } catch (error) {
      console.log(error.response);
      setError("root", {
        message: error.response.data.message,
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await instance.get(`/auth/sign-out`);
      setUser(null);
    } catch (error) {
      console.log(error.response);
      setError("root", {
        message: error.response.data.message,
      });
    }
  };

  const {
    data: listings,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["listings", user._id],
    queryFn: () => fetchListings(user._id),
  });

  const {
    mutate,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation({
    mutationFn: (id) => deleteRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["listings", user._id]);
    },
  });

  const deleteListing = async (id) => {
    mutate(id);
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h2 className="text-3xl font-semibold text-center my-7">Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          accept="image/*"
          hidden
          ref={fileRef}
        />
        <img
          onClick={() => fileRef.current.click()}
          className="w-24 h-24 rounded-full self-center cursor-pointer"
          src={watch("avatar") || user.avatar}
          alt="avatar"
        />

        {fileError ? (
          <div className="text-red-700 text-sm text-center">
            Error Image upload (image must be less than 2 mb)
          </div>
        ) : filePerc > 0 && filePerc < 100 ? (
          <div className="text-slate-700 text-sm text-center">{`Uploading ${filePerc}%`}</div>
        ) : (
          filePerc === 100 && (
            <div className="text-green-700 text-sm text-center">
              Image successfully uploaded!
            </div>
          )
        )}

        <input
          {...register("username", {
            required: "Username is required",
          })}
          className="p-3 mt-8 rounded-md outline-none border"
          placeholder="Username"
          type="text"
        />
        {errors.username && (
          <div className="text-red-500 text-xs pl-3">
            {errors.username.message}
          </div>
        )}

        <input
          {...register("email", {
            required: "Email is required",
            validate: (value) => {
              if (!validator.isEmail(value)) {
                return "Enter a valid email";
              }
              return true;
            },
          })}
          className="p-3 rounded-md outline-none border mt-4"
          placeholder="Email"
          type="email"
        />
        {errors.email && (
          <div className="text-red-500 text-xs pl-3">
            {errors.email.message}
          </div>
        )}

        <input
          {...register("password", {
            minLength: {
              value: 8,
              message: "Password must have at least 8 characters",
            },
            validate: (value) => {
              if (!value) return;
              if (!validator.isStrongPassword(value)) {
                return "Please choose a stronger password. Try a mix of letters, numbers and symbols.";
              }
            },
          })}
          className="p-3 rounded-md outline-none border mt-4"
          placeholder="Password"
          type="password"
        />
        {errors.password && (
          <div className="text-red-500 text-xs pl-3">
            {errors.password.message}
          </div>
        )}

        <button
          disabled={isSubmitting}
          className="p-3 mt-4 text-white bg-slate-700 uppercase rounded-md hover:opacity-95 disabled:opacity-80"
        >
          Update
        </button>

        <button
          onClick={() => navigate("/create-listing")}
          className="p-3 mt-4 text-white bg-green-700 uppercase rounded-md hover:opacity-95"
        >
          create listing
        </button>
      </form>
      <div className="flex justify-between mt-4">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      {errors.root && (
        <div className="text-sm text-red-500">{errors.root.message}</div>
      )}
      {updateStatus && (
        <div className="text-sm text-green-700">
          User is updated successfully!
        </div>
      )}
      <div>
        <p
          onClick={() => setShowListings(true)}
          className="text-green-700 text-center my-7 cursor-pointer"
        >
          Show listings
        </p>

        {showListings && (
          <div>
            {isLoading && <Loading />}

            {isError && (
              <div className="text-sm text-red-500">{error.message}</div>
            )}

            {listings?.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold text-center mb-7">
                  Your Listings
                </h3>
                <div className="grid gap-4">
                  {listings.map((listing) => (
                    <div
                      className="border p-3 flex justify-between items-center"
                      key={listing._id}
                    >
                      <div className="flex items-center gap-2">
                        <Link to={`/listing/${listing._id}`}>
                          <img
                            className="w-16 h-16 object-contain"
                            src={listing.imageUrls[0]}
                            alt="listing image"
                          />
                        </Link>
                        <Link
                          to={`/listing/${listing._id}`}
                          className="font-semibold"
                        >
                          {listing.name}
                        </Link>
                      </div>
                      <div className="grid">
                        <button
                          onClick={() => deleteListing(listing._id)}
                          className="text-red-700 uppercase"
                        >
                          delete
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/update-listing/${listing._id}`)
                          }
                          className="text-green-700 uppercase"
                        >
                          edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {isDeleteError && (
                  <div className="text-sm text-red-500">
                    {deleteError.message}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
