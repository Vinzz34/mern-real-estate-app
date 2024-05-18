import {Link} from "react-router-dom"
import {useForm} from "react-hook-form"
import validator from "validator"
import { useNavigate } from "react-router-dom"

const SignUp = () => {

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState : {errors,isSubmitting}} = useForm()

  const onSubmit = async (data) => {
    try{
      const response = await fetch('http://localhost:3000/api/auth/sign-up',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const json = await response.json()

      if(json.success === false){
        setError("root",{
          message: json.message
        })
        return;
      }

      navigate('/sign-in')
    }
    catch(error){
      console.log(error)
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
            message: "Password must have atleast 8 characters"
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