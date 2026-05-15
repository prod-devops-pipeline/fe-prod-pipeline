import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

interface AdminHeaderProps {
    onMenuClick: () => void;
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const name = localStorage.getItem("name");
    const navigate = useNavigate();
    const auth = useAuth();

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Logout failed on server");
            }
            await response.json();
            auth.logout();
            toast.dismiss();
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout Error:", error);
        } finally {
            localStorage.removeItem("token");
            navigate("/", { replace: true });
        }
    };


    return (
        <header className="bg-blue-500 text-white shadow-sm w-full">
            <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden text-2xl font-semibold text-white"
                    >
                        ☰
                    </button>
                    <h1 className="text-lg sm:text-xl font-semibold">Admin Panel</h1>
                </div>

                <div className="flex items-center gap-3 relative">
                    <span className="text-sm font-medium text-white hidden sm:block  capitalize">
                        {name}
                    </span>

                    <button
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="relative flex items-center justify-center p-0.5 border-2 border-transparent hover:border-blue-400 rounded-full transition-all duration-200 active:scale-95"
                    >
                        <img
                            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                            alt="Profile"
                            className="w-9 h-9 rounded-full object-cover"
                        />
                    </button>


                    {isMenuOpen && (
                        <div className="absolute top-12 right-0 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-[100] overflow-hidden animate-in fade-in zoom-in duration-2000 " >

                            <div className="p-1.5 flex flex-col gap-1">
                                <button
                                    onClick={() => { }}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                >
                                    View Profile
                                </button>

                                <hr className="my-1 border-gray-50" />

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
