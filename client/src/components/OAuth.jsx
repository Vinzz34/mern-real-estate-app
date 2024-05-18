import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth"
import {app} from "../firebase"
import instance from "../api/api_instance"
import {useDispatch} from "react-redux"
import {setUser} from "../redux/user/userSlice"
import {useNavigate} from "react-router-dom"

const OAuth = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleClick = async () => {
        try{
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth,provider)

            const response = await instance.post('/auth/google',{
              username: result.user.displayName,
              email: result.user.email,
              avatar: result.user.photoURL
            })
            
           dispatch(setUser(response.data)) 
           navigate('/')
        }
        catch(error){
            console.log(error)
        }
    }

  return (
    <button onClick={handleClick} type="button" className="bg-red-700 text-white rounded-md uppercase p-3 mt-4 hover:opacity-95">Continue with Google</button>
  )
}

export default OAuth