import { ChevronRight, Heart, MapPin, Menu, User } from "lucide-react";
import { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../pages/LoginModal";

interface NavbarProps {
  onSelectCityClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSelectCityClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [userData, setUserData] = useState();

  const openSetting = () => navigate("/settings");

  return (
    <nav className="w-full h-auto bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <div className="flex flex-col items-center px-4">
          <NavLink to="/" end>
            <img src="/Brand-logo.png" alt="Logo" className="w-auto h-9" />
          </NavLink>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 w-[35%]">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "text-[#EE1422] text-sm border-b-2 border-[#EE1422] font-bold"
                : "text-black hover:text-[#EE1422] text-sm transition"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/buy-car"
            className={({ isActive }) =>
              isActive
                ? "text-[#EE1422] text-sm border-b-2 border-[#EE1422] font-bold"
                : "text-black hover:text-[#EE1422] text-sm transition"
            }
          >
            Browse Car
          </NavLink>
          <NavLink
            to="/sell"
            className={({ isActive }) =>
              (isActive
                ? "text-[#EE1422] font-medium text-sm border-b-2 border-[#EE1422]"
                : "text-black hover:text-[#EE1422] text-sm") +
              " transition flex items-center gap-1"
            }
          >
            <span>Sell my car</span>
          </NavLink>
        </div>

        {/* Desktop Buttons */}
        <div
          className="hidden md:flex items-center justify-center gap-4 relative"
          ref={menuRef} // <-- wrapper ref here
        >
          <button
            onClick={onSelectCityClick}
            className="rounded-sm px-2 py-2 text-xs md:text-xs flex items-center cursor-pointer hover:text-[#EE1422]"
          >
            <MapPin className="w-4 h-4" />
            <span className="ml-1 flex items-center gap-1">
              Select City{" "}
              <span>
                <ChevronRight className="h-4 w-4" />
              </span>
            </span>
          </button>

          <button
            className="px-2 py-2 rounded-md transition text-[10px] cursor-pointer flex flex-col items-center justify-center group hover:text-[#EE1422]"
            onClick={() => navigate("/settings/saved")}
          >
            <Heart className="w-4 h-4 hover:text-[#EE1422]" /> Favorite
          </button>

          {user ? (
            <>
              <div
                className="flex flex-col items-center gap-2 cursor-pointer select-none"
                onClick={openSetting}
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border-2 object-cover"
                  />
                ) : (
                  <img
                    src="/default-men-logo.jpg"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover mx-4 cursor-pointer hover:scale-[1.1] transition-all duration-500"
                  />
                )}
              </div>
            </>
          ) : (
            <button
              className="px-4 py-2 rounded-md flex items-center gap-2 hover:text-[#EE1422] transition text-sm cursor-pointer"
              onClick={() => setIsLoginOpen(true)}
            >
              <User className="w-5 h-5 border-2 rounded-full" />
              Login/Sign Up
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => navigate("/settings")}>
            <Menu className="w-6 h-6 text-[#EE1422]" />
          </button>
        </div>
      </div>

      {/* Inject login modal here */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        setUserData={setUserData}
      />
    </nav>
  );
};

export default Navbar;
