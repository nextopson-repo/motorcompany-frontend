import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { ChevronDown, MapPin, Phone } from "lucide-react";

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
      <div className="w-full mb-6 flex items-center justify-between ">
        <h2 className="text-2xl font-bold">Interested Buyers</h2>
        {/* Sort dropdown */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="bg-black text-white rounded-sm px-4 py-2 text-sm w-full sm:w-auto flex items-center justify-between border border-gray-300 transition cursor-pointer hover:bg-gray-800"
          >
            {/* <span className="font-medium text-xs md:text-md">Sort By :</span> */}
            <span className="text-xs ml-1">{currentSortLabel}</span>
            <ChevronDown
              className={`w-4 h-4 ml-2 text-white transform transition-transform duration-200 ${
                isSortOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 mt-[1px] w-54 bg-gray-50 text-xs rounded-md shadow-lg z-20 p-1">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {buyers.map((buyer) => (
          <div
            key={buyer.id}
            className="border border-gray-300 rounded-sm overflow-hidden shadow hover:shadow-lg transition-shadow"
          >
            <div className="bg-black text-white p-2 rounded-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div>
                  <img
                    src="/user-img.png"
                    alt="user icon"
                    className="h-10 w-10"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-xs">{buyer.name}</h3>
                  <p className="text-[10px]">{buyer.role}</p>
                </div>
              </div>
              <a
                href="tel"
                className="p-2 rounded-xs bg-white hover:bg-gray-300"
              >
                <Phone className="h-4 w-4 text-black" />
              </a>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center text-black font-medium text-xs">
                <Phone className="h-4 w-4 text-black mr-2" strokeWidth={1.2} />
                <span>{buyer.phone}</span>
              </div>
              <div className="flex items-center text-black font-medium text-xs">
                <MapPin className="h-4 w-4 text-black mr-2" strokeWidth={1.2} />
                <span>{buyer.location}</span>
              </div>
              <div className="flex items-center text-black font-medium text-xs">
                <img src="/like.png" alt="like img" className="h-4 w-4 mr-2" />
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
