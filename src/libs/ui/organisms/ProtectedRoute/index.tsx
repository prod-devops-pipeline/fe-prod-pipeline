import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
    const auth = useAuth();
    const role = auth.role;

    if (!auth.isLogin) {
        toast.error("Please login first");
        return <Navigate to="/login" />;
    }

    if (role !== "admin") {
        toast.error("You are not authorized to access this page");
        return <Navigate to="/login" />;
    }
    return <Outlet />;
};

export default ProtectedRoute;
