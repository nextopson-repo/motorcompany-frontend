"use client";

import type React from "react";
import { useState } from "react";
import { carsData } from "../../data/cars";
import { ChevronUp, ChevronDown, ListFilter, Search } from "lucide-react";
import { Disclosure } from "@headlessui/react";
import { getTrackBackground, Range } from "react-range";

type SelectedFilters = {
  brand: string[];
  bodyType: string[];
  fuel: string[];
  transmission: string[];
  ownership: string[];
  location: string[];
  priceRange: [number, number];
  yearRange: [number, number];
};

interface FilterSidebarProps {
  filters: {
    brand: string[];
    bodyType: string[];
    fuel: string[];
    transmission: string[];
    ownership: string[];
    location: string[];
    priceRange: [number, number];
    yearRange: [number, number];
  };
  selectedFilters: SelectedFilters;
  onSelectedFiltersChange: (filters: SelectedFilters) => void;
  getCount: (type: string, value: string) => number;
  brandOptions: string[];
  fuelOptions: string[];
  transmissionOptions: string[];
  bodyTypeOptions: string[];
  ownershipOptions: string[];
  stateOptions: string[];
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  selectedFilters,
  onSelectedFiltersChange,
  getCount,
  brandOptions,
  fuelOptions,
  transmissionOptions,
  bodyTypeOptions,
  ownershipOptions,
  stateOptions,
}) => {
  const [brandSearch, setBrandSearch] = useState("");
  const [sectionStates, setSectionStates] = useState({
    priceRange: true,
    yearRange: true,
    brands: true,
    location: true,
    bodyType: true,
    fuel: true,
    transmission: true,
    ownership: true,
  });
  const [carOwnerFilter, setCarOwnerFilter] = useState<
    "all" | "dealer" | "owner"
  >("all");

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
      fuel: newState,
      transmission: newState,
      ownership: newState,
    });
  };

  const allCollapsed = Object.values(sectionStates).every((state) => !state);

  // ✅ Get min and max from dataset to use in sliders (if data exists)
  const minPrice = carsData.length
    ? Math.min(...carsData.map((c) => c.carPrice))
    : 0;
  const maxPrice = carsData.length
    ? Math.max(...carsData.map((c) => c.carPrice))
    : 10000000;

  const minYear = carsData.length
    ? Math.min(...carsData.map((c) => c.manufacturingYear))
    : 2000;
  const maxYear = carsData.length
    ? Math.max(...carsData.map((c) => c.manufacturingYear))
    : new Date().getFullYear();

  // ✅ Get dynamic options
  const brands = brandOptions;
  const states = stateOptions;
  const bodyTypes = bodyTypeOptions;
  const fuelTypes = fuelOptions;
  const transmissions = transmissionOptions;
  const ownerships = ownershipOptions;
  const citiesByState: Record<string, string[]> = {};
  states.forEach((state) => {
    citiesByState[state] = Array.from(
      new Set(carsData.map((c) => c.address.city))
    );
  });

  const renderRange = (
    values: [number, number],
    setValues: (range: [number, number]) => void,
    min: number,
    max: number,
    step: number,
    prefix?: string
  ) => (
    <div className="px-2">
      <div className="flex justify-between text-sm font-medium mb-2">
        <span className="text-[10px] font-semibold xl:text-xs text-red-600">
          {prefix}
          {values[0].toLocaleString()}
        </span>
        <span className="text-[10px] font-semibold xl:text-xs text-red-600">
          {prefix}
          {values[1].toLocaleString()}
        </span>
      </div>

      <Range
        values={values}
        step={step}
        min={min || 0}
        max={max}
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
              className="h-[2px] rounded relative w-full"
              style={{
                background: getTrackBackground({
                  values,
                  colors: ["#D1D5DB", "#EF4444", "#D1D5DB"],
                  min,
                  max,
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
              className="h-[10px] w-[10px] bg-red-600 border border-white rounded-full cursor-pointer "
            />
          );
        }}
      />
    </div>
  );

  const bodyTypeImages: Record<string, string> = {
    suv: "/CarCategories/suv.png",
    hatchback: "/CarCategories/hatchback.png",
    sedan: "/CarCategories/sedan.png",
    coupe: "/CarCategories/coupe1.png",
    convertable: "/CarCategories/convertable.png",
    muv: "/CarCategories/muv.png",
  };

  return (
    <aside className="py-4 w-60 ">
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

      {/* filter button */}
      <div className="text-sm text-center grid grid-cols-3 items-center rounded-sm border border-gray-200 mt-4 overflow-hidden">
        <button
          onClick={() => setCarOwnerFilter("all")}
          className={`py-2 transition-all duration-200 ${
            carOwnerFilter === "all"
              ? "bg-black text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          All Cars
        </button>
        <button
          onClick={() => setCarOwnerFilter("dealer")}
          className={`py-2 border-x border-gray-200 transition-all duration-200 ${
            carOwnerFilter === "dealer"
              ? "bg-black text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Dealer
        </button>
        <button
          onClick={() => setCarOwnerFilter("owner")}
          className={`py-2 transition-all duration-200 ${
            carOwnerFilter === "owner"
              ? "bg-black text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Owner
        </button>
      </div>

      {/* filter fields */}
      <div className="p-3 border border-gray-200 rounded-sm mt-4">
        {/* ✅ Price Range Slider */}
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
                    selectedFilters.priceRange,
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

        {/* ✅ Brands + Models */}
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
              {/* 🔍 Search bar */}
              <div className="flex items-center px-2 py-[6px] rounded bg-[#F2F3F7]">
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

              {/* Filtered brand list */}
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
                      {getCount("brand", brand)}
                    </span>
                  </label>
                ))}

              {/* No results case */}
              {brands.filter((brand) =>
                brand.toLowerCase().includes(brandSearch.toLowerCase())
              ).length === 0 && (
                <p className="text-xs text-gray-400">No matching brands</p>
              )}
            </div>
          )}
        </div>

        {/* ✅ Year Range Slider */}
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
                    selectedFilters.yearRange,
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

        {/* ✅ Location Fields */}
        <div className="border-b border-gray-200 py-3">
          <button
            onClick={() => toggleSection("location")}
            className="flex items-center justify-between w-full mb-2"
          >
            <h3 className="text-sm font-semibold">Location</h3>
            {sectionStates.location ? (
              <ChevronUp size={16} className="text-gray-900" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </button>
          {sectionStates.location && (
            <div className="space-y-3">
              {states.map((state) => (
                <Disclosure key={state}>
                  {({ open }) => (
                    <div>
                      <div className="flex items-center justify-between text-[10px]">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="accent-red-600"
                            checked={selectedFilters.location.includes(state)}
                            onChange={() =>
                              onSelectedFiltersChange({
                                ...selectedFilters,
                                location: selectedFilters.location.includes(
                                  state
                                )
                                  ? selectedFilters.location.filter(
                                      (l) => l !== state
                                    )
                                  : [...selectedFilters.location, state],
                              })
                            }
                          />
                          <span className="font-semibold">{state}</span>
                        </label>
                        <Disclosure.Button>
                          {open ? (
                            <ChevronUp size={16} className="text-gray-900" />
                          ) : (
                            <ChevronDown size={16} className="text-gray-500" />
                          )}
                        </Disclosure.Button>
                      </div>
                      <Disclosure.Panel className="pl-5 pt-2 space-y-2 text-[10px]">
                        {citiesByState[state].map((city) => (
                          <label
                            key={city}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="accent-red-600"
                              checked={selectedFilters.location.includes(
                                `${state}-${city}`
                              )}
                              onChange={() =>
                                onSelectedFiltersChange({
                                  ...selectedFilters,
                                  location: selectedFilters.location.includes(
                                    `${state}-${city}`
                                  )
                                    ? selectedFilters.location.filter(
                                        (l) => l !== `${state}-${city}`
                                      )
                                    : [
                                        ...selectedFilters.location,
                                        `${state}-${city}`,
                                      ],
                                })
                              }
                            />
                            <span className="font-semibold">{city}</span>
                          </label>
                        ))}
                      </Disclosure.Panel>
                    </div>
                  )}
                </Disclosure>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Body Types */}
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
                      {getCount("body", body)}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* ✅ Fuel Types */}
        <div className="border-b border-gray-200 py-3">
          <button
            onClick={() => toggleSection("fuel")}
            className="flex items-center justify-between w-full mb-2"
          >
            <h3 className="text-sm font-semibold">Fuel Type</h3>
            {sectionStates.fuel ? (
              <ChevronUp size={16} className="text-gray-900" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </button>
          {sectionStates.fuel && (
            <div className="space-y-3">
              {fuelTypes.map((fuel) => (
                <label
                  key={fuel}
                  className="flex items-center gap-2 cursor-pointer text-[10px]"
                >
                  <input
                    type="checkbox"
                    className="accent-red-600"
                    checked={selectedFilters.fuel.includes(fuel)}
                    onChange={() =>
                      onSelectedFiltersChange({
                        ...selectedFilters,
                        fuel: selectedFilters.fuel.includes(fuel)
                          ? selectedFilters.fuel.filter((f) => f !== fuel)
                          : [...selectedFilters.fuel, fuel],
                      })
                    }
                  />
                  <span className="font-semibold">{fuel}</span>
                  <span className="ml-auto text-[10px] text-gray-500">
                    {getCount("fuel", fuel)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Transmission */}
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
                    {getCount("transmission", trans)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Ownership */}
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
                    {getCount("ownership", owner)}
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
