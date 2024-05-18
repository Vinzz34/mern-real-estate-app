import {Link} from "react-router-dom"

const SignUp = () => {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h2 className="text-3xl font-semibold text-center my-7">Sign Up</h2>
      <form className="flex flex-col gap-4">
        <input className="p-3 rounded-md outline-none border" placeholder="Username" type="text" />
        <input className="p-3 rounded-md outline-none border" placeholder="Email" type="email" />
        <input className="p-3 rounded-md outline-none border" placeholder="Password" type="password" />
        <button className="p-3 text-white bg-slate-700 uppercase rounded-md hover:opacity-95 disabled:opacity-80">Sign Up</button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link className="text-blue-700" to='/sign-in'>Sign in</Link>
      </div>
    </div>
  )
}

export default SignUp