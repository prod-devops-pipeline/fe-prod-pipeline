import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/Techdenali.png";
import Button from "../../atoms/button";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
// Import icons for mobile toggle
import { Menu, X } from "lucide-react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { isLogin, logout } = useAuth(); // Destructure logout directly

  const menyRef = useRef<HTMLDivElement>(null);
  const name = localStorage.getItem("name");

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menyRef.current && !menyRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      localStorage.removeItem("token");
      navigate("/", { replace: true });
    }
  };

  const NavLinks = () => (
    <ul className="flex flex-col md:flex-row gap-4 md:gap-8 font-medium">
      {["Home", "Service", "Contact", "Help"].map((item) => (
        <li
          key={item}
          className="cursor-pointer hover:text-blue-200 transition-colors py-2 md:py-0"
        >
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <header className="bg-blue-500 text-white sticky top-0 z-[100]">
      <div className="max-w-7xl px-4 py-4 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center bg-white p-1.5 rounded-lg shadow-sm cursor-pointer shrink-0"
            onClick={() => navigate("/")}
          >
            <img
              src={logo}
              alt="Logo"
              className="h-7 md:h-8 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <NavLinks />
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {!isLogin ? (
              <div className="hidden md:flex gap-2">
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-white !text-blue-600 px-4 py-2 rounded-lg font-semibold hover:!bg-blue-100 transition-all"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  className="bg-white !text-blue-600 px-4 py-2 rounded-lg font-semibold hover:!bg-blue-100 transition-all"
                >
                  Register
                </Button>
              </div>
            ) : (
              <div className=" items-center gap-3 relative hidden md:flex">
                <span className="text-sm font-medium hidden lg:block capitalize">
                  {name}
                </span>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="relative p-0.5 border-2 border-transparent hover:border-blue-400 rounded-full transition-all"
                >
                  <img
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    alt="Profile"
                    className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover"
                  />
                </button>
                {isMenuOpen && (
                  <div
                    ref={menyRef}
                    className="absolute top-12 right-0 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-[110] p-1.5 flex flex-col gap-1 text-gray-700 animate-in fade-in zoom-in duration-150 "
                  >
                    <button className="text-left px-3 py-2 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg">
                      View Profile
                    </button>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-1.5 hover:bg-blue-600 rounded-lg transition-colors"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            >
              {isMobileNavOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isMobileNavOpen && (
          <div className="md:hidden pt-4 pb-6 border-t border-blue-400 mt-4 animate-in slide-in-from-top duration-300">
            {/* Profile Section for Mobile */}
            {isLogin && (
              <div className="flex items-center gap-3 mb-6 p-3 bg-blue-600 rounded-xl">
                <img
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-white/20"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-lg capitalize leading-none">
                    {name}
                  </span>
               
                </div>
              </div>
            )}

            <nav className="mb-8">
              <ul className="flex flex-col gap-2 font-medium">
                {["Home", "Service", "Contact", "Help"].map((item) => (
                  <li
                    key={item}
                    className="cursor-pointer hover:bg-blue-600 p-3 rounded-lg transition-colors"
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col gap-3">
              {!isLogin ? (
                <>
                  <Button
                    onClick={() => navigate("/login")}
                    className="bg-white !text-blue-600 w-full py-3 rounded-xl font-bold shadow-lg"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => navigate("/register")}
                    className="bg-transparent border-2 border-white !text-white w-full py-3 rounded-xl font-bold"
                  >
                    Register
                  </Button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 bg-red-500 text-white w-full py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
