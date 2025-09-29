import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import {
  ArrowLeft,
  Search
} from "lucide-react";
import {
  resetFilters,
  toggleBrand,
  toggleFuel,
  setPriceRange,
  setModelYearRange,
  setCity,
  setOwnership,
  setModelKmDriven
} from "../../store/slices/filterSlice";
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
  const { brand, fuelType, priceRange, modelYearRange, city, modelKmDriven } =
    useSelector((s: RootState) => s.filters);

  const [activeFilter, setActiveFilter] = useState("Brand + Models");

  // ---------- handlers ----------
  const handleBrandToggle = (b: string) => dispatch(toggleBrand(b));
  const handleFuelToggle = (f: string) => dispatch(toggleFuel(f));

  return (
    <div className="lg:hidden h-screen fixed inset-0 z-50 bg-white overflow-hidden">
      {/* header */}
      <div className="h-[7vh] items-center p-4 pb-2 border-b border-gray-300">
        <button onClick={onClose} className="flex items-center gap-1 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="grid grid-cols-4 h-[84vh]">
        {/* left nav */}
        <div className="col-span-1 bg-gray-50 flex flex-col text-[10px]">
          {filterOptions.map((item) => (
            <button
              key={item}
              onClick={() => setActiveFilter(item)}
              className={`px-2 py-3 text-left border-t border-x border-gray-300 whitespace-break-spaces last:border-b first-border-t-0
                ${item === activeFilter ? "bg-black text-white" : "hover:bg-gray-100"}`}
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
              <div className="flex justify-between text-xs">
                <span>₹{priceRange[0].toLocaleString()}</span>
                <span>₹{priceRange[1].toLocaleString()}</span>
              </div>
              <Range
                values={priceRange}
                step={50000}
                min={0}
                max={10000000}
                onChange={(vals) => dispatch(setPriceRange([vals[0], vals[1]]))}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="h-[3px] w-full rounded bg-gray-200"
                    style={{
                      background: getTrackBackground({
                        values: priceRange,
                        colors: ["#D1D5DB", "#EF4444", "#D1D5DB"],
                        min: 0,
                        max: 10000000,
                      }),
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="h-4 w-4 bg-red-600 border border-white rounded-full cursor-pointer"
                  />
                )}
              />
            </div>
          )}

          {/* Brand */}
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
                      className="flex items-center justify-between py-2 text-[10px]"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={brand.includes(b.name)}
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
                      className="flex items-center justify-between py-2 text-[10px]"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={brand.includes(b.name)}
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
            <div className="p-4 space-y-3">
              <h2 className="font-semibold text-md mb-2">Model Year</h2>
              <div className="flex justify-between text-xs">
                <span>{modelYearRange[0]}</span>
                <span>{modelYearRange[1]}</span>
              </div>
              <Range
                values={modelYearRange}
                step={1}
                min={2000}
                max={new Date().getFullYear()}
                onChange={(vals) => dispatch(setModelYearRange([vals[0], vals[1]]))}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="h-[3px] w-full rounded bg-gray-200"
                    style={{
                      background: getTrackBackground({
                        values: modelYearRange,
                        colors: ["#D1D5DB", "#EF4444", "#D1D5DB"],
                        min: 2000,
                        max: new Date().getFullYear(),
                      }),
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="h-4 w-4 bg-red-600 border border-white rounded-full cursor-pointer"
                  />
                )}
              />
            </div>
          )}

          {/* Location */}
          {activeFilter === "Location" && (
            <div className="p-4">
              <h2 className="font-semibold text-md mb-2">Select City</h2>
              <div className="grid grid-cols-2 gap-4">
                {cities.map((c) => (
                  <div
                    key={c.name}
                    onClick={() => dispatch(setCity(c.name))}
                    className={`text-center rounded cursor-pointer ${
                      city === c.name ? "bg-black text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    <img src={c.img} alt={c.name} className="w-20 h-18 mx-auto" />
                    <p className="text-[10px] mt-1">{c.name}</p>
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
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="accent-red-500 w-4 h-4" />
                    <span className="h-auto w-14">
                      <img src={type.img} alt={type.name} />
                    </span>
                    <span className="font-semibold text-[10px]">{type.name}</span>
                  </div>
                  <span className="text-[10px]">{type.vehicles}</span>
                </label>
              ))}
            </div>
          )}

          {/* Fuel */}
          {activeFilter === "Fuel Type" && (
            <div className="p-4 space-y-2">
              <h2 className="font-semibold text-md mb-2">Fuel Type</h2>
              {["Petrol", "Diesel", "CNG", "Electric", "Hybrid"].map((fuel) => (
                <label key={fuel} className="flex items-center gap-2 text-[10px] mb-3">
                  <input
                    type="checkbox"
                    checked={fuelType.includes(fuel)}
                    onChange={() => handleFuelToggle(fuel)}
                    className="accent-red-500 w-4 h-4"
                  />
                  {fuel}
                </label>
              ))}
            </div>
          )}

          {/* Kilometer Driven */}
           {activeFilter === "Kilometer Driven" && (
            <div className="p-4">
              <h2 className="font-semibold text-md mb-2">Kilometer Driven</h2>
               <div className="flex justify-between text-xs mb-3">
                <span>{modelKmDriven[0]}kms</span>
                <span>{modelKmDriven[1]}kms</span>
              </div>
              <Range
                values={modelKmDriven}
                step={10000}
                min={0}
                max={999999}
                onChange={(vals) => dispatch(setModelKmDriven([vals[0], vals[1]]))}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="h-[3px] w-full rounded bg-gray-200"
                    style={{
                      background: getTrackBackground({
                        values: modelKmDriven,
                        colors: ["#D1D5DB", "#EF4444", "#D1D5DB"],
                        min: 0,
                        max: 999999,
                      }),
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="h-4 w-4 bg-red-600 border border-white rounded-full cursor-pointer"
                  />
                )}
              />
            </div>
          )}

          {/* No. of Seats */}
          {activeFilter === "No. of Seats" && (
            <div className="p-4 space-y-3">
              <h2 className="font-semibold text-md mb-2">No. of Seats</h2>
              {[2, 4, 5, 6, 7, "8+"].map((seat) => (
                <label key={seat} className="flex items-center gap-2 text-[10px]">
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
              {["Manual", "Automatic", "Hybrid"].map((gear) => (
                <label key={gear} className="flex items-center gap-2 text-[10px]">
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
              {
              [
                "All",
                "Dealer",
                "Owner",
              ]
              .map((own: string) => (
                <label key={own} className="flex items-center gap-2 text-[10px]">
                  <input type="checkbox" className="accent-red-500 w-4 h-4" 
                  onChange={(e) => dispatch(setOwnership(e.target.value as any))}
                  />
                  {own}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* footer */}
      <div className="fixed bottom-0 w-full bg-white p-4 border-t border-gray-200 flex gap-3">
        <button
          onClick={() => dispatch(resetFilters())}
          className="flex-1 border border-gray-300 rounded-md py-2 text-xs"
        >
          Clear Filter
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-black text-white rounded-md py-2 text-xs"
        >
          Show Cars
        </button>
      </div>
    </div>
  );
};

export default AllFilters;