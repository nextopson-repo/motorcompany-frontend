import React, { useState } from "react";
import { carsData } from "../data/cars";
import {
  ChevronUp,
  ChevronDown,
  Car,
  CarFront,
  Truck,
  Bus,
  ListFilter,
} from "lucide-react";
import { Disclosure } from "@headlessui/react";
import { Range } from "react-range";

interface FilterSidebarProps {
  filters: {
    brand: string[];
    body: string[];
    fuel: string[];
    transmission: string[];
    ownership: string[];
  };
  onFilterChange: (type: string, value: string) => void;
  getCount: (type: string, value: string) => number;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  priceRange?: [number, number];
  setPriceRange?: (range: [number, number]) => void;
  yearRange?: [number, number];
  setYearRange?: (range: [number, number]) => void;
  brandOptions?: string[];
  modelOptions?: string[];
  stateOptions?: string[];
  cityOptions?: string[];
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  getCount,
  selectedLocation,
  onLocationChange,
  priceRange,
  setPriceRange,
  yearRange,
  setYearRange,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  // Dynamic values
  const minPrice = Math.min(...carsData.map((c) => c.price));
  const maxPrice = Math.max(...carsData.map((c) => c.price));
  const minYear = Math.min(...carsData.map((c) => c.year));
  const maxYear = Math.max(...carsData.map((c) => c.year));

  const brands = Array.from(new Set(carsData.map((c) => c.brand)));
  const brandModels: Record<string, string[]> = {};
  brands.forEach((b) => {
    brandModels[b] = Array.from(
      new Set(carsData.filter((c) => c.brand === b).map((c) => c.model))
    );
  });

  const states = Array.from(new Set(carsData.map((c) => c.location.state)));
  const citiesByState: Record<string, string[]> = {};
  states.forEach((s) => {
    citiesByState[s] = Array.from(
      new Set(
        carsData
          .filter((c) => c.location.state === s)
          .map((c) => c.location.city)
      )
    );
  });

  const bodyTypes = Array.from(new Set(carsData.map((c) => c.bodyType)));
  const fuelTypes = Array.from(new Set(carsData.map((c) => c.fuelTypes)));
  const transmissions = Array.from(
    new Set(carsData.map((c) => c.transmission))
  );
  const ownerships = Array.from(new Set(carsData.map((c) => c.ownership)));

  const renderRange = (
    values: [number, number],
    setValues: (v: [number, number]) => void,
    min: number,
    max: number,
    step: number,
    prefix?: string
  ) => (
    <div className="px-2">
      <div className="flex justify-between text-sm font-medium mb-1">
        <span>
          {prefix}
          {values[0].toLocaleString()}
        </span>
        <span>
          {prefix}
          {values[1].toLocaleString()}
        </span>
      </div>
      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={(vals) => setValues([vals[0], vals[1]])}
        renderTrack={({ props, children }) => {
          const { key, style, ...trackProps } =
            (props as {
              key?: React.Key;
              style?: React.CSSProperties;
            } & React.HTMLAttributes<HTMLDivElement>) || {};
          return (
            <div
              key={key}
              {...trackProps}
              className="h-[4px] bg-gray-300 rounded relative"
              style={{ ...(style || {}) }}
            >
              {children}
            </div>
          );
        }}
        renderThumb={({ props }) => {
          const { key, ...thumbProps } =
            (props as {
              key?: React.Key;
            } & React.HTMLAttributes<HTMLDivElement>) || {};
          return (
            <div
              key={key}
              {...thumbProps}
              className="h-4 w-4 bg-red-600 rounded-full cursor-pointer"
            />
          );
        }}
      />
    </div>
  );

