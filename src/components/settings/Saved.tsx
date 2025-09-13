
import React, { useState } from "react";
import CarCard from "../CarCard";
import { ChevronDown, SearchIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { setSearchTerm, setSortOption } from "../../store/slices/savedSlice";

const Saved: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cars, searchTerm, sortOption } = useSelector(
    (state: RootState) => state.saved
  );

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

  // Filtering & Sorting
  const filteredCars = cars
    .filter((c) =>
      c.brand.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case "priceLowToHigh":
          return a.carPrice - b.carPrice;
        case "priceHighToLow":
          return b.carPrice - a.carPrice;
        case "yearNewToOld":
          return b.manufacturingYear - a.manufacturingYear; // replace with year field if available
        case "yearOldToNew":
          return a.manufacturingYear - b.manufacturingYear;
        default:
          return 0;
      }
    });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Top bar */}
      <div className="grid grid-cols-3 justify-between items-center mb-6">
        <div className="w-fit whitespace-nowrap">
          <h1 className="font-semibold text-2xl">Saved Cars</h1>
        </div>
        <div className="w-full flex justify-end gap-2 col-span-2 ">
          <span className="w-[50%] flex items-center gap-2 bg-gray-100 rounded-sm px-4 py-2">
            <SearchIcon className="w-4 h-4 text-black" />
            <input
              type="text"
              placeholder="Search for Cars, Brands, Model..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="w-full focus:outline-none text-xs text-black placeholder:text-black"
            />
          </span>

          {/* Sort dropdown */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="bg-black text-white rounded-sm px-4 py-2 text-sm w-full sm:w-auto flex items-center justify-between border border-gray-300 transition cursor-pointer hover:bg-gray-800"
            >
              <span className="font-medium text-xs md:text-md">Sort By :</span>
              <span className="text-xs ml-1">{currentSortLabel}</span>
              <ChevronDown
                className={`w-4 h-4 ml-2 text-white transform transition-transform duration-200 ${
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
                      dispatch(setSortOption(opt.value));
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
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {filteredCars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
};

export default Saved;


// import React, { useState } from "react";
// import CarCard from "../CarCard";
// import { ChevronDown, SearchIcon } from "lucide-react";

// const Saved: React.FC = () => {
//   const listings = [
//     {
//       id: 1,
//       title: "Hyundai Exter SX 1.2 MT",
//       price: 880000,
//       oldPrice: 1173333, // example old price for discount calculation
//       image: "/car-1.jpg",
//       type: "SUV",
//       seater: 5,
//       mileage: 19.4,
//       fuelTypes: "Petrol",
//       gear: "Manual",
//       seller: "Sourav Jha",
//     },
//     {
//       id: 2,
//       title: "Hyundai Exter SX 1.2 MT",
//       price: 880000,
//       oldPrice: 1173333,
//       image: "/car-2.jpg",
//       type: "SUV",
//       seater: 5,
//       mileage: 19.4,
//       fuelTypes: "Petrol",
//       gear: "Manual",
//       seller: "Sourav Jha",
//     },
//     {
//       id: 3,
//       title: "Hyundai Exter SX 1.2 MT",
//       price: 880000,
//       oldPrice: 1173333,
//       image: "/car-3.jpg",
//       type: "Sedan",
//       seater: 5,
//       mileage: 19.4,
//       fuelTypes: "Petrol",
//       gear: "Manual",
//       seller: "Sourav Jha",
//     },
//     {
//       id: 4,
//       title: "Hyundai Exter SX 1.2 MT",
//       price: 880000,
//       oldPrice: 1173333,
//       image: "/car-4.jpg",
//       type: "SUV",
//       seater: 5,
//       mileage: 19.4,
//       fuelTypes: "Petrol",
//       gear: "Manual",
//       seller: "Sourav Jha",
//     },
//     {
//       id: 5,
//       title: "Hyundai Exter SX 1.2 MT",
//       price: 880000,
//       oldPrice: 1173333,
//       image: "/car-5.jpg",
//       type: "SUV",
//       seater: 5,
//       mileage: 19.4,
//       fuelTypes: "Petrol",
//       gear: "Manual",
//       seller: "Sourav Jha",
//     },
//     {
//       id: 6,
//       title: "Hyundai Exter SX 1.2 MT",
//       price: 880000,
//       oldPrice: 1173333,
//       image: "/car-6.jpg",
//       type: "SUV",
//       seater: 5,
//       mileage: 19.4,
//       fuelTypes: "Petrol",
//       gear: "Manual",
//       seller: "Sourav Jha",
//     },
//   ];

//   const [isSortOpen, setIsSortOpen] = useState(false);
//   const [sortOption, setSortOption] = useState("popularity");
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

//   return (
//     <div className="max-w-6xl mx-auto">
//       {/* Top bar */}
//       <div className="grid grid-cols-3 justify-between items-center mb-6">
//         <div className="w-fit whitespace-nowrap">
//           <h1 className="font-semibold text-2xl">Saved Cars</h1>
//         </div>
//         <div className="w-full flex justify-end gap-2 col-span-2 ">
//           <span className="w-[50%] flex items-center gap-2 bg-gray-100 rounded-sm px-4 py-2">
//             <SearchIcon className="w-4 h-4 text-black" />
//             <input
//               type="text"
//               placeholder="Search for Cars, Brands, Model..."
//               className="w-full focus:outline-none text-xs text-black placeholder:text-black"
//             />
//           </span>

//           {/* short dropdown */}
//           <div className="relative w-full sm:w-auto">
//             <button
//               onClick={() => setIsSortOpen(!isSortOpen)}
//               className="bg-black text-white rounded-sm px-4 py-2 text-sm w-full sm:w-auto flex items-center justify-between border border-gray-300 transition cursor-pointer hover:bg-gray-800"
//             >
//               <span className="font-medium text-xs md:text-md">Sort By :</span>
//               <span className="text-xs ml-1">{currentSortLabel}</span>
//               <ChevronDown
//                 className={`w-4 h-4 ml-2 text-white transform transition-transform duration-200 ${
//                   isSortOpen ? "rotate-180" : ""
//                 }`}
//               />
//             </button>

//             {isSortOpen && (
//               <div className="absolute right-0 mt-[1px] w-54 bg-white text-xs rounded-md shadow-lg z-20 p-1">
//                 {sortOptions.map((opt) => (
//                   <button
//                     key={opt.value}
//                     onClick={() => {
//                       setSortOption(opt.value);
//                       setIsSortOpen(false);
//                     }}
//                     className={`w-full mb-1 text-left px-4 py-2 text-xs text-black rounded-sm hover:bg-gray-200 transition ${
//                       sortOption === opt.value ? "bg-black text-white" : ""
//                     }`}
//                   >
//                     {opt.label}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
//         {listings.map((car) => (
//           <CarCard key={car.id} car={car} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Saved;
