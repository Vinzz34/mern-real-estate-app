import { useSelector } from "react-redux"
import {useForm} from "react-hook-form"
import validator from "validator"
import instance from "../api/api_instance"
import { useEffect, useRef, useState } from "react"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import {getApp} from "firebase/app"

const Profile = () => {

  const {currentUser} = useSelector((state) => state.user)

  const fileRef = useRef()

  const [file,setFile] = useState()
  const [filePerc,setFilePerc] = useState(0)
  const [fileError,setFileError] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState : {errors,isSubmitting}} = useForm({
      defaultValues: {
        username: currentUser.username,
        email: currentUser.email
      }
    })

  useEffect(() => {
    const handleFileUpload = async (file) => {
      const app =getApp()
      const storage = getStorage(app)
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage,fileName)
      const uploadTask = uploadBytesResumable(storageRef,file)
      uploadTask.on('state_changed',(snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress))
      },
      // eslint-disable-next-line no-unused-vars
      (error) => {
        setFileError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setValue("avatar",downloadURL)
        })
      })
    }
    if(file){
      handleFileUpload(file)
    }
  },[file,setValue])

  const onSubmit = async (data) => {
    console.log(data)
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h2 className="text-3xl font-semibold text-center my-7">Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <input onChange={(e) => setFile(e.target.files[0])} type="file" accept="image/*" hidden ref={fileRef} />
        <img onClick={() => fileRef.current.click()} className="w-24 h-24 rounded-full self-center cursor-pointer" src={watch("avatar") || currentUser.avatar} alt="avatar" />

        {fileError ? (
          <div className="text-red-700 text-sm text-center">Error Image upload (image must be less than 2 mb)</div>
        ) : filePerc > 0 && filePerc < 100 ? (
          <div className="text-slate-700 text-sm text-center">{`Uploading ${filePerc}%`}</div>
        ) : filePerc === 100 && (
          <div className="text-green-700 text-sm text-center">Image successfully uploaded!</div>
        )}

        <input {...register("username",{
          required: "Username is required"
        })
        } className="p-3 mt-8 rounded-md outline-none border" placeholder="Username" type="text" />
        {errors.username && (
          <div className="text-red-500 text-xs pl-3">{errors.username.message}</div>
        )}
        
        <input {...register("email",{
          required: "Email is required",
          validate: (value) => {
            if(!validator.isEmail(value)){
              return "Enter a valid email"
            }
            return true
          }
        })} className="p-3 rounded-md outline-none border mt-4" placeholder="Email" type="email" />
        {errors.email && (
          <div className="text-red-500 text-xs pl-3">{errors.email.message}</div>
        )}

        <input {...register("password",{
          minLength: {
            value: 8,
            message: "Password must have at least 8 characters"
          },
          validate : (value) => {
            if(!value) return
            if(!validator.isStrongPassword(value)){
              return "Please choose a stronger password. Try a mix of letters, numbers and symbols."
            }
          }
        })} className="p-3 rounded-md outline-none border mt-4" placeholder="Password" type="password" />
        {errors.password && (
          <div className="text-red-500 text-xs pl-3">{errors.password.message}</div>
        )}

        <button disabled={isSubmitting} className="p-3 mt-4 text-white bg-slate-700 uppercase rounded-md hover:opacity-95 disabled:opacity-80">Update</button>
      </form>
      <div className="flex justify-between mt-4">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  )
}

export default Profile