  return (
    <aside className="py-4 lg:pl-8 w-72">
      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-between w-full p-2 border border-gray-200 rounded font-semibold hover:bg-gray-100"
      >
        <div className="flex items-center gap-2 text-xs">
          <ListFilter size={12} />
          {collapsed ? "Expand All Filters" : "Collapse All Filters"}
        </div>
        {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </button>

      {/* filter button */}
      <div className="text-sm text-center grid grid-cols-3 items-center rounded-sm border border-gray-200 mt-4">
        <button className="py-2 rounded-l-sm hover:text-white hover:bg-black">
          All Cars
        </button>
        <button className="py-2  hover:text-white hover:bg-black border-x border-gray-200">
          Dealer
        </button>
        <button className="py-2 rounded-r-sm hover:text-white hover:bg-black">
          Owner
        </button>
      </div>

      {!collapsed && (
        <div className="mt-4 space-y-4 border border-gray-200 rounded-sm py-4 px-2">
          {/* Price Range */}
          {priceRange && setPriceRange && (
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-sm font-semibold mb-2">Price Range</h3>
              {renderRange(
                [
                  Math.max(priceRange[0], minPrice),
                  Math.min(priceRange[1], maxPrice),
                ],
                (vals) => {
                  const next: [number, number] = [
                    Math.max(vals[0], minPrice),
                    Math.min(vals[1], maxPrice),
                  ];
                  setPriceRange(next);
                },
                minPrice,
                maxPrice,
                10000,
                "₹ "
              )}
            </div>
          )}

          {/* Brand + Models */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-sm font-semibold mb-2">Brand + Models</h3>
            <input
              type="text"
              placeholder="Search for Cars, Brands, Models..."
              className="w-full bg-gray-100 rounded px-3 py-1 text-xs mb-2"
            />
            <div
              className="space-y-1 max-h-[160px] overflow-y-auto 
              [&::-webkit-scrollbar]:w-[2px]
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:bg-gray-300
           "
            >
              <span className="text-[8px]">Top Brands</span>
              {brands.map((brand) => (
                <Disclosure key={brand}>
                  {({ open }) => (
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="accent-red-600"
                            checked={filters.brand.includes(brand)}
                            onChange={() => onFilterChange("brand", brand)}
                          />
                          <span className="text-xs">{brand}</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">
                            {getCount("brand", brand)}
                          </span>
                          <Disclosure.Button>
                            {open ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </Disclosure.Button>
                        </div>
                      </div>
                      <Disclosure.Panel className="pl-6 space-y-1 text-xs">
                        {brandModels[brand].map((model) => (
                          <label
                            key={model}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="accent-red-600"
                              checked={filters.brand.includes(
                                `${brand}-${model}`
                              )}
                              onChange={() =>
                                onFilterChange("brand", `${brand}-${model}`)
                              }
                            />
                            <span>{model}</span>
                          </label>
                        ))}
                      </Disclosure.Panel>
                    </div>
                  )}
                </Disclosure>
              ))}
            </div>
          </div>

          {/* Model Year */}
          {yearRange && setYearRange && (
            <div className="border-b border-gray-200 pb-4">
              <h3 className=" text-sm font-semibold mb-2">Model Year</h3>
              {renderRange(
                [
                  Math.max(yearRange[0], minYear),
                  Math.min(yearRange[1], maxYear),
                ],
                (vals) => {
                  const next: [number, number] = [
                    Math.max(vals[0], minYear),
                    Math.min(vals[1], maxYear),
                  ];
                  setYearRange(next);
                },
                minYear,
                maxYear,
                1
              )}
            </div>
          )}

          {/* Location */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-sm font-semibold mb-2">Location</h3>
            <div className="max-h-[150px] overflow-y-auto 
              [&::-webkit-scrollbar]:w-[2px]
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:bg-gray-300">
              {states.map((state) => (
                <Disclosure key={state}>
                  {({ open }) => (
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="accent-red-600"
                            checked={selectedLocation === state}
                            onChange={() => onLocationChange(state)}
                          />
                          <span>{state}</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {getCount("location", state)}
                          </span>
                          <Disclosure.Button>
                            {open ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </Disclosure.Button>
                        </div>
                      </div>
                      <Disclosure.Panel className="pl-6 space-y-1 text-xs">
                        {citiesByState[state].map((city) => (
                          <label
                            key={city}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="accent-red-600"
                              checked={selectedLocation === `${state}-${city}`}
                              onChange={() =>
                                onLocationChange(`${state}-${city}`)
                              }
                            />
                            <span>{city}</span>
                          </label>
                        ))}
                      </Disclosure.Panel>
                    </div>
                  )}
                </Disclosure>
              ))}
            </div>
          </div>

          {/* Body Type */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-sm font-semibold mb-2">Body Type</h3>
            {bodyTypes.map((body) => {
              const icon =
                body.toLowerCase() === "suv"
                  ? CarFront
                  : body.toLowerCase() === "hatchback"
                  ? Car
                  : body.toLowerCase() === "sedan"
                  ? Truck
                  : Bus;
              const IconComp = icon;
              return (
                <label
                  key={body}
                  className="flex items-center gap-2 cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    className="accent-red-600"
                    checked={filters.body.includes(body)}
                    onChange={() => onFilterChange("body", body)}
                  />
                  <IconComp className="text-red-600" size={18} />
                  <span>{body}</span>
                  <span className="ml-auto text-sm text-gray-500">
                    {getCount("body", body)}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Fuel Type */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-sm font-semibold mb-2">Fuel Type</h3>
            {fuelTypes.map((fuel) => (
              <label
                key={fuel}
                className="flex items-center gap-2 cursor-pointer text-xs"
              >
                <input
                  type="checkbox"
                  className="accent-red-600"
                  checked={filters.fuel.includes(fuel)}
                  onChange={() => onFilterChange("fuel", fuel)}
                />
                <span>{fuel}</span>
                <span className="ml-auto text-sm text-gray-500">
                  {getCount("fuel", fuel)}
                </span>
              </label>
            ))}
          </div>

          {/* Transmission */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className=" text-sm font-semibold mb-2">Transmission</h3>
            {transmissions.map((trans) => (
              <label
                key={trans}
                className="flex items-center gap-2 cursor-pointer text-xs"
              >
                <input
                  type="checkbox"
                  className="accent-red-600"
                  checked={filters.transmission.includes(trans)}
                  onChange={() => onFilterChange("transmission", trans)}
                />
                <span>{trans}</span>
                <span className="ml-auto text-sm text-gray-500">
                  {getCount("transmission", trans)}
                </span>
              </label>
            ))}
          </div>

          {/* Ownership */}
          <div className="">
            <h3 className="text-sm font-semibold mb-2">Ownership</h3>
            {ownerships.map((owner) => (
              <label
                key={owner}
                className="flex items-center gap-2 cursor-pointer text-xs"
              >
                <input
                  type="checkbox"
                  className="accent-red-600"
                  checked={filters.ownership.includes(owner)}
                  onChange={() => onFilterChange("ownership", owner)}
                />
                <span>{owner}</span>
                <span className="ml-auto text-sm text-gray-500">
                  {getCount("ownership", owner)}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
