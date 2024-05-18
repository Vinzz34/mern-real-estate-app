import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Profile from "./pages/Profile"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Header from "./components/Header"
import {useSelector} from "react-redux"
import { Navigate } from "react-router-dom"

const App = () => {

  const {currentUser} = useSelector((state) => state.user)

  return (
   <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile" element={currentUser ? <Profile /> : <Navigate to='/sign-in' />} />
      <Route path="/sign-in" element={!currentUser ? <SignIn /> : <Navigate to='/profile' />} />
      <Route path="/sign-up" element={!currentUser ? <SignUp /> : <Navigate to='/profile' />} />
    </Routes>
   </BrowserRouter> 
  )
}

export default App