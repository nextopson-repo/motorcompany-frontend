import type React from "react";
import { useState } from "react";
import { ChevronUp, ChevronDown, ListFilter, Search } from "lucide-react";
import { type SelectedFilters } from "../../store/slices/carSlice";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { renderRange } from "../RenderRangeselector";
// import { renderRange } from "../renderRange";

interface FilterSidebarProps {
  selectedFilters: SelectedFilters;
  onSelectedFiltersChange: (filters: SelectedFilters) => void;
  citiesByState?: Record<string, string[]>;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedFilters,
  onSelectedFiltersChange,
}) => {
  const {filters, allCars}= useSelector((state: RootState) => state.cars);
  const [brandSearch, setBrandSearch] = useState("");
  const [sectionStates, setSectionStates] = useState({
    priceRange: false,
    yearRange: false,
    brands: false,
    location: false,
    bodyType: false,
    fuelType: false,
    transmission: false,
    ownership: false,
  });

  const toggleSection = (section: keyof typeof sectionStates) => {
    setSectionStates((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleAllSections = () => {
    const allCollapsed = Object.values(sectionStates).every((state) => !state);
    const newState = allCollapsed;

    setSectionStates({
      priceRange: newState,
      yearRange: newState,
      brands: newState,
      location: newState,
      bodyType: newState,
      fuelType: newState,
      transmission: newState,
      ownership: newState,
    });
  };

  const allCollapsed = Object.values(sectionStates).every((state) => !state);

  const safeRange = (
    values: [number, number] | null,
    min: number,
    max: number
  ) => {
    if (!values) return [min, max] as [number, number];
    return [Math.max(values[0], min), Math.min(values[1], max)] as [
      number,
      number
    ];
  };

  const minPrice = filters.priceRange?.[0] ?? 0;
  const maxPrice = filters.priceRange?.[1] ?? 10000000;
  const minYear = filters.yearRange?.[0] ?? 2000;
  const maxYear = filters.yearRange?.[1] ?? new Date().getFullYear();
  const brands = filters.brand;
  const bodyTypes = filters.bodyType;
  const fuelTypes = filters.fuel;
  const transmissions = filters.transmission;
  const ownerships = filters.ownership;

 
  const bodyTypeImages: Record<string, string> = {
    suv: "/CarCategories/suv.png",
    hatchback: "/CarCategories/hatchback.png",
    sedan: "/CarCategories/sedan.png",
    coupe: "/CarCategories/coupe1.png",
    convertible: "/CarCategories/convertable.png",
    muv: "/CarCategories/muv.png",
  };

  const getTotalCount = (type: string, value: string) =>
      (Array.isArray(allCars) ? allCars : []).filter((car) => {
        switch (type) {
          case "brand":
            return car.brand === value;
          case "fuel":
            return car.fuelType === value;
          case "transmission":
            return car.transmission === value;
          case "body":
            return car.bodyType === value;
          case "ownership":
            return car.ownership === value;
          case "location":
            return car.address?.city === value;
          default:
            return false;
        }
      }).length;

  return (
    <aside className="py-4 w-48 lg:w-60 ">
      <button
        onClick={toggleAllSections}
        className="flex items-center justify-between w-full p-2 px-4 border border-gray-200 rounded font-semibold hover:bg-gray-100"
      >
        <div className="flex items-center gap-2 text-[11px]">
          <ListFilter size={12} />
          {allCollapsed ? "Expand All Filters" : "Collapse All Filters"}
        </div>
        {allCollapsed ? (
          <ChevronDown size={14} className="text-gray-500" />
        ) : (
          <ChevronUp size={14} className="text-gray-500" />
        )}
      </button>

      {/* user type filter */}
      <div className="text-sm text-center grid grid-cols-3 items-center rounded-sm border border-gray-200 mt-4 overflow-hidden">
        {["EndUser", "Dealer", "Owner"].map((type) => {
          const label =
            type === "EndUser"
              ? "All Cars"
              : type.charAt(0).toUpperCase() + type.slice(1);
          const isActive = selectedFilters.userType === type;
          return (
            <button
              key={type}
              onClick={() =>
                onSelectedFiltersChange({
                  ...selectedFilters,
                  userType: type as "EndUser" | "Dealer" | "Owner",
                })
              }
              className={`py-2 transition-all duration-200 ${
                type === "dealer" || type === "owner"
                  ? "border-x border-gray-200"
                  : ""
              } ${
                isActive
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="p-3 border border-gray-200 rounded-sm mt-4">
        {/* Price Range */}
        {filters.priceRange?.[0] != null &&
          filters.priceRange?.[1] != null &&
          filters.priceRange[0] < filters.priceRange[1] && (
            <div className="border-b border-gray-200 pb-3 pt-1">
              <button
                onClick={() => toggleSection("priceRange")}
                className="flex items-center justify-between w-full mb-2"
              >
                <h3 className="text-sm font-semibold">Price Range</h3>
                {sectionStates.priceRange ? (
                  <ChevronUp size={16} className="text-gray-900" />
                ) : (
                  <ChevronDown size={16} className="text-gray-500" />
                )}
              </button>
              {sectionStates.priceRange && (
                <div>
                  {renderRange(
                    safeRange(selectedFilters.priceRange, minPrice, maxPrice),
                    (vals) =>
                      onSelectedFiltersChange({
                        ...selectedFilters,
                        priceRange: vals,
                      }),
                    minPrice,
                    maxPrice,
                    10000,
                    "₹ "
                  )}
                </div>
              )}
            </div>
          )}

        {/* Brands + Models */}
        <div className="border-b border-gray-200 py-3">
          <button
            onClick={() => toggleSection("brands")}
            className="flex items-center justify-between w-full mb-2"
          >
            <h3 className="text-sm font-semibold">Brands + Models</h3>
            {sectionStates.brands ? (
              <ChevronUp size={16} className="text-gray-900" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </button>

          {sectionStates.brands && (
            <div className="space-y-3">
              <div className="flex items-center px-2 py-1.5 rounded bg-[#F2F3F7]">
                <span>
                  <Search className="w-3 h-3 text-gray-800 mr-2" />
                </span>
                <input
                  type="text"
                  placeholder="Search cars by brands..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full rounded text-[10px] bg-[#F2F3F7] placeholder:text-black outline-none"
                />
              </div>

              <span className="text-[7px]">Top Brands</span>
              {brands
                .filter((brand) =>
                  brand.toLowerCase().includes(brandSearch.toLowerCase())
                )
                .map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-2 cursor-pointer text-[10px]"
                  >
                    <input
                      type="checkbox"
                      className="accent-red-600 "
                      checked={selectedFilters.brand.includes(brand)}
                      onChange={() =>
                        onSelectedFiltersChange({
                          ...selectedFilters,
                          brand: selectedFilters.brand.includes(brand)
                            ? selectedFilters.brand.filter((b) => b !== brand)
                            : [...selectedFilters.brand, brand],
                        })
                      }
                    />
                    <span className="font-semibold">{brand}</span>
                    <span className="ml-auto text-[10px] text-gray-500">
                       {getTotalCount("brand", brand)}
                    </span>
                  </label>
                ))}

              {brands.filter((brand) =>
                brand.toLowerCase().includes(brandSearch.toLowerCase())
              ).length === 0 && (
                <p className="text-xs text-gray-400">No matching brands</p>
              )}
            </div>
          )}
        </div>

        {/* Year Range */}
        {filters.yearRange?.[0] != null &&
          filters.yearRange?.[1] != null &&
          filters.yearRange[0] < filters.yearRange[1] && (
            <div className="border-b border-gray-200 py-3">
              <button
                onClick={() => toggleSection("yearRange")}
                className="flex items-center justify-between w-full mb-2"
              >
                <h3 className="text-sm font-semibold">Model Year</h3>
                {sectionStates.yearRange ? (
                  <ChevronUp size={16} className="text-gray-900" />
                ) : (
                  <ChevronDown size={16} className="text-gray-500" />
                )}
              </button>
              {sectionStates.yearRange && (
                <div>
                  {renderRange(
                    safeRange(selectedFilters.yearRange, minYear, maxYear),
                    (vals) =>
                      onSelectedFiltersChange({
                        ...selectedFilters,
                        yearRange: vals,
                      }),
                    minYear,
                    maxYear,
                    1
                  )}
                </div>
              )}
            </div>
          )}

        {/* BodyTypes */}
        <div className="border-b border-gray-200 py-3">
          <button
            onClick={() => toggleSection("bodyType")}
            className="flex items-center justify-between w-full mb-2"
          >
            <h3 className="text-sm font-semibold">Body Type</h3>
            {sectionStates.bodyType ? (
              <ChevronUp size={16} className="text-gray-900" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </button>
          {sectionStates.bodyType && (
            <div className="space-y-3">
              {bodyTypes.map((body) => {
                const imageSrc =
                  bodyTypeImages[body.toLowerCase()] ||
                  "/CarCategories/hatchback.png";
                return (
                  <label
                    key={body}
                    className="flex items-center gap-2 cursor-pointer text-[10px]"
                  >
                    <input
                      type="checkbox"
                      className="accent-red-600"
                      checked={selectedFilters.bodyType.includes(body)}
                      onChange={() =>
                        onSelectedFiltersChange({
                          ...selectedFilters,
                          bodyType: selectedFilters.bodyType.includes(body)
                            ? selectedFilters.bodyType.filter((b) => b !== body)
                            : [...selectedFilters.bodyType, body],
                        })
                      }
                    />
                    <img
                      src={imageSrc}
                      alt={`${body} icon`}
                      className="w-10 h-6 object-contain"
                    />
                    <span className="font-semibold">{body}</span>
                    <span className="ml-auto text-[10px] text-gray-500">
                      {getTotalCount("body", body)}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* FuelTypes */}
        <div className="border-b border-gray-200 py-3">
          <button
            onClick={() => toggleSection("fuelType")}
            className="flex items-center justify-between w-full mb-2"
          >
            <h3 className="text-sm font-semibold">Fuel Type</h3>
            {sectionStates.fuelType ? (
              <ChevronUp size={16} className="text-gray-900" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </button>
          {sectionStates.fuelType && (
            <div className="space-y-3">
              {fuelTypes.map((fuel) => (
                <label
                  key={fuel}
                  className="flex items-center gap-2 cursor-pointer text-[10px]"
                >
                  <input
                    type="checkbox"
                    className="accent-red-600"
                    checked={selectedFilters.fuelType.includes(fuel)}
                    onChange={() =>
                      onSelectedFiltersChange({
                        ...selectedFilters,
                        fuelType: selectedFilters.fuelType.includes(fuel)
                          ? selectedFilters.fuelType.filter((f) => f !== fuel)
                          : [...selectedFilters.fuelType, fuel],
                      })
                    }
                  />
                  <span className="font-semibold">{fuel}</span>
                  <span className="ml-auto text-[10px] text-gray-500">
                    {getTotalCount("fuel", fuel)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Transmission */}
        <div className="border-b border-gray-200 py-3">
          <button
            onClick={() => toggleSection("transmission")}
            className="flex items-center justify-between w-full mb-2"
          >
            <h3 className="text-sm font-semibold">Transmission</h3>
            {sectionStates.transmission ? (
              <ChevronUp size={16} className="text-gray-900" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </button>
          {sectionStates.transmission && (
            <div className="space-y-3">
              {transmissions.map((trans) => (
                <label
                  key={trans}
                  className="flex items-center gap-2 cursor-pointer text-[10px]"
                >
                  <input
                    type="checkbox"
                    className="accent-red-600"
                    checked={selectedFilters.transmission.includes(trans)}
                    onChange={() =>
                      onSelectedFiltersChange({
                        ...selectedFilters,
                        transmission: selectedFilters.transmission.includes(
                          trans
                        )
                          ? selectedFilters.transmission.filter(
                              (t) => t !== trans
                            )
                          : [...selectedFilters.transmission, trans],
                      })
                    }
                  />
                  <span className="font-semibold">{trans}</span>
                  <span className="ml-auto text-[10px] text-gray-500">
                    {getTotalCount("transmission", trans)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Ownership */}
        <div className="py-3">
          <button
            onClick={() => toggleSection("ownership")}
            className="flex items-center justify-between w-full mb-2"
          >
            <h3 className="text-sm font-semibold">Ownership</h3>
            {sectionStates.ownership ? (
              <ChevronUp size={16} className="text-gray-900" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </button>
          {sectionStates.ownership && (
            <div className="space-y-3">
              {ownerships.map((owner) => (
                <label
                  key={owner}
                  className="flex items-center gap-2 cursor-pointer text-[10px]"
                >
                  <input
                    type="checkbox"
                    className="accent-red-600"
                    checked={selectedFilters.ownership.includes(owner)}
                    onChange={() =>
                      onSelectedFiltersChange({
                        ...selectedFilters,
                        ownership: selectedFilters.ownership.includes(owner)
                          ? selectedFilters.ownership.filter((o) => o !== owner)
                          : [...selectedFilters.ownership, owner],
                      })
                    }
                  />
                  <span className="font-semibold">{owner}</span>
                  <span className="ml-auto text-[10px] text-gray-500">
                    {getTotalCount("ownership", owner)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};