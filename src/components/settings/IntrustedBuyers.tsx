import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { ChevronDown, MapPin, Phone, SearchIcon } from "lucide-react";

const InterestedBuyers: React.FC = () => {
  const buyers = useSelector((state: RootState) => state.buyers.buyers);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortOptions = [
    { value: "Indore", label: "Indore" },
    { value: "Bhopal", label: "Bhopal" },
    { value: "Pune", label: "Pune" },
    { value: "Ahmedabad", label: "Ahmedabad" },
    { value: "Delhi", label: "Delhi" },
    { value: "Kanpur", label: "Kanpur" },
    { value: "Lucknow", label: "Lucknow" },
    { value: "Chandigarh", label: "Chandigarh" },
    { value: "Jaipur", label: "Jaipur" },
    { value: "Hyderabad", label: "Hyderabad" },
  ];

  const currentSortLabel =
    // sortOptions.find((o) => o.value === sortOption)?.label ||
    sortOptions.find((o) => o.value)?.label ||
    sortOptions[0].label;

  return (
    <div className=" max-w-7xl mx-auto">
      {/* header */}
      <div className="w-full mb-4 md:mb-6 px-4 md:px-0 flex flex-col md:flex-row gap-2 md:gap-0 md:items-center justify-between ">
        <h2 className="text-md md:text-2xl font-bold py-2 md:py-0">Interested Buyers</h2>
        {/* Sort dropdown */}
        <div className="relative flex md:flex-none w-full gap-2 md:gap-0 sm:w-auto">
          <span className="md:hidden w-full md:w-[60%] flex items-center gap-2 bg-gray-100 rounded-sm px-2 md:px-4 py-2">
            <SearchIcon className="w-3 md:w-4 h-3 md:h-4 text-black" />
            <input
              type="text"
              placeholder="Search for Cars, Brands, Model..."
              className="w-full focus:outline-none text-[10px] md:text-xs text-black placeholder:text-black"
            />
          </span>
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="bg-[#24272C] text-white rounded-sm px-2 py-2 text-sm  sm:w-auto flex items-center justify-between border border-gray-300 transition cursor-pointer hover:bg-gray-800"
          >
            {/* <span className="font-medium text-xs md:text-md">Sort By :</span> */}
            <span className="text-xs ml-1">{currentSortLabel}</span>
            <ChevronDown
              className={`w-3 h-3 ml-2 text-white transform transition-transform duration-200 ${
                isSortOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 mt-[1px] w-32 bg-gray-50 text-xs rounded-md shadow-lg z-20 p-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    // dispatch(setSortOption(opt.value));
                    setIsSortOpen(false);
                  }}
                  className={`w-full mb-1 text-left px-4 py-2 text-xs text-black rounded-xs hover:bg-gray-300 transition ${
                    // sortOption === opt.value ? "bg-black text-white" : ""
                     opt.value ? "bg-gray-100 text-black" : ""
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* main Listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 px-4 md:px-0">
        {buyers.map((buyer) => (
          <div
            key={buyer.id}
            className="border border-gray-300 rounded-xs md:rounded-sm overflow-hidden shadow hover:shadow-lg transition-shadow"
          >
            <div className="bg-[#24272C] text-white p-2 rounded-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div>
                  <img
                    src="/user-img.png"
                    alt="user icon"
                    className="h-10 w-10"
                  />
                </div>
                <div className="flex flex-col gap-1 md:flex-none md:gap-0">
                  <h3 className="font-semibold text-xs">{buyer.name}</h3>
                  <p className="text-[10px]">{buyer.role}</p>
                </div>
              </div>
              <a
                href="tel"
                className="p-2 rounded-xs bg-white hover:bg-gray-300"
              >
                <Phone className="h-3 w-3 text-black" />
              </a>
            </div>
            <div className="p-2 space-y-2">
              {/* <div className="flex items-center text-black font-medium text-[10px]">
                <Phone className="h-3 w-3 text-black mr-2" strokeWidth={1.2} />
                <span>{buyer.phone}</span>
              </div> */}
              <div className="flex items-center text-black font-medium text-[10px]">
                <MapPin className="h-3 w-3 text-black mr-2" strokeWidth={1.2} />
                <span>{buyer.location}</span>
              </div>
              <div className="flex items-center text-black font-medium text-[10px]">
                <img src="/like.png" alt="like img" className="h-3 w-3 mr-2" />
                <span>{buyer.preferences.join(", ")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterestedBuyers;
