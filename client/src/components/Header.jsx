import {FaSearch} from "react-icons/fa"
import {Link} from "react-router-dom"
import {useSelector} from "react-redux"

const Header = () => {

    const {currentUser} = useSelector((state) => state.user)

  return (
    <header className="bg-slate-200">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
            <Link to='/' className="text-sm sm:text-xl font-bold flex flex-wrap">
                <span className="text-slate-500">Vinzz</span>
                <span className="text-slate-700">Estate</span>
            </Link>
            <form className="bg-slate-100 flex gap-1 items-center p-3 rounded-md">
                <input className="bg-transparent text-xs sm:text-sm outline-none w-24 sm:w-64" placeholder="Search..." type="text" />
                <FaSearch />
            </form>
            <ul className="flex gap-4 items-center">
                <Link to="/" className="text-slate-700 hidden sm:block hover:underline">Home</Link>
                <Link to='/about' className="text-slate-700 hidden sm:block hover:underline">About</Link>
                {currentUser ? (
                    <Link to='/profile'><img src={currentUser.avatar} className="w-7 h-7 object-cover rounded-full" alt="profile" /></Link>
                ) : (
                    <Link to='/sign-in' className="text-slate-700 hover:underline">Sign in</Link>
                )}
            </ul>
        </div>
    </header>
  )
}

export default Header