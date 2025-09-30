import React, { useState } from "react";
import CarCard from "../CarCard";
import { Calendar, ChevronDown, MapPinIcon, SearchIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { setSearchTerm, setSortOption } from "../../store/slices/savedSlice";
import { AiFillHeart } from "react-icons/ai";
import { formatShortNumber } from "../../utils/formatPrice";

const Saved: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cars, searchTerm, sortOption } = useSelector(
    (state: RootState) => state.saved
  );


  const filteredCars = cars
    .filter((c) => c.brand.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortOption) {
        case "priceLowToHigh":
          return (a.carPrice ?? 0) - (b.carPrice ?? 0);
        case "priceHighToLow":
          return (b.carPrice ?? 0) - (a.carPrice ?? 0);
        case "yearNewToOld":
          return (b.manufacturingYear ?? 0) - (a.manufacturingYear ?? 0);
        case "yearOldToNew":
          return (a.manufacturingYear ?? 0) - (b.manufacturingYear ?? 0);
        default:
          return 0;
      }
    });

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

  return (
    <div className="mx-auto">
      {/* Top bar */}
      <div className="grid grid-cols-3 justify-between items-center mb-4 md:mb-6 px-4 md:px-0">
        <div className="w-fit whitespace-nowrap col-span-3 lg:col-span-1">
          <h1 className="font-semibold text-md md:text-2xl py-2 lg:py-0">
            Saved Cars
          </h1>
        </div>
        <div className="w-full flex items-center lg:justify-end gap-2 col-span-3 lg:col-span-2">
          <span className="w-full lg:w-[50%] flex items-center gap-2 bg-gray-100 rounded-sm px-4 py-[5px] md:py-2">
            <SearchIcon className="w-3 md:w-4 h-3 md:h-4 text-black" />
            <input
              type="text"
              placeholder="Search for Cars, Brands, Model..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="w-full focus:outline-none text-[9px] md:text-xs text-black placeholder:text-black"
            />
          </span>

          {/* Sort dropdown */}
          <div className="hidden lg:block relative w-full sm:w-auto">
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

          {/* Mobile sort button */}
          <div className="block lg:hidden h-full">
            <button className="flex items-center gap-1 text-[10px] font-semibold rounded-xs bg-black text-white py-1 px-2 ">
              <Calendar className="h-3 w-3" /> Today
            </button>
          </div>
        </div>
      </div>

      {/*Desktop Cars Grid */}
      <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      {/* mobile Cars Grid */}
      <div className="block lg:hidden space-y-2 sm:space-y-4 px-4 sm:mb-10 lg:mb-0">
        {filteredCars.map((car) => (
          <div
            key={car.id}
            className="flex flex-row rounded-sm border border-gray-100 p-1"
          >
            {/* Left Image */}
            <div className="h-fit w-28 sm:w-36 flex-shrink-0 relative">
              <img
                src={"/fallback-car-img.png"}
                alt="car image"
                className="w-full h-22 sm:h-26 object-cover rounded-xs"
              />
            </div>

            <div className="w-full flex flex-col justify-between">
              <div className="flex">
                {/* Middle Content */}
                <div className="flex-1 px-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-xs text-gray-900">
                      {car.brand} {car.model} {car.transmission}{" "}
                      {car.manufacturingYear}
                    </h3>
                    <p className="text-[9px] mt-1 leading-tight text-gray-900">
                      {formatShortNumber(car.kms)} kms | {car.bodyType}{" "}
                      {car.seats} seater | {car.fuelType} | {car.transmission}
                    </p>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="flex flex-col items-end justify-between p-1">
                  <span className="p-[3px] bg-gray-100 rounded-xs active:scale-95 active:bg-white transition-all duration-300">
                    <AiFillHeart className="w-3 h-3 text-green-600" />
                  </span>
                </div>
              </div>

              {/* Mobile bottom */}
              <div className="flex items-center justify-between pl-2 pr-1">
                <div className="text-[8px] flex items-center text-gray-900">
                  <MapPinIcon className="w-[10px] h-[10px] mr-1 text-gray-900" />
                  {car.address?.city}
                </div>
                <div>
                  <p className="font-bold text-xs flex items-center gap-2 text-gray-900">
                    Rs. {formatShortNumber(car.carPrice)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredCars.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            No saved cars found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Saved;
