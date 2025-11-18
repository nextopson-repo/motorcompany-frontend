import {
  ChevronDown,
  ChevronRight,
  Heart,
  MapPin,
  Menu,
  Package,
  PackageOpen,
  SquarePlus,
  UserCog2,
  UserRound,
  UserStar,
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
                  {/* <img
                    src="/mobile sidebar logo/solar_user-broken.png"
                    alt="icon"
                  /> */}
                  <UserCog2 className="h-5 w-5" strokeWidth={1.5} />
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
                  {/* <img src="/mobile sidebar logo/my_listings.png" alt="icon" /> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_1544_6517)">
                      <path
                        d="M12.6703 6.04956C12.3848 6.04956 12.1523 5.73081 12.1523 5.33901L12.1457 2.84214C12.1457 1.6269 11.8668 1.40776 10.7512 1.40776L3.10117 1.39448C1.98555 1.39448 1.70664 1.62026 1.70664 2.8355V13.5601C1.70664 14.7753 1.98555 14.9945 3.10117 14.9945L4.84766 15.0144C5.23281 15.0144 5.53828 15.2535 5.53828 15.5523C5.53828 15.8511 5.22617 16.0902 4.84766 16.0902L2.05195 16.0968C1.30156 16.0902 0.697266 15.4792 0.670703 14.7089L0.664062 1.73979C0.664062 0.962842 1.26172 0.338623 2.01211 0.312061L11.8004 0.30542C12.5574 0.30542 13.1617 0.929639 13.1816 1.69995V5.33237C13.1883 5.72417 12.9559 6.04956 12.6703 6.04956ZM2.74922 4.43589C2.74922 4.13706 3.06133 3.898 3.43984 3.898L10.4059 3.89136C10.791 3.89136 11.0965 4.13042 11.0965 4.42925C11.0965 4.72808 10.7844 4.96714 10.4059 4.96714L3.44648 4.97378C3.06133 4.97378 2.74922 4.73472 2.74922 4.43589ZM2.74922 7.30464C2.74922 7.00581 3.06133 6.76675 3.43984 6.76675L6.92617 6.76011C7.31133 6.76011 7.6168 6.99917 7.6168 7.298C7.6168 7.59683 7.30469 7.83589 6.92617 7.83589L3.43984 7.84253C3.06133 7.84253 2.74922 7.60347 2.74922 7.30464Z"
                        fill="black"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.9027 16.6877C15.6637 16.6877 15.4777 16.4952 15.4777 16.2561V16.2495H15.4645C15.2586 14.5694 13.8707 13.2612 12.1707 13.2014C12.1508 13.2014 12.1325 13.2031 12.1143 13.2047C12.096 13.2064 12.0777 13.2081 12.0578 13.2081C12.0379 13.2081 12.0196 13.2064 12.0014 13.2047C11.9831 13.2031 11.9648 13.2014 11.9449 13.2014C10.2449 13.2545 8.85703 14.5627 8.65117 16.2495H8.63789V16.2561C8.63789 16.4952 8.44531 16.6877 8.21289 16.6877C7.98047 16.6877 7.78789 16.4952 7.78789 16.2561L7.78125 16.2163C7.78125 16.1432 7.80117 16.0768 7.83438 16.017C8.06016 14.5163 9.02305 13.2612 10.3645 12.6834C9.57422 12.1323 9.04961 11.2159 9.04961 10.1667C9.04961 8.48657 10.3977 7.12524 12.0578 7.12524C13.718 7.12524 15.066 8.48657 15.066 10.1667C15.066 11.2092 14.548 12.1323 13.7578 12.6834C15.0992 13.2678 16.0688 14.5295 16.2879 16.037C16.3145 16.0901 16.3344 16.1565 16.3344 16.2229V16.2627C16.3344 16.4952 16.1418 16.6877 15.9027 16.6877ZM12.0578 7.99517C13.2398 7.99517 14.2027 8.9647 14.2027 10.1667C14.2027 11.3686 13.2398 12.3381 12.0578 12.3381C10.8758 12.3381 9.91289 11.3686 9.91289 10.1667C9.91289 8.97134 10.8758 7.99517 12.0578 7.99517Z"
                        fill="black"
                        stroke="black"
                        strokeWidth="0.3"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1544_6517">
                        <rect width="17" height="17" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>{" "}
                My Listing
              </NavLink>
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
                  {/* <img src="/mobile sidebar logo/add_car.png" alt="icon" /> */}
                  <SquarePlus className="h-5 w-5" strokeWidth={1.5} />
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
                  {/* <img src="/mobile sidebar logo/" alt="icon" /> */}
                  <UserStar className="h-5 w-5" strokeWidth={1.5} />
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
                  {/* <img src="/mobile sidebar logo/saved_cars.png" alt="icon" /> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <rect
                      x="0.5"
                      y="0.5"
                      width="17"
                      height="17"
                      rx="1.5"
                      fill="white"
                      stroke="#24272C"
                    />
                    <path
                      d="M6.75 5.40002C5.50755 5.40002 4.5 6.39722 4.5 7.62752C4.5 8.62067 4.89375 10.9778 8.7696 13.3605C8.83911 13.4025 8.91878 13.4247 9 13.4247C9.08122 13.4247 9.16089 13.4025 9.2304 13.3605C13.1067 10.9778 13.5 8.62067 13.5 7.62752C13.5 6.39722 12.4924 5.40002 11.25 5.40002C10.0075 5.40002 9 6.75002 9 6.75002C9 6.75002 7.99245 5.40002 6.75 5.40002Z"
                      stroke="#24272C"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
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
                  {/* <img src="/mobile sidebar logo/buy_package.png" alt="icon" /> */}
                  <Package className="h-5 w-5" strokeWidth={1.5} />
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
                  {/* <img
                    src="/mobile sidebar logo/brought_packages.png"
                    alt="icon"
                  /> */}
                  <PackageOpen className="h-5 w-5" strokeWidth={1.5} />
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
