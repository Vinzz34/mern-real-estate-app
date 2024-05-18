import {Link} from "react-router-dom"
import {useForm} from "react-hook-form"
import validator from "validator"
import { useNavigate } from "react-router-dom"
import OAuth from "../components/OAuth"
import instance from "../api/api_instance"

const SignUp = () => {

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState : {errors,isSubmitting}} = useForm()

  const onSubmit = async (data) => {
    try{
      await instance.post('/auth/sign-up',{...data})
      navigate('/sign-in')
    }
    catch(error){
      console.log(error.response)
      setError("root",{
        message: error.response.data.message
      })
    }

  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h2 className="text-3xl font-semibold text-center my-7">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

        <input {...register("username",
          {
            required: {
              value: true,
              message: "Username is required"
            }
          }
        )} className="p-3 rounded-md outline-none border" placeholder="Username" type="text" />
        {errors.username && (
          <div className="text-red-500 text-xs pl-3">{errors.username.message}</div>
        )}

        <input {...register("email",{
          required:{
            value: true,
            message: "Email is required"
          },
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
          required: {
            value: true,
            message: "Password is required"
          },
          minLength: {
            value: 8,
            message: "Password must have at least 8 characters"
          },
          validate : (value) => {
            if(!validator.isStrongPassword(value)){
              return "Please choose a stronger password. Try a mix of letters, numbers and symbols."
            }
          }
        })} className="p-3 rounded-md outline-none border mt-4" placeholder="Password" type="password" />
        {errors.password && (
          <div className="text-red-500 text-xs pl-3">{errors.password.message}</div>
        )}

        <button disabled={isSubmitting} className="p-3 mt-4 text-white bg-slate-700 uppercase rounded-md hover:opacity-95 disabled:opacity-80">Sign Up</button>
        
        <OAuth />

      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link className="text-blue-700 hover:underline" to='/sign-in'>Sign in</Link>
      </div>
      {errors.root && (
        <div className="text-sm text-red-500">{errors.root.message}</div>
      )}
    </div>
  )
}

export default SignUp