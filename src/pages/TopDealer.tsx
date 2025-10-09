import { MapPin, Phone, SearchIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../store/redux/hooks";
import { setSelectedCity } from "../store/slices/dealerSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../store/slices/authSlices/authSlice";
import { openLogin } from "../store/slices/authSlices/loginModelSlice";

const TopDealer: React.FC = () => {
  const { dealers, cities, selectedCity } = useAppSelector(
    (state) => state.dealers
  );

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const { user, token } = useSelector(selectAuth);
  const handleAccess = () => {
    if (!user || !token) {
      dispatch(openLogin());
      return;
    }
    console.log("User logged in, allow to view seller");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-10 py-10 mt-4 lg:mt-10 lg:mb-10 relative z-0">
      {/* bg image */}
      <div className="hidden lg:block w-full h-[300px] absolute -top-14 left-0 -z-1">
        <img
          src="/top-dealer-bg-img.png"
          alt="bg"
          className="w-full h-full object-cover opacity-14"
        />
      </div>

      {/* Top Dealers header */}
      <div className="z-10 max-w-8xl mx-auto">
        <div className="hidden lg:block text-sm text-black mb-10">
          Home &gt; <span className="font-semibold underline">Top Dealers</span>
        </div>

        <h1 className="text-md lg:text-3xl font-bold lg:text-center mb-2 lg:mb-8">
          Top Dealers Based on City
        </h1>

        {/* Search + Dropdown */}
        <div className="w-full max-w-5xl lg:px-6 mx-auto flex flex-row items-center justify-center gap-2 lg:gap-4 mb-2 lg:mb-4">
          <span className="w-full flex items-center bg-white border border-gray-200 rounded-xs lg:rounded-sm px-4 py-[6px] lg:py-3 gap-2 lg:w-[50%]">
            <SearchIcon className="h-3 md:h-auto w-3 lg:w-4 text-black" />
            <input
              type="text"
              placeholder="Search by Dealer Name, Phone..."
              className="w-full text-[10px] lg:text-sm placeholder:text-black focus:outline-none"
            />
          </span>

          <div ref={dropdownRef} className="relative lg:w-36">
            <button
              onClick={() => setOpen(!open)}
              className="gap-4 bg-gray-800 text-white border border-gray-700 rounded-xs lg:rounded-sm text-[10px] lg:text-base px-2 lg:px-4 py-[6px] lg:py-[10px] flex justify-between items-center"
            >
              <span className="flex items-center gap-2 ">
                <MapPin className="hidden lg:block h-4 w-4" />
                {selectedCity}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-3 lg:h-4 w-3 lg:w-4 transform transition-transform ${
                  open ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {open && (
              <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-xs lg:rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                {cities.map((city) => (
                  <div
                    key={city}
                    onClick={() => {
                      dispatch(setSelectedCity(city));
                      setOpen(false);
                    }}
                    className="px-2 lg:px-4 py-2 text-xs lg:text-base cursor-pointer hover:bg-gray-300 text-black"
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dealers List */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-gray-400 text-[10px] lg:text-base font-medium lg:ml-6 py-2">
          Recommended
        </h2>
        {dealers.map((dealer) => (
          <div
            key={dealer.id}
            className="flex flex-row items-center justify-between py-2 lg:p-4"
          >
            <div className="flex items-center gap-1 lg:gap-4">
              <img
                src={dealer.imageUrl}
                alt={dealer.name}
                className="w-10 lg:w-18 h-10 lg:h-18 rounded-full object-cover"
              />
              <div className="space-y-1 lg:space-y-2">
                <div className="flex items-center gap-2 lg:gap-4">
                  <h2 className="text-xs lg:text-xl font-semibold truncate whitespace-nowrap">
                    {dealer.name}
                  </h2>
                  <span className="text-[8px] lg:text-sm  text-gray-400 bg-gray-100 px-2 lg:px-4 py-[2px] lg:py-1 rounded">
                    {dealer.role}
                  </span>
                </div>
                <p className="text-[10px] lg:text-sm text-[#24272C] lg:mt-1 flex items-center gap-1 lg:gap-2">
                  <MapPin className="h-[10px] lg:h-[14px] w-[10px] lg:w-[14px] text-[#24272C]" />{" "}
                  {dealer.location}
                </p>
              </div>
            </div>

            <button
              className="bg-gray-800 text-white px-2 lg:px-4 py-[6px] text-xs lg:text-base rounded-xs lg:rounded hover:bg-black/80 flex items-center gap-1 lg:gap-3"
              onClick={() => {
                if (user) {
                  console.log(user, "you are loggedIn"); //todo: baad me isme call button ko working karna hai direct call ke liye.
                } else {
                  handleAccess();
                }
              }}
            >
              <Phone className="h-3 lg:h-4 w-3 lg:w-4" />
              Phone
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopDealer;
