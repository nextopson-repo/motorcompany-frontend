import { MapPin, SearchIcon, ChevronDown, X } from "lucide-react";
import React, { useState } from "react";
import { BiCaretDown } from "react-icons/bi";
import LocationModal from "./LocationModal";

interface CarListHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  carCount?: number;
  city: string;
  onLocationChange?: (location: string) => void;
  filters: {
    brand: string[];
    body: string[];
    fuel: string[];
    transmission: string[];
    ownership: string[];
    priceRange: [number, number];
    yearRange: [number, number];
  };
  onFilterChange: (type: string, value: string) => void;
}

const CarListHeader: React.FC<CarListHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
  carCount = 0,
  city,
  onLocationChange,
  filters,
  onFilterChange,
}) => {
  const [location, setLocation] = useState<string>(city);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);

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
    setLocation(loc);
    setIsLocationModalOpen(false);
    if (onLocationChange) onLocationChange(loc);
  };

  return (
    <div className="w-full mb-4 sm:px-4">
      {/* Top Section */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
        <div className="text-xs sm:text-sm sm:flex-1 font-semibold">
          Home <span>{">"}</span>{" "}
          <span className="underline">Used Cars</span>
        </div>

        <div className="flex w-full sm:w-auto flex-[1] gap-3">
          <div className="flex-1 relative min-w-xs">
            <input
              type="text"
              placeholder="Search for Cars, Brands, Model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-200 rounded-sm focus:outline-none py-2 pl-9 pr-2 placeholder:text-black text-[10px]"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <SearchIcon className="h-4 w-4 text-black" />
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsLocationModalOpen(true)}
            className="rounded-sm px-3 py-1 text-sm w-[150px] flex items-center justify-between border border-gray-200 hover:bg-gray-200 cursor-pointer"
          >
            <span className="flex items-center gap-2 text-xs font-semibold">
              <MapPin className="w-4 h-4" />
              {location ? location : "Select City"}
            </span>
            <span>
              <BiCaretDown
                className={`transform transition-transform duration-200 ${
                  isLocationModalOpen ? "rotate-180" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Middle Section */}
      <div className="py-2 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative">
        <h2 className="text-base sm:text-md font-semibold">
          {carCount} Second Hand Cars in {city || "All Locations"}
        </h2>

        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="bg-white text-black rounded-sm px-4 py-2 text-sm w-full sm:w-auto flex items-center justify-between border border-gray-300 transition cursor-pointer hover:bg-gray-200"
          >
            <span className="font-medium text-xs md:text-md">Sort By :</span>
            <span className="text-xs ml-1">{currentSortLabel}</span>
            <ChevronDown
              className={`w-4 h-4 ml-2 text-black transform transition-transform duration-200 ${
                isSortOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 mt-[1px] w-54 bg-white text-xs rounded-md shadow-lg z-20 p-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSortOption(opt.value);
                    setIsSortOpen(false);
                  }}
                  className={`w-full mb-1 text-left px-4 py-2 text-xs text-black rounded-sm hover:bg-gray-200 transition ${
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

      {/* Bottom Section */}
      <div className="w-full flex flex-wrap gap-2 mt-2">
        {/* Normal filter chips */}
        {Object.entries(filters).map(([filterType, values]) =>
          Array.isArray(values)
            ? values.map((val) => (
                <div
                  key={`${filterType}-${val}`}
                  className="flex items-center gap-2 px-2 py-1 rounded-sm border border-blue-400 w-fit"
                >
                  <p className="text-xs font-semibold text-blue-500">{val}</p>
                  <button
                    onClick={() => onFilterChange(filterType, val)}
                    className="hover:bg-blue-100 rounded-full p-[2px]"
                  >
                    <X className="w-3 h-3 text-blue-500" />
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


// import { MapPin, SearchIcon, X, ChevronDown } from "lucide-react";
// import React, { useMemo, useState } from "react";
// import { carsData } from "../data/cars";
// import { BiCaretDown } from "react-icons/bi";

// interface CarListHeaderProps {
//   searchTerm: string;
//   setSearchTerm: (term: string) => void;
//   sortOption: string;
//   setSortOption: (option: string) => void;
//   carCount?: number;
//   city: string;
//   onLocationChange?: (location: string) => void;
// }

// const CarListHeader: React.FC<CarListHeaderProps> = ({
//   searchTerm,
//   setSearchTerm,
//   sortOption,
//   setSortOption,
//   carCount = 0,
//   city,
//   onLocationChange,
// }) => {
//   const [location, setLocation] = useState<string>(city);
//   const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
//   const [citySearch, setCitySearch] = useState("");

//   const [isSortOpen, setIsSortOpen] = useState(false);

//   const locationOptions = useMemo(() => {
//     const unique = new Set<string>();
//     carsData.forEach((c) => {
//       unique.add(`${c.location.city}, ${c.location.state}`);
//     });
//     return Array.from(unique);
//   }, []);

//   const onLocationChangeLocal = (loc: string) => {
//     setLocation(loc);
//     setIsLocationModalOpen(false);
//     if (onLocationChange) onLocationChange(loc);
//   };

//   const filteredLocations = useMemo(() => {
//     if (!locationOptions) return [];
//     if (!citySearch.trim()) return locationOptions;
//     const q = citySearch.toLowerCase();
//     return locationOptions.filter((l) => l.toLowerCase().includes(q));
//   }, [locationOptions, citySearch]);

//   const cityImage = (loc: string) => {
//     const cityName = loc.split(",")[0].trim().toLowerCase();
//     const map: Record<string, string> = {
//       delhi: "/Cities/dehli-img.png",
//       chandigarh: "/Cities/chandigarh-img.png",
//       indore: "/Cities/indore-img.png",
//       kanpur: "/Cities/kanpur-img.png",
//       pune: "/Cities/pune-img.png",
//       ahmedabad: "/Cities/ahmedabad-img.png",
//       bhopal: "/Cities/bhopal-img.png",
//       lucknow: "/Cities/lucknow-img.png",
//       hyderabad: "/Cities/hyderabad-img.png",
//       jaipur: "/Cities/jaipur-img.png",
//     };
//     return map[cityName] || "/Cities/delhi-img.png";
//   };

//   const sortOptions = [
//     { value: "priceLowToHigh", label: "Price - Low to High" },
//     { value: "priceHighToLow", label: "Price - High to Low" },
//     { value: "yearNewToOld", label: "Year - New to Old" },
//     { value: "yearOldToNew", label: "Year - Old to New" },
//   ];

//   const currentSortLabel =
//     sortOptions.find((o) => o.value === sortOption)?.label ||
//     sortOptions[0].label;

//   return (
//     <div className="w-full mb-4 sm:px-4">
//       {/* Top Section: Breadcrumb + Search */}
//       <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
//         <div className="text-xs sm:text-sm text-gray-600 sm:flex-1">
//           Home <span className="text-black">{">"}</span>{" "}
//           <span className="text-[#EE1422] font-semibold underline">
//             Used Cars
//           </span>
//         </div>

//         <div className="flex w-full sm:w-auto flex-[1] gap-3">
//           <div className="flex-1 relative">
//             <input
//               type="text"
//               placeholder="Search for Cars, Brands, Model..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full border-b border-[#EE1422] focus:outline-none py-2 pl-9 pr-2 placeholder:text-gray-500 text-sm"
//             />
//             <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//               <SearchIcon className="h-5 w-5" />
//             </span>
//           </div>

//           <button
//             type="button"
//             onClick={() => setIsLocationModalOpen(true)}
//             className="bg-[#EE1422] text-white rounded-sm px-3 py-1 text-sm w-[180px] flex items-center justify-between hover:bg-[#b31b25] cursor-pointer"
//           >
//             <span className="flex items-center gap-2">
//               <MapPin className="w-5 h-5" />
//               {location ? location : "Select City"}
//             </span>
//             <span>
//               <BiCaretDown
//                 className={`transform transition-transform duration-200 ${
//                   isLocationModalOpen ? "rotate-180" : ""
//                 }`}
//               />
//             </span>
//           </button>
//         </div>
//       </div>

//       {/* Bottom Section: Count + Sort */}
//       <div className="bg-[#EE1422] text-white px-4 py-2 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative">
//         <h2 className="text-base sm:text-lg font-semibold">
//           {carCount} Second Hand Cars in {city || "All Locations"}
//         </h2>

//         <div className="relative w-full sm:w-auto">
//           <button
//             onClick={() => setIsSortOpen(!isSortOpen)}
//             className="bg-white text-black rounded-sm px-3 py-1 text-sm w-full sm:w-auto flex items-center justify-between border border-gray-300  transition cursor-pointer hover:bg-gray-200"
//           >
//             <span className="font-medium text-sm md:text-md">Sort By :</span>
//             <span className="text-sm md:text-md ml-1">{currentSortLabel}</span>
//             <ChevronDown
//               className={`w-4 h-4 ml-2 text-gray-500 transform transition-transform duration-200 ${
//                 isSortOpen ? "rotate-180" : ""
//               }`}
//             />
//           </button>

//           {isSortOpen && (
//             <div className="absolute right-0 mt-[1px] w-54 bg-white rounded-md shadow-lg z-20 p-1">
//               {sortOptions.map((opt) => (
//                 <button
//                   key={opt.value}
//                   onClick={() => {
//                     setSortOption(opt.value);
//                     setIsSortOpen(false);
//                   }}
//                   className={`w-full mb-1 text-left px-4 py-2 text-sm text-black rounded-sm hover:bg-[#EE1422] hover:text-white transition ${
//                     sortOption === opt.value ? "bg-gray-300" : ""
//                   }`}
//                 >
//                   {opt.label}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Location Modal */}
//       {isLocationModalOpen && (
//         <div className="fixed inset-0 z-50">
//           <div
//             className="absolute inset-0 bg-black/50 backdrop-blur-xs"
//             onClick={() => setIsLocationModalOpen(false)}
//           />
//           <div className="relative overflow-hidden mx-auto h-[85%] mt-10 w-[50%] max-w-5xl bg-gradient-to-b from-[#fee5eb] to-white rounded-xl shadow-xl p-4">
//             {/* heading */}
//             <div className="flex items-center justify-between pb-2 mb-4 border-b border-gray-300">
//               <h3 className="text-lg sm:text-xl font-semibold">
//                 Select your City
//               </h3>
//               <button
//                 onClick={() => setIsLocationModalOpen(false)}
//                 className="p-1 rounded hover:bg-black/5"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             {/* search bar */}
//             <div className="flex gap-3 mb-4">
//               <div className="flex-1 relative">
//                 <input
//                   value={citySearch}
//                   onChange={(e) => setCitySearch(e.target.value)}
//                   placeholder="Enter your City"
//                   className="w-full border border-gray-400 rounded-sm pl-9 pr-3 py-2 text-sm"
//                 />
//                 <SearchIcon className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
//               </div>
//               <button
//                 type="button"
//                 className="bg-[#EE1422] text-white px-4 py-2 rounded-sm text-sm whitespace-nowrap flex items-center gap-2 cursor-pointer"
//                 // onclick function make for location tracking future
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="24"
//                   height="20"
//                   viewBox="0 0 29 30"
//                   fill="none"
//                 >
//                   <path
//                     d="M25.9184 14.0661H24.2388C24.0193 11.7818 23.0118 9.64509 21.3892 8.02243C19.7665 6.39976 17.6298 5.39226 15.3455 5.17275V3.49316C15.3455 3.25281 15.25 3.0223 15.0801 2.85235C14.9101 2.68239 14.6796 2.58691 14.4393 2.58691C14.1989 2.58691 13.9684 2.68239 13.7984 2.85235C13.6285 3.0223 13.533 3.25281 13.533 3.49316V5.17275C11.2587 5.40324 9.13493 6.41584 7.52405 8.03773C5.91318 9.65963 4.91508 11.7903 4.70009 14.0661H3.02051C2.9015 14.0661 2.78365 14.0895 2.6737 14.1351C2.56375 14.1806 2.46385 14.2474 2.37969 14.3315C2.29554 14.4157 2.22879 14.5156 2.18324 14.6255C2.1377 14.7355 2.11426 14.8533 2.11426 14.9723C2.11426 15.0913 2.1377 15.2092 2.18324 15.3191C2.22879 15.4291 2.29554 15.529 2.37969 15.6131C2.46385 15.6973 2.56375 15.7641 2.6737 15.8096C2.78365 15.8551 2.9015 15.8786 3.02051 15.8786H4.70009C4.91961 18.1629 5.9271 20.2996 7.54977 21.9222C9.17244 23.5449 11.3092 24.5524 13.5934 24.7719V26.4515C13.5934 26.6919 13.6889 26.9224 13.8589 27.0923C14.0288 27.2623 14.2593 27.3577 14.4997 27.3577C14.74 27.3577 14.9705 27.2623 15.1405 27.0923C15.3104 26.9224 15.4059 26.6919 15.4059 26.4515V24.7719C17.6894 24.5502 19.8248 23.5419 21.4471 21.9197C23.0693 20.2975 24.0775 18.162 24.2993 15.8786H25.9788C26.0979 15.8786 26.2157 15.8551 26.3256 15.8096C26.4356 15.7641 26.5355 15.6973 26.6197 15.6131C26.7038 15.529 26.7706 15.4291 26.8161 15.3191C26.8617 15.2092 26.8851 15.0913 26.8851 14.9723C26.8851 14.8533 26.8617 14.7355 26.8161 14.6255C26.7706 14.5156 26.7038 14.4157 26.6197 14.3315C26.5355 14.2474 26.4356 14.1806 26.3256 14.1351C26.2157 14.0895 26.0979 14.0661 25.9788 14.0661H25.9184ZM14.4393 22.9957C12.8524 22.9957 11.3012 22.5251 9.98173 21.6435C8.6623 20.7619 7.63393 19.5088 7.02666 18.0427C6.4194 16.5767 6.26051 14.9634 6.57009 13.4071C6.87967 11.8507 7.64382 10.4211 8.7659 9.29898C9.88799 8.17689 11.3176 7.41275 12.874 7.10316C14.4304 6.79358 16.0436 6.95247 17.5097 7.55974C18.9757 8.16701 20.2288 9.19537 21.1104 10.5148C21.992 11.8342 22.4626 13.3855 22.4626 14.9723C22.4626 17.1014 21.6177 19.1434 20.1133 20.65C18.609 22.1565 16.5683 23.0045 14.4393 23.0077V22.9957Z"
//                     fill="white"
//                   />
//                   <path
//                     d="M19.9131 14.9839C19.9131 16.0694 19.591 17.1305 18.9877 18.0329C18.3844 18.9353 17.5269 19.6384 16.5238 20.0533C15.5207 20.4681 14.417 20.5761 13.3526 20.3634C12.2881 20.1508 11.3106 19.6271 10.5439 18.8587C9.77717 18.0903 9.25565 17.1116 9.04535 16.0467C8.83504 14.9818 8.94541 13.8784 9.36247 12.8762C9.77953 11.874 10.4845 11.018 11.3883 10.4167C12.292 9.81537 13.3538 9.49567 14.4393 9.49806C15.1592 9.49806 15.8719 9.64004 16.5368 9.91588C17.2017 10.1917 17.8057 10.596 18.3141 11.1056C18.8226 11.6151 19.2255 12.22 19.4999 12.8855C19.7743 13.551 19.9147 14.2641 19.9131 14.9839Z"
//                     fill="white"
//                   />
//                 </svg>{" "}
//                 Track Location
//               </button>
//             </div>
//             {/* location grid */}
//             <div className="w-full overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//               {filteredLocations.map((loc) => (
//                 <button
//                   key={loc}
//                   onClick={() => onLocationChangeLocal(loc)}
//                   className="h-fit w-fit mx-2 "
//                 >
//                   <img
//                     src={cityImage(loc)}
//                     alt={loc}
//                     className="w-full h-full object-contain rounded-lg mx-auto"
//                   />
//                   <div className="mt-2 text-sm font-medium text-center ">
//                     {loc.split(",")[0]}
//                   </div>
//                 </button>
//               ))}
//             </div>
//             {/* footer image */}
//             <div className="absolute inset-[65%] left-0 -translateX-[10%] w-full h-1/2 opacity-30">
//               <img
//                 src="/public/Cities/cities-bg.png"
//                 alt="cities-bg"
//                 className="w-[100%] h-[80%] object-cover"
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CarListHeader;
