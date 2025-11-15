import {
  ChevronDown,
  ChevronRight,
  Heart,
  MapPin,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LoginModal from "../pages/LoginModal";
import { useAuth } from "../context/useAuth";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { selectAuth } from "../store/slices/authSlices/authSlice";
import { openLogin } from "../store/slices/authSlices/loginModelSlice";

interface NavbarProps {
  onSelectCityClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSelectCityClick }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(selectAuth);
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const openSetting = () => navigate("/settings");

  const handleConfirmLogout = () => {
    logout();
    navigate("/");
    setShowDialog(false);
  };

  const handleAccess = () => {
    if (!user || !token) {
      dispatch(openLogin());
      return;
    }
    console.log("User logged in, allow car upload");
  };

  const location = useSelector((state: RootState) => state.location.location);

  useEffect(() => {
    if (isMobileMenuOpen || isRightSidebarOpen) {
      document.body.style.overflow = "hidden"; // disable scroll
    } else {
      document.body.style.overflow = ""; // restore scroll
    }
  }, [isMobileMenuOpen, isRightSidebarOpen]);

  return (
    <nav className="w-full h-12 md:h-auto bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-4 py-2 flex items-center md:justify-between">
        {/* Mobile Menu Button */}
        <div className="flex gap-1">
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-5 h-5 text-black mt-[2px]" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex flex-col items-center px-3">
            <NavLink to="/" end>
              <img
                src="/Brand-logo.png"
                alt="Logo"
                className="w-31 md:w-auto h-[22px] md:h-9"
              />
            </NavLink>
          </div>
        </div>

        {/* Mobile nav links */}
        <div
          className="w-full flex lg:hidden items-center justify-end gap-4 relative pr-1"
          ref={menuRef}
        >
          <button
            className=" py-2 rounded-md text-[10px] flex flex-col items-center justify-center group"
            onClick={() => navigate("/settings/saved")}
          >
            <Heart className="w-5 h-5" />
          </button>

          <button
            onClick={onSelectCityClick}
            className="rounded-sm py-2 text-xs flex items-center"
          >
            <MapPin className="w-5 h-5" />
          </button>

          {user ? (
            <div
              className="flex flex-col items-center gap-2 cursor-pointer select-none"
              onClick={() => {
                setIsRightSidebarOpen(true);
                setIsMobileMenuOpen(false);
              }}
            >
              <img
                src={user?.profileImg || "/default-men-logo.jpg"}
                alt="User Avatar"
                className="w-6 h-6 rounded-full object-cover"
              />
            </div>
          ) : (
            <button
              className="py-2 rounded-md flex items-center gap-2"
              onClick={() => {
                setIsRightSidebarOpen(true);
                setIsMobileMenuOpen(false);
              }}
              // onClick={() => setIsLoginOpen(true)}
            >
              <UserRound
                className="w-5 h-5 border-[1.5px] rounded-full"
                strokeWidth={2}
              />
            </button>
          )}
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-10 w-[35%]">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "text-[#EE1422] text-sm underline underline-offset-3 font-semibold"
                : "text-black hover:text-[#EE1422] text-sm transition"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/buy-car"
            className={({ isActive }) =>
              isActive
                ? "text-[#EE1422] text-sm underline underline-offset-3 font-semibold"
                : "text-black hover:text-[#EE1422] text-sm transition"
            }
          >
            Browse Cars
          </NavLink>
          <NavLink
            to="/sell"
            className={({ isActive }) =>
              (isActive
                ? "text-[#EE1422] text-sm underline underline-offset-3 font-semibold"
                : "text-black hover:text-[#EE1422] text-sm") +
              " transition flex items-center gap-1"
            }
          >
            <span>Sell my car</span>
          </NavLink>
          <NavLink
            to="/requirements"
            className={({ isActive }) =>
              (isActive
                ? "text-[#EE1422] text-sm underline underline-offset-3 font-semibold"
                : "text-black hover:text-[#EE1422] text-sm") +
              " transition flex items-center gap-1"
            }
          >
            <span>Requirements</span>
          </NavLink>
        </div>

        {/* Desktop Buttons */}
        <div
          className="hidden lg:flex items-center justify-center gap-6 relative"
          ref={menuRef}
        >
          <button
            onClick={onSelectCityClick}
            className="rounded-sm px-2 py-2 text-xs flex items-center cursor-pointer hover:text-[#EE1422]"
          >
            <MapPin className="w-4 h-4" />
            <span className="ml-1 flex items-center gap-1">
              {location ? location : "Select City"}
              <ChevronDown className="h-4 w-4" />
            </span>
          </button>

          <button
            className="px-2 py-2 rounded-md transition text-[10px] cursor-pointer flex flex-col items-center justify-center group hover:text-[#EE1422]"
            onClick={() => {
              if (user) {
                navigate("/settings/saved");
              } else {
                handleAccess();
              }
            }}
          >
            <Heart className="w-4 h-4 hover:text-[#EE1422]" /> Favorite
          </button>

          {user ? (
            <div
              className="flex flex-col items-center gap-2 cursor-pointer select-none"
              onClick={openSetting}
            >
              <img
                src={user.userProfileUrl || "/default-men-logo.jpg"}
                alt="User Avatar"
                className="w-7 h-7 rounded-full border-1 object-cover"
              />
            </div>
          ) : (
            <button
              className="px-4 py-2 rounded-md flex items-center gap-2 hover:text-[#EE1422] transition text-sm cursor-pointer"
              onClick={() => setIsLoginOpen(true)}
            >
              <UserRound
                className="w-[22px] h-[22px] border-[1.5px] rounded-full"
                strokeWidth={2}
              />
              Login / Register
            </button>
          )}
        </div>
      </div>

      {/* Mobile left Sidebar Menu */}
      {(isMobileMenuOpen || isRightSidebarOpen) && (
        <div
          className=""
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsRightSidebarOpen(false);
          }}
        >
          <div
            className={`fixed top-0 left-0 h-full w-[80%] sm:w-[35%] bg-white shadow-lg transform transition-transform duration-300 z-100 ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between p-4">
              <img src="/Brand-logo.png" alt="Logo" className="h-6" />
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            <div className="flex flex-col p-4 gap-3">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? "text-[#EE1422] text-md" : "text-black text-md"
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/buy-car"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "text-[#EE1422] text-md flex items-center justify-between"
                    : "text-black text-md flex items-center justify-between"
                }
              >
                Browse Cars <ChevronRight className="h-5 w-5" />
              </NavLink>
              <NavLink
                to="/sell"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#EE1422] text-md flex items-center justify-between"
                    : "text-black text-md flex items-center justify-between"
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sell my car <ChevronRight className="h-5 w-5" />
              </NavLink>
              <NavLink
                to="/requirements"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#EE1422] text-md flex items-center justify-between"
                    : "text-black text-md flex items-center justify-between"
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Requirements <ChevronRight className="h-5 w-5" />
              </NavLink>
              <NavLink
                to="/settings/saved"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#EE1422] text-md flex items-center justify-between"
                    : "text-black text-md flex items-center justify-between"
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Wishlist <ChevronRight className="h-5 w-5" />
              </NavLink>
            </div>
          </div>
        </div>
      )}
      {/* Mobile right Sidebar Menu */}
      {(isMobileMenuOpen || isRightSidebarOpen) && (
        <div
          className=""
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsRightSidebarOpen(false);
          }}
        >
          <div
            className={`fixed top-0 right-0 h-full w-[75%] sm:w-[35%] bg-white shadow-lg transform transition-transform duration-300 z-100 ${
              isRightSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between p-4 bg-[#EE1422] text-white">
              <div
                className="flex items-center gap-2"
                onClick={() => {
                  if (!user) {
                    setIsLoginOpen(true);
                  }
                }}
              >
                <img
                  src={user?.userProfileUrl || "/default-men-logo.jpg"}
                  alt="User"
                  className="w-10 h-10 rounded-full border"
                />
                <div className="flex flex-col">
                  <span className="text-md font-semibold">
                    {user?.fullName || "Login / Signup"}
                  </span>
                </div>
              </div>
              <button onClick={() => setIsRightSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col p-4 gap-4">
              <NavLink
                to="/settings/profile"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#EE1422] text-md flex items-center gap-2"
                    : "text-black text-md flex items-center gap-2"
                }
                onClick={() => setIsRightSidebarOpen(false)}
              >
                <span className="h-5 w-5">
                  <img
                    src="/mobile sidebar logo/solar_user-broken.png"
                    alt="icon"
                  />
                </span>{" "}
                Profile Settings
              </NavLink>
              <NavLink
                to="/settings/listings"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#EE1422] text-md flex items-center gap-2"
                    : "text-black text-md flex items-center gap-2"
                }
                onClick={() => setIsRightSidebarOpen(false)}
              >
                <span className="h-5 w-5">
                  <img src="/mobile sidebar logo/my_listings.png" alt="icon" />
                </span>{" "}
                My Listing
              </NavLink>
              {/* <NavLink
            to="/settings/my-leads"
            className={({ isActive }) =>
              isActive ? "text-[#EE1422] text-md flex items-center gap-2" : "text-black text-md flex items-center gap-2"
            }
            onClick={() => setIsRightSidebarOpen(false)}
          >
           <span className="h-5 w-5"><img src="/mobile sidebar logo/" alt="icon"/></span> My Leads
          </NavLink> */}
              <NavLink
                to="/sell"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#EE1422] text-md flex items-center gap-2"
                    : "text-black text-md flex items-center gap-2"
                }
                onClick={() => setIsRightSidebarOpen(false)}
              >
                <span className="h-5 w-5">
                  <img src="/mobile sidebar logo/add_car.png" alt="icon" />
                </span>{" "}
                Add Car
              </NavLink>
              <NavLink
                to="/settings/interested-buyers"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#EE1422] text-md flex items-center gap-2"
                    : "text-black text-md flex items-center gap-2"
                }
                onClick={() => setIsRightSidebarOpen(false)}
              >
                <span className="h-5 w-5">
                  <img src="/mobile sidebar logo/" alt="icon" />
                </span>{" "}
                Interested Buyers
              </NavLink>
              <NavLink
                to="/settings/enquiries"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#EE1422] text-md flex items-center gap-2"
                    : "text-black text-md flex items-center gap-2"
                }
                onClick={() => setIsRightSidebarOpen(false)}
              >
                <span className="h-5 w-5">
                  <img src="/mobile sidebar logo/my_enquery.png" alt="icon" />
                </span>{" "}
                My Enquiries
              </NavLink>
              <NavLink
                to="/settings/saved"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#EE1422] text-md flex items-center gap-2"
                    : "text-black text-md flex items-center gap-2"
                }
                onClick={() => setIsRightSidebarOpen(false)}
              >
                <span className="h-5 w-5">
                  <img src="/mobile sidebar logo/saved_cars.png" alt="icon" />
                </span>{" "}
                Saved Cars
              </NavLink>
              <NavLink
                to="/settings/buy-packages"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#EE1422] text-md flex items-center gap-2"
                    : "text-black text-md flex items-center gap-2"
                }
                onClick={() => setIsRightSidebarOpen(false)}
              >
                <span className="h-5 w-5">
                  <img src="/mobile sidebar logo/buy_package.png" alt="icon" />
                </span>{" "}
                Buy Packages
              </NavLink>
              <NavLink
                to="/settings/bought-packages"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#EE1422] text-md flex items-center gap-2"
                    : "text-black text-md flex items-center gap-2"
                }
                onClick={() => setIsRightSidebarOpen(false)}
              >
                <span className="h-5 w-5">
                  <img
                    src="/mobile sidebar logo/brought_packages.png"
                    alt="icon"
                  />
                </span>{" "}
                Bought Packages
              </NavLink>

              {user && (
                <button
                  onClick={() => {
                    setShowDialog(true);
                    setIsRightSidebarOpen(false);
                  }}
                  className="w-full py-1.5 mt-2 cursor-pointer text-sm transition text-red-500 border border-red-400 rounded-xs hover:bg-gray-200 active:scale-95 active:bg-red-500 active:text-white"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Logout Confirmation Dialog */}
      {showDialog && (
        <div className="h-screen fixed inset-0 flex items-center justify-center z-50 bg-black/50 px-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 md:p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowDialog(false)}
              className="absolute top-4 right-4 text-gray-800 hover:text-red-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Illustration (optional) */}
            <div className="flex justify-center mb-4">
              <img
                src="/logout.png"
                alt="logout illustration"
                className="w-24 h-20"
              />
            </div>

            {/* Title */}
            <h2 className="text-sm md:text-lg font-semibold text-center tracking-tight mb-3">
              Are you sure you want to log out?
            </h2>

            {/* Description */}
            <p className="text-[10px] font-semibold text-black text-center leading-tight">
              You can log back in anytime using your credentials. If you’re
              trying to access a different account, there’s no need to log out.
              Simply{" "}
              <span className="text-green-600 underline cursor-pointer">
                add another account
              </span>{" "}
              and switch between profiles without leaving your current session.
            </p>

            {/* Buttons */}
            <div className="w-full flex justify-center gap-2 md:gap-6 mt-4 text-sm">
              <button
                onClick={() => setShowDialog(false)}
                className="w-full md:w-auto md:px-14 py-2 text-md border rounded-sm cursor-pointer hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="w-full md:w-auto md:px-14 py-2 text-md bg-black text-white rounded-sm cursor-pointer hover:bg-gray-800"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div
          className="h-screen fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ✅ Backdrop for Right Sidebar */}
      {isRightSidebarOpen && (
        <div
          className="h-screen fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsRightSidebarOpen(false)}
        />
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        mobileNumber=""
        checkbox={false}
      />
    </nav>
  );
};

export default Navbar;