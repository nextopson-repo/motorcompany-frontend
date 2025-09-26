import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { ArrowLeft, Search } from "lucide-react";
import { resetFilters, toggleBrand } from "../../store/slices/filterSlice";
import { getTrackBackground, Range } from "react-range";

interface AllFiltersProps {
  onClose: () => void;
}

const topBrands = [
  { name: "Maruti Suzuki", count: 2300 },
  { name: "Hyundai", count: 1500 },
  { name: "Honda", count: 1000 },
  { name: "Tata", count: 500 },
  { name: "Renault", count: 250 },
  { name: "Kia", count: 120 },
];

const popularBrands = [
  { name: "Maruti Suzuki", count: 2300 },
  { name: "Hyundai", count: 2300 },
  { name: "Honda", count: 2300 },
  { name: "Tata", count: 2300 },
];

const bodyTypes = [
  {
    id: 1,
    name: "Hatchback",
    vehicles: 26,
    img: "/CarCategories/hatchback.png",
  },
  { id: 2, name: "SUV", vehicles: 26, img: "/CarCategories/suv.png" },
  { id: 3, name: "Sedan Car", vehicles: 26, img: "/CarCategories/sedan.png" },
  { id: 4, name: "MUV", vehicles: 125, img: "/CarCategories/muv.png" },
  {
    id: 5,
    name: "Convertible",
    vehicles: 132,
    img: "/CarCategories/convertable.png",
  },
  { id: 6, name: "Coupe", vehicles: 26, img: "/CarCategories/coupe1.png" },
];

const cities = [
  { name: "Chandigarh", img: "/Cities/chandigarh-img.png" },
  { name: "Ahmedabad", img: "/Cities/ahmedabad-img.png" },
  { name: "Pune", img: "/Cities/pune-img.png" },
  { name: "Hyderabad", img: "/Cities/hyderabad-img.png" },
  { name: "Kanpur", img: "/Cities/kanpur-img.png" },
  { name: "Indore", img: "/Cities/indore-img.png" },
  { name: "Lucknow", img: "/Cities/lucknow-img.png" },
  { name: "Delhi", img: "/Cities/dehli-img.png" },
  { name: "Bhopal", img: "/Cities/bhopal-img.png" },
  { name: "Jaipur", img: "/Cities/jaipur-img.png" },
];

const filterOptions = [
  "Price Range",
  "Brand + Models",
  "Model Year",
  "Location",
  "Body Type",
  "Fuel Type",
  "Kilometer Driven",
  "No. of Seats",
  "Transmission",
  "Ownership",
];

