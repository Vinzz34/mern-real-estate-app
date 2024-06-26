import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import instance from "../api/api_instance";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store";

const OAuth = () => {
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const response = await instance.post("/auth/google", {
        username: result.user.displayName,
        email: result.user.email,
        avatar: result.user.photoURL,
      });

      setUser(response.data);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="bg-red-700 text-white rounded-md uppercase p-3 mt-4 hover:opacity-95"
    >
      Continue with Google
    </button>
  );
};

export default OAuth;
