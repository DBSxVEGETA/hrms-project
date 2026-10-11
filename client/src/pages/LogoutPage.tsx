import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "axios";

const LogoutPage = () => {
  const navigate = useNavigate();

  const [authUser, setAuthUser] = useState(null);

  const checkUserIsAuth = async () => {
    try {
      const res = await API.get("http://localhost:9500/api/auth/checkAuth", {
        withCredentials: true, // 💥 Accept cookies from backend
      });
      console.log("res - ", res.data?.user);
      setAuthUser(res.data?.user);
    } catch (err: any) {
      console.error("Side bar error");
    }
  };

  const handleLogOut = async () => {
    try {
      const res = await API.post("http://localhost:9500/api/auth/logout", {}, { withCredentials: true });

      console.log("Logged out -", res.data);

      setAuthUser(null);

      navigate("/auth");
    } catch (err: any) {
      console.error("Logout error:", err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    handleLogOut();
    const timer = setTimeout(async () => {
      navigate("/auth");
      await checkUserIsAuth();
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Logging out...</h1>
        <p className="text-gray-600">You will be redirected to the login page shortly.</p>
      </div>
    </div>
  );
};

export default LogoutPage;
