import { MapPin, ChevronDown, X, SearchIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import LocationModal from "./LocationModal";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { setLocation } from "../store/slices/locationSlice";
import {
  setSearchTerm,
  setSelectedFilters,
  setSortOption,
  updateSelectedFilter,
} from "../store/slices/carSlice";
import FilterBar from "./filters/FilterBar";
import { cityData } from "../data/cityData";
import { sortOptions } from "../data/filterOptions";

interface CarListHeaderProps {
  carCount?: number;
}

interface Filters {
  price: { min: number; max: number };
  year: { min: number; max: number };
  [key: string]: any; // Baaki filters jo array ya different type ho sakte hain
}
const CarListHeader: React.FC<CarListHeaderProps> = ({ carCount = 0 }) => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedFilters = useSelector(
    (state: RootState) => state.cars.selectedFilters
  );
  const location = useSelector((state: RootState) => state.location.location);
  const searchTerm = useSelector((state: RootState) => state.cars.searchTerm);
  const sortOption = useSelector((state: RootState) => state.cars.sortOption);

  const [openDropdown, setOpenDropdown] = useState<"location" | "sort" | null>(
    null
  );
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const locationRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const currentSortLabel =
    sortOptions.find((o) => o.value === sortOption)?.label ||
    sortOptions[0].label;

  const handleLocationChange = (loc: string) => {
    dispatch(setLocation(loc));
    setIsLocationModalOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        locationRef.current &&
        !locationRef.current.contains(e.target as Node) &&
        sortRef.current &&
        !sortRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const defaultFilters: Filters = {
    price: { min: 0, max: 10000000 },
    year: { min: 2000, max: 2025 },
  };

  return (
    <div className="w-full mb-2 lg:mb-4">
      {/* Top Section */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between lg:mb-3 py-1">
        <div className="hidden text-sm lg:flex flex-1 font-semibold">
          <a href="/" className="hover:underline">
            Home
          </a>
          &nbsp;<span>{" > "}</span>&nbsp;
          <span className="underline underline-offset-3">Used Cars</span>
        </div>

        <div className="flex w-full lg:w-auto flex-1 gap-3 px-4 sm:px-0">
          {/* Search */}
          <span className="w-full flex items-center gap-2 bg-gray-100 lg:bg-transparent border border-gray-200 rounded-sm px-2 lg:px-4 py-2">
            <SearchIcon
              className="w-5 md:w-4 h-5 md:h-4 text-black"
              strokeWidth={1.8}
            />

            <input
              type="text"
              placeholder="Search for Cars, Brands, Model..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="w-full focus:outline-none text-xs md:text-xs text-black placeholder:text-black"
            />

            {/* ❌ Clear Button */}
            {searchTerm && (
              <button
                onClick={() => dispatch(setSearchTerm(""))}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </span>

          {/* Location Dropdown */}
          <div
            ref={locationRef}
            className="hidden lg:block relative w-fit z-10"
          >
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "location" ? null : "location")
              }
              className="rounded-sm px-3 py-2 text-sm w-full flex items-center justify-between border border-gray-200 hover:bg-gray-200 cursor-pointer"
            >
              <span className="flex items-center gap-2 pr-4 text-xs font-semibold whitespace-nowrap">
                <MapPin className="w-3 h-3" />
                {location}
              </span>
              <ChevronDown
                className={`h-4 w-4 transform transition-transform duration-200 ${
                  openDropdown === "location" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === "location" && (
              <div className="absolute right-0 mt-1 w-[150px] bg-white border border-gray-200 rounded-md shadow-lg z-50">
                {cityData.map((city, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleLocationChange(city);
                      dispatch(
                        updateSelectedFilter({ key: "location", value: [city] })
                      );
                      setOpenDropdown(null);
                    }}
                    className={`block w-full text-left px-3 py-2 text-xs hover:bg-gray-200 ${
                      location === city
                        ? "font-semibold text-white bg-black rounded-sm"
                        : ""
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Filter Bar Buttons  */}
      <div className="lg:hidden px-4 sm:px-0">
        <FilterBar />
      </div>

      {/* Middle Section */}
      <div className="px-4 md:px-0 py-2 rounded-xs lg:rounded-md flex items-center justify-between gap-1.5 lg:gap-3 relative">
        <h2 className="w-full text-xs md:text-xs lg:text-[1rem] font-semibold flex items-center gap-1 truncate overflow-ellipsis">
          {carCount} Cars in {location || "All Locations"}
        </h2>
        <div ref={sortRef} className="relative z-5">
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === "sort" ? null : "sort")
            }
            className="bg-black lg:bg-white text-white lg:text-black rounded-sm px-3 lg:px-4 py-1.5 lg:py-2 text-sm sm:w-auto flex items-center justify-between border border-gray-200 hover:bg-gray-200"
          >
            <div className="hidden lg:block font-semibold text-[10px] whitespace-nowrap">
              Sort By :
            </div>
            <span className="text-[10px] lg:text-[10px] font-bold lg:ml-1 whitespace-nowrap">
              {currentSortLabel}
            </span>
            <ChevronDown
              className={`w-4 lg:w-4 h-4 lg:h-4 ml-1 lg:ml-2 transform transition-transform duration-200 ${
                openDropdown === "sort" ? "rotate-180" : ""
              }`}
            />
          </button>

          {openDropdown === "sort" && (
            <div className="absolute right-0 mt-px w-40 lg:w-54 bg-white text-xs rounded-md shadow-lg z-50 p-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    console.log("sort", opt.value);
                    dispatch(setSortOption(opt.value));
                    setOpenDropdown(null);
                  }}
                  className={`w-full lg:mb-1 text-left px-4 py-2 text-xs lg:text-xs text-black rounded-sm hover:bg-gray-200 ${
                    sortOption === opt.value ? "bg-black text-white" : ""
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Bottom Section chips */}
      <div className="hidden w-full lg:flex flex-wrap gap-3 mt-1 lg:mt-2">
        {Object.entries(selectedFilters).map(([filterType, values]) => {
          // Skip if values are same as defaults

          const isDefault =
            filterType === "price" || filterType === "year"
              ? typeof values === "object" &&
                values !== null &&
                !Array.isArray(values) &&
                (values as { min: number; max: number }).min ===
                  (defaultFilters[filterType] as { min: number; max: number })
                    .min &&
                (values as { min: number; max: number }).max ===
                  (defaultFilters[filterType] as { min: number; max: number })
                    .max
              : Array.isArray(values) &&
                Array.isArray(defaultFilters[filterType]) &&
                values.length === defaultFilters[filterType].length &&
                values.every((v, i) => v === defaultFilters[filterType][i]);

          if (!Array.isArray(values) || values.length === 0 || isDefault)
            return null;

          // Otherwise show the filter chips
          return values.map((val) => (
            <div
              key={`${filterType}-${val}`}
              className="flex items-center gap-2 px-2 py-1 rounded-xs border border-blue-400 w-fit"
            >
              <p className="text-[10px] font-semibold text-blue-500">{val}</p>
              <button
                className="hover:bg-blue-100 rounded-full p-0.5"
                onClick={() => {
                  const updated = values.filter((v) => v !== val);
                  dispatch(
                    setSelectedFilters({
                      ...selectedFilters,
                      [filterType]: updated,
                    })
                  );
                }}
              >
                <X className="w-2.5 h-2.5 text-blue-500" />
              </button>
            </div>
          ));
        })}
      </div>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        citySearch={citySearch}
        setCitySearch={setCitySearch}
      />
    </div>
  );
};

export default CarListHeader;