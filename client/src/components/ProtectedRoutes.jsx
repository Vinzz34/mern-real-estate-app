import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../store";

const ProtectedRoutes = () => {
  const { user } = useUserStore();

  return user === null ? (
    <Navigate to="/sign-in" replace={true} />
  ) : (
    <Outlet />
  );
};

export default ProtectedRoutes;
