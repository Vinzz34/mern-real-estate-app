import { useSelector } from "react-redux"
import {useForm} from "react-hook-form"
import validator from "validator"
import instance from "../api/api_instance"

const Profile = () => {

  const {currentUser} = useSelector((state) => state.user)

  const {
    register,
    handleSubmit,
    setError,
    formState : {errors,isSubmitting}} = useForm({
      defaultValues: {
        username: currentUser.username,
        email: currentUser.email
      }
    })

  const onSubmit = async (data) => {
    console.log(data)
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h2 className="text-3xl font-semibold text-center my-7">Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <img className="w-24 h-24 rounded-full self-center" src={currentUser.avatar} alt="avatar" />

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