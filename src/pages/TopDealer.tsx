import { MapPin, Phone, SearchIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// Type definition for a dealer
interface Dealer {
  id: number;
  name: string;
  role: string;
  location: string;
  imageUrl: string;
}

const dealers: Dealer[] = [
  {
    id: 1,
    name: "Sourav Chakraborty",
    role: "Owner",
    location: "Kurla, Mumbai - 700008",
    imageUrl: "/default-men-logo.jpg",
  },
  {
    id: 2,
    name: "Sourav Chakraborty",
    role: "Owner",
    location: "Kurla, Mumbai - 700008",
    imageUrl: "/default-men-logo.jpg",
  },
  {
    id: 3,
    name: "Sourav Chakraborty",
    role: "Owner",
    location: "Kurla, Mumbai - 700008",
    imageUrl: "/default-men-logo.jpg",
  },
  {
    id: 4,
    name: "Sourav Chakraborty",
    role: "Owner",
    location: "Kurla, Mumbai - 700008",
    imageUrl: "/default-men-logo.jpg",
  },
  {
    id: 5,
    name: "Sourav Chakraborty",
    role: "Owner",
    location: "Kurla, Mumbai - 700008",
    imageUrl: "/default-men-logo.jpg",
  },
  {
    id: 6,
    name: "Sourav Chakraborty",
    role: "Owner",
    location: "Kurla, Mumbai - 700008",
    imageUrl: "/default-men-logo.jpg",
  },
  {
    id: 7,
    name: "Sourav Chakraborty",
    role: "Owner",
    location: "Kurla, Mumbai - 700008",
    imageUrl: "/default-men-logo.jpg",
  },
  {
    id: 8,
    name: "Sourav Chakraborty",
    role: "Owner",
    location: "Kurla, Mumbai - 700008",
    imageUrl: "/default-men-logo.jpg",
  },
];

const cities = ["Kolkata", "Mumbai", "Delhi"];

const TopDealer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Kolkata");
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className="max-w-7xl mx-auto px-10 py-10 mt-14 mb-14 relative z-0">
      {/* bg image */}
      <div className="w-full h-[300px] absolute -top-[5%] left-0 -z-1">
        <img
          src="/top-dealer-bg-img.png"
          alt="bg"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      {/* Top Dealers component */}
      <div className="z-10">
        {/* Breadcrumb */}
        <div className="text-sm text-black mb-10">
          Home &gt; <span className="font-semibold underline">Top Dealers</span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center mb-8">
          Top Dealers Based on City
        </h1>

        {/* Search and Dropdown */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          <span className="flex items-center bg-white border border-gray-200 rounded-md px-4 py-2 w-full gap-2 md:w-1/3">
            <SearchIcon className="h-5 w-5 text-gray-500 " />
            <input
              type="text"
              placeholder="Search by Cars, Brands, Model..."
              className="w-full placeholder:text-sm focus:outline-none"
            />
          </span>

          {/* Dropdown Button */}
          <div ref={dropdownRef} className="relative w-full md:w-48">
            <button
              onClick={() => setOpen(!open)}
              className="w-full bg-black text-white border border-gray-700 rounded-md px-4 py-2 flex justify-between items-center focus:outline-none transition-all duration-200"
            >
              <span className="flex items-center gap-2 ">
                <MapPin className="h-4 w-4" />
                {selected}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transform transition-transform ${
                  open ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown List */}
            {open && (
              <div className="absolute mt-1 w-full bg-white border border-gray-700 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                {cities.map((city) => (
                  <div
                    key={city}
                    onClick={() => {
                      setSelected(city);
                      setOpen(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-300 text-black transition-colors duration-150"
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
      <div className="max-w-5xl mx-auto pt-10">
        <h2 className="text-gray-700 ml-6 py-2">Recommended</h2>
        {dealers.map((dealer) => (
          <div
            key={dealer.id}
            className="flex flex-col md:flex-row items-center justify-between p-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={dealer.imageUrl}
                alt={dealer.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="">
                <div className="flex items-center gap-4">
                  <h2 className="font-semibold">{dealer.name}</h2>
                  <span className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                    {dealer.role}
                  </span>
                </div>
                <p className="text-xs text-gray-700 mt-1 flex items-center gap-1">
                  <MapPin className="h-[14px] w-[14px] mb-[3px]" />{" "}
                  {dealer.location}
                </p>
              </div>
            </div>
            <button className="mt-4 md:mt-0 bg-black text-white px-4 py-2 rounded hover:bg-black/80 cursor-pointer hover:scale-[1.05] flex items-center gap-3">
              <Phone className="h-4 w-4" />
              Phone
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopDealer;
