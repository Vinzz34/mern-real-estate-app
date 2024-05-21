import {useSelector} from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoutes = () => {

  const {currentUser} = useSelector((state) => state.user)

  return currentUser === null ? <Navigate to='/sign-in' replace={true} />  : <Outlet />
}

export default ProtectedRoutes