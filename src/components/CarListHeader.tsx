import { MapPin, ChevronDown, X, SearchIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import LocationModal from "./LocationModal";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { setLocation } from "../store/slices/locationSlice";
import { setSearchTerm, setSortOption } from "../store/slices/carSlice";
import FilterBar from "./filters/FilterBar";

interface CarListHeaderProps {
  carCount?: number;
  filters: {
    brand: string[];
    bodyType: string[];
    fuel: string[];
    transmission: string[];
    ownership: string[];
    priceRange: [number, number];
    yearRange: [number, number];
  };
  onFilterChange: (type: string, value: string | number) => void;
}

const cities = [
  "Kolkata",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Jaipur",
  "Ahmedabad",
  "Lucknow",
];

const CarListHeader: React.FC<CarListHeaderProps> = ({
  carCount = 0,
  filters,
  onFilterChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();
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

  const sortOptions = [
    { value: "popularity", label: "Popularity" },
    { value: "yearNewToOld", label: "Newest" },
    { value: "yearOldToNew", label: "Oldest" },
    { value: "priceLowToHigh", label: "Price - Low to High" },
    { value: "priceHighToLow", label: "Price - High to Low" },
  ];

  const currentSortLabel =
    sortOptions.find((o) => o.value === sortOption)?.label ||
    sortOptions[0].label;

  const handleLocationChange = (loc: string) => {
    dispatch(setLocation(loc));
    setIsLocationModalOpen(false);
  };

  // Close dropdown on outside click
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

  return (
    <div className="w-full mb-4">
      {/* Top Section */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between lg:mb-3">
        <div className="hidden text-sm lg:flex flex-1 font-semibold">
          <a href="/" className="hover:underline">Home</a>&nbsp;<span>{" > "}</span>&nbsp;
          <span className="underline underline-offset-3">Used Cars</span>
        </div>

        <div className="flex w-full lg:w-auto flex-1 gap-3">
          {/* Search */}
          <span className="w-full flex items-center gap-2 bg-gray-100 lg:bg-transparent lg:border border-gray-200 rounded-sm px-2 lg:px-4 py-[5px] md:py-2">
            <SearchIcon className="w-3 md:w-4 h-3 md:h-4 text-black" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search for Cars, Brands, Model..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="w-full focus:outline-none text-[9px] md:text-xs text-black placeholder:text-black"
            />
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
              <span className="flex items-center gap-2 pr-4 text-xs font-semibold">
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
                {cities.map((city, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleLocationChange(city);
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
       <div className="lg:hidden">
         <FilterBar />
       </div>

      {/* Middle Section */}
      <div className="py-2 rounded-xs lg:rounded-md flex items-center justify-between gap-[6px] lg:gap-3 relative">
        <h2 className="w-full text-xs lg:text-[1rem] font-semibold flex items-center gap-1 truncate overflow-ellipsis">
          {carCount} <span className="block lg:hidden">Used</span>{" "}
          <span className="hidden lg:block">Second Hand</span> Cars in{" "}
          {location || "All Locations"}
        </h2>
        <div ref={sortRef} className="relative z-5">
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === "sort" ? null : "sort")
            }
            className="bg-black lg:bg-white text-white lg:text-black rounded-sm px-2 lg:px-4 py-[6px] lg:py-2 text-sm sm:w-auto flex items-center justify-between border border-gray-200 hover:bg-gray-200"
          >
            <div className="hidden lg:block font-semibold text-[10px] whitespace-nowrap">
              Sort By :
            </div>
            <span className="text-[8px] lg:text-[10px] font-bold lg:ml-1 whitespace-nowrap">
              {currentSortLabel}
            </span>
            <ChevronDown
              className={`w-3 lg:w-4 h-3 lg:h-4 ml-1 lg:ml-2 transform transition-transform duration-200 ${
                openDropdown === "sort" ? "rotate-180" : ""
              }`}
            />
          </button>

          {openDropdown === "sort" && (
            <div className="absolute right-0 mt-[1px] w-40 lg:w-54 bg-white text-xs rounded-md shadow-lg z-50 p-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    dispatch(setSortOption(opt.value as any));
                    setOpenDropdown(null);
                  }}
                  className={`w-full lg:mb-1 text-left px-4 py-2 text-[10px] lg:text-xs text-black rounded-sm hover:bg-gray-200 ${
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
        {Object.entries(filters).map(([filterType, values]) =>
          Array.isArray(values)
            ? values.map((val) => (
                <div
                  key={`${filterType}-${val}`}
                  className="flex items-center gap-2 px-2 py-1 rounded-xs border border-blue-400 w-fit"
                >
                  <p className="text-[10px] font-semibold text-blue-500">
                    {val}
                  </p>
                  <button
                    onClick={() => onFilterChange(filterType, val)}
                    className="hover:bg-blue-100 rounded-full p-[2px]"
                  >
                    <X className="w-[10px] h-[10px] text-blue-500" />
                  </button>
                </div>
              ))
            : null
        )}
      </div>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationChange={handleLocationChange}
        citySearch={citySearch}
        setCitySearch={setCitySearch}
      />
    </div>
  );
};

export default CarListHeader;

// import { MapPin, ChevronDown, X, SearchIcon } from "lucide-react";
// import React, { useEffect, useRef, useState } from "react";
// import LocationModal from "./LocationModal";
// import { useDispatch, useSelector } from "react-redux";
// import type { AppDispatch, RootState } from "../store/store";
// import { setLocation } from "../store/slices/locationSlice";

// interface CarListHeaderProps {
//   searchTerm: string;
//   setSearchTerm: (term: string) => void;
//   sortOption: string;
//   setSortOption: (option: string) => void;
//   carCount?: number;
//   city: string;
//   onLocationChange?: (location: string) => void;
//   filters: {
//     brand: string[];
//     bodyType: string[];
//     fuel: string[];
//     transmission: string[];
//     ownership: string[];
//     priceRange: [number, number];
//     yearRange: [number, number];
//   };
//   onFilterChange: (type: string, value: string | number) => void;
// }

// const cities = [
//   "Kolkata",
//   "Mumbai",
//   "Delhi",
//   "Bangalore",
//   "Hyderabad",
//   "Chennai",
//   "Pune",
//   "Jaipur",
//   "Ahmedabad",
//   "Lucknow",
// ];

// const CarListHeader: React.FC<CarListHeaderProps> = ({
//   searchTerm,
//   // setSearchTerm,
//   sortOption,
//   // setSortOption,
//   city,
//   onLocationChange,
//   onFilterChange,
//   carCount = 0,
//   filters,
// }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const location = useSelector((state: RootState) => state.location.location);

//   const [openDropdown, setOpenDropdown] = useState<"location" | "sort" | null>(
//     null
//   );

//   const locationRef = useRef<HTMLDivElement>(null);
//   const sortRef = useRef<HTMLDivElement>(null);

//   // const [location, setLocation] = useState<string>(city);
//   const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
//   const [citySearch, setCitySearch] = useState("");
//   // const [isSortOpen, setIsSortOpen] = useState(false);
//   // const [isOpen, setIsOpen] = useState(false);

//   const sortOptions = [
//     { value: "popularity", label: "Popularity" },
//     { value: "yearNewToOld", label: "Newest" },
//     { value: "yearOldToNew", label: "Oldest" },
//     { value: "priceLowToHigh", label: "Price - Low to High" },
//     { value: "priceHighToLow", label: "Price - High to Low" },
//   ];

//   const currentSortLabel =
//     sortOptions.find((o) => o.value === sortOption)?.label ||
//     sortOptions[0].label;

//   const handleLocationChange = (loc: string) => {
//     setLocation(loc);
//     setIsLocationModalOpen(false);
//     if (onLocationChange) onLocationChange(loc);
//   };

//   // 🔹 Outside click close
//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (
//         locationRef.current &&
//         !locationRef.current.contains(e.target as Node) &&
//         sortRef.current &&
//         !sortRef.current.contains(e.target as Node)
//       ) {
//         setOpenDropdown(null);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="w-full mb-4">
//       {/* Top Section */}
//       <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
//         <div className="hidden text-sm lg:flex-1 font-semibold">
//           Home <span>{">"}</span>{" "}
//           <span className="underline underline-offset-3">Used Cars</span>
//         </div>

//         <div className="flex w-full lg:w-auto flex-1 gap-3">
//           <span className="w-full flex items-center gap-2 bg-gray-100 rounded-sm px-2 lg:px-4 py-[5px] md:py-2">
//             <SearchIcon className="w-3 md:w-4 h-3 md:h-4 text-black" />
//             <input
//               type="text"
//               placeholder="Search for Cars, Brands, Model..."
//               value={searchTerm}
//               onChange={(e) => dispatch(setSearchTerm(e.target.value))}
//               className="w-full focus:outline-none text-[9px] md:text-xs text-black placeholder:text-black"
//             />
//           </span>

//           {/* Location Dropdown */}
//           <div ref={locationRef} className="hidden lg:block relative w-fit z-10">
//             <button
//               onClick={() =>
//                 setOpenDropdown(openDropdown === "location" ? null : "location")
//               }
//               className="rounded-sm px-3 py-2 text-sm w-full flex items-center justify-between border border-gray-200 hover:bg-gray-200 cursor-pointer"
//             >
//               <span className="flex items-center gap-2 pr-4 text-xs font-semibold">
//                 <MapPin className="w-3 h-3" />
//                 {location}
//               </span>
//               <ChevronDown
//                 className={`h-4 w-4 transform transition-transform duration-200 ${
//                   openDropdown === "location" ? "rotate-180" : ""
//                 }`}
//               />
//             </button>

//             {openDropdown === "location" && (
//               <div className="absolute right-0 mt-1 w-[150px] bg-white border border-gray-200 rounded-md shadow-lg z-50">
//                 {cities.map((city, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => {
//                       dispatch(setLocation(city));
//                       setOpenDropdown(null);
//                     }}
//                     className={`block w-full text-left px-3 py-2 text-xs hover:bg-gray-200 ${
//                       location === city
//                         ? "font-semibold text-white bg-black rounded-sm"
//                         : ""
//                     }`}
//                   >
//                     {city}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Middle Section */}
//       <div className="py-2 rounded-xs lg:rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative">
//         <h2 className="text-base sm:text-md font-semibold">
//           {carCount} Second Hand Cars in {city || "All Locations"}
//         </h2>
//         <div
//           ref={sortRef}
//           className="relative w-full sm:w-auto mt-3 sm:mt-0 z-5"
//         >
//           <button
//             onClick={() =>
//               setOpenDropdown(openDropdown === "sort" ? null : "sort")
//             }
//             className="bg-white text-black rounded-sm px-4 py-2 text-sm w-full sm:w-auto flex items-center justify-between border border-gray-200 hover:bg-gray-200"
//           >
//             <span className="font-semibold text-[10px]">Sort By :</span>
//             <span className="text-[10px] font-bold ml-1">
//               {currentSortLabel}
//             </span>
//             <ChevronDown
//               className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${
//                 openDropdown === "sort" ? "rotate-180" : ""
//               }`}
//             />
//           </button>

//           {openDropdown === "sort" && (
//             <div className="absolute right-0 mt-[1px] w-54 bg-white text-xs rounded-md shadow-lg z-50 p-1">
//               {sortOptions.map((opt) => (
//                 <button
//                   key={opt.value}
//                   onClick={(e) => {
//                     dispatch(setSortOption(e.target.value as any));
//                     setOpenDropdown(null);
//                   }}
//                   className={`w-full mb-1 text-left px-4 py-2 text-xs text-black rounded-sm hover:bg-gray-200 ${
//                     sortOption === opt.value ? "bg-black text-white" : ""
//                   }`}
//                 >
//                   {opt.label}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* fillter Bottom Section */}
//       <div className="w-full flex flex-wrap gap-3 mt-2">
//         {Object.entries(filters).map(([filterType, values]) =>
//           Array.isArray(values)
//             ? values.map((val) => (
//                 <div
//                   key={`${filterType}-${val}`}
//                   className="flex items-center gap-2 px-2 py-1 rounded-xs border border-blue-400 w-fit"
//                 >
//                   <p className="text-[10px] font-semibold text-blue-500">
//                     {val}
//                   </p>
//                   <button
//                     onClick={() => onFilterChange(filterType, val)}
//                     className="hover:bg-blue-100 rounded-full p-[2px]"
//                   >
//                     <X className="w-3 h-3 text-blue-500" />
//                   </button>
//                 </div>
//               ))
//             : null
//         )}
//       </div>

//       {/* Location Modal */}
//       <LocationModal
//         isOpen={isLocationModalOpen}
//         onClose={() => setIsLocationModalOpen(false)}
//         onLocationChange={handleLocationChange}
//         citySearch={citySearch}
//         setCitySearch={setCitySearch}
//       />
//     </div>
//   );
// };

// export default CarListHeader;