const AllFilters: React.FC<AllFiltersProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const selectedYearRange = useSelector(
    (state: RootState) => state.filters.modelYearRange
  );
  const currentYear = new Date().getFullYear();
  const minYear = 2000
  const selectedBrands = useSelector((s: RootState) => s.filters.brand);
  const [selectedCity, setSelectedCity] = useState("");
  const [values, setValues] = useState<[number, number]>(selectedYearRange);
  const [activeFilter, setActiveFilter] = useState("Brand + Models");

  const handleBrandToggle = (brand: string) => {
    dispatch(toggleBrand(brand));
  };

  return (
    <div className="lg:hidden h-screen fixed inset-0 z-50 bg-white overflow-hidden">
      {/* header */}
      <div className="h-[7vh] items-center p-4 pb-2 border-b border-gray-300">
        <button onClick={onClose} className="flex items-center gap-1 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* main content */}
      <div className="grid grid-cols-4 h-[84vh]">
        {/* left sidebar */}
        <div className="col-span-1 bg-gray-50 flex flex-col text-xs whitespace-normal">
          {filterOptions.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveFilter(item)}
              className={`px-3 py-3 text-left border-t border-x border-gray-300 last:border-b 
                ${
                  item === activeFilter
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* right panel */}
        <div className="col-span-3 overflow-y-auto overflow-x-hidden">
          {/* Price Range */}
          {activeFilter === "Price Range" && (
            <div className="p-4 space-y-3">
              <h2 className="font-semibold text-md mb-2">Price Range</h2>
              <div className="flex flex-col space-y-4">
                {/* Display selected years */}
                <div className="flex justify-between text-xs">
                  <span>{values[0]}</span>
                  <span>{values[1]}</span>
                </div>

                {/* Range Slider */}
                <Range
                  values={values}
                  step={1}
                  min={minYear}
                  max={currentYear}
                  onChange={(vals) => setValues([vals[0], vals[1]])}
                  renderTrack={({ props, children }) => {
                    const { key, ...rest } =
                      (props as {
                        key?: React.Key;
                      } & React.HTMLAttributes<HTMLDivElement>) || {};

                    return (
                      <div
                        key={key}
                        {...rest}
                        className="h-[3px] w-full rounded relative"
                        style={{
                          background: getTrackBackground({
                            values,
                            colors: ["#D1D5DB", "#EF4444", "#D1D5DB"], 
                            min: minYear,
                            max: currentYear,
                          }),
                        }}
                      >
                        {children}
                      </div>
                    );
                  }}
                  renderThumb={({ props }) => {
                    const { key, ...rest } =
                      (props as {
                        key?: React.Key;
                      } & React.HTMLAttributes<HTMLDivElement>) || {};
                    return (
                      <div
                        key={key}
                        {...rest}
                        className="h-4 w-4 bg-red-600 border border-white rounded-full cursor-pointer"
                      />
                    );
                  }}
                />
              </div>
            </div>
          )}

          {/* Brand + Models */}
          {activeFilter === "Brand + Models" && (
            <div>
              <h2 className="px-4 pt-4 pb-2 font-semibold text-md">
                Brand + Models
              </h2>
              <div className="mx-4 mb-4 px-2 rounded-sm bg-gray-200 flex items-center gap-2">
                <Search className="h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search Brands or Model"
                  className="w-full py-2 text-xs outline-none placeholder:text-black"
                />
              </div>

              <div className="flex-1 overflow-y-auto px-4 space-y-3">
                {/* Top Brands */}
                <div>
                  <p className="font-medium text-[10px]">Top Brands</p>
                  {topBrands.map((b) => (
                    <label
                      key={b.name}
                      className="flex items-center justify-between py-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(b.name)}
                          onChange={() => handleBrandToggle(b.name)}
                          className="accent-red-500 w-4 h-4"
                        />
                        {b.name}
                      </div>
                      <span className="text-gray-500 text-[10px]">
                        {b.count}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Popular */}
                <div>
                  <p className="font-medium text-[10px]">Popular</p>
                  {popularBrands.map((b) => (
                    <label
                      key={b.name}
                      className="flex items-center justify-between py-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(b.name)}
                          onChange={() => handleBrandToggle(b.name)}
                          className="accent-red-500 w-4 h-4"
                        />
                        {b.name}
                      </div>
                      <span className="text-gray-500 text-[10px]">
                        {b.count}
                      </span>
                    </label>
                  ))}

                  <button className="text-blue-500 text-[10px] mt-2">
                    Show More Brands
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Model Year */}
          {activeFilter === "Model Year" && (
            <div className="p-4">
              <h2 className="font-semibold text-md mb-2">Model Year</h2>
              <select className="w-full border p-2 text-sm rounded">
                <option>2025 & Newer</option>
                <option>2020 - 2024</option>
                <option>2015 - 2019</option>
                <option>2010 - 2014</option>
                <option>Older</option>
              </select>
            </div>
          )}

          {/* Location */}
          {activeFilter === "Location" && (
            <div className="p-4">
              <div className="">
                <h2 className="font-semibold text-md mb-2">Location</h2>
                <input
                  type="text"
                  placeholder="Enter city or state"
                  className="w-full border p-2 rounded text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-x-[1vw] gap-y-4 mx-auto mt-4 h-full overflow-y-auto">
                {cities.map((city) => (
                  <div
                    key={city.name}
                    onClick={() => setSelectedCity(city.name)}
                    className={`flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform p-1 rounded ${
                      selectedCity === city.name ? "shadow-md scale-[1.05]" : ""
                    }`}
                  >
                    <div className="w-28 h-24 mb-2">
                      <img
                        src={city.img}
                        alt={city.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="font-semibold text-[10px]">{city.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Body Type */}
          {activeFilter === "Body Type" && (
            <div className="p-4 space-y-4">
              <h2 className="font-semibold text-md mb-2">Body Type</h2>
              {bodyTypes.map((type, id) => (
                <label
                  key={id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-4">
                    <input type="checkbox" className="accent-red-500 w-4 h-4" />
                    <span className="h-auto w-20">
                      <img src={type.img} alt={type.name} />
                    </span>
                    <span className="font-semibold">{type.name}</span>
                  </div>
                  <span>{type.vehicles}</span>
                </label>
              ))}
            </div>
          )}

          {/* Fuel Type */}
          {activeFilter === "Fuel Type" && (
            <div className="p-4 space-y-4">
              <h2 className="font-semibold text-md mb-2">Fuel Type</h2>
              {["Petrol", "Diesel", "CNG", "Electric", "Hybrid"].map((fuel) => (
                <label
                  key={fuel}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="accent-red-500 w-4 h-4" />
                    <span className="font-semibold">{fuel}</span>
                  </div>
                  <span>{"20"}</span>
                </label>
              ))}
            </div>
          )}

          {/* Kilometer Driven */}
          {activeFilter === "Kilometer Driven" && (
            <div className="p-4">
              <h2 className="font-semibold text-md mb-2">Kilometer Driven</h2>
              <input type="range" min={0} max={200000} step={5000} />
              <div className="flex justify-between text-xs text-gray-600">
                <span>0 km</span>
                <span>200,000 km</span>
              </div>
            </div>
          )}

          {/* No. of Seats */}
          {activeFilter === "No. of Seats" && (
            <div className="p-4 space-y-3">
              <h2 className="font-semibold text-md mb-2">No. of Seats</h2>
              {[2, 4, 5, 6, 7, "8+"].map((seat) => (
                <label key={seat} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="accent-red-500 w-4 h-4" />
                  {seat} Seater
                </label>
              ))}
            </div>
          )}

          {/* Transmission */}
          {activeFilter === "Transmission" && (
            <div className="p-4 space-y-3">
              <h2 className="font-semibold text-md mb-2">Transmission</h2>
              {["Manual", "Automatic"].map((gear) => (
                <label key={gear} className="flex items-center gap-2 text-sm">
                  <input type="radio" name="transmission" />
                  {gear}
                </label>
              ))}
            </div>
          )}

          {/* Ownership */}
          {activeFilter === "Ownership" && (
            <div className="p-4 space-y-3">
              <h2 className="font-semibold text-md mb-2">Ownership</h2>
              {[
                "First Owner",
                "Second Owner",
                "Third Owner",
                "Fourth & Above",
              ].map((own) => (
                <label key={own} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="accent-red-500 w-4 h-4" />
                  {own}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* footer */}
      <div className="fixed bottom-0 h-[9vh] w-full bg-white p-4 border-t border-gray-300 flex gap-3 z-10">
        <button
          onClick={() => dispatch(resetFilters())}
          className="flex-1 border border-gray-300 rounded-md py-2 text-sm active:scale-95 active:bg-gray-400"
        >
          Clear Filter
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-black/90 text-white rounded-md py-2 text-sm active:scale-95 active:bg-black"
        >
          Show Cars
        </button>
      </div>
    </div>
  );
};

export default AllFilters;
