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
    priceRange: [number, number] | null;
    yearRange: [number, number] | null;
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
  const [collapsed, setCollapsed] = useState(false);

  // ✅ Get min and max from dataset to use in sliders
  const minPrice = Math.min(...carsData.map((c) => c.price));
  const maxPrice = Math.max(...carsData.map((c) => c.price));
  const minYear = Math.min(...carsData.map((c) => c.year));
  const maxYear = Math.max(...carsData.map((c) => c.year));

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
      new Set(
        carsData
          .filter((c) => c.location.state === state)
          .map((c) => c.location.city)
      )
    );
  });

  // ✅ Helper to render range sliders
  const renderRange = (
    values: [number, number],
    setValues: (range: [number, number]) => void,
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
          const { key, ...rest } =
            (props as {
              key?: React.Key;
            } & React.HTMLAttributes<HTMLDivElement>) || {};
          return (
            <div
              key={key}
              {...rest}
              className="h-[4px] bg-gray-300 rounded relative"
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
              className="h-4 w-4 bg-red-600 rounded-full cursor-pointer"
            />
          );
        }}
      />
    </div>
  );

  return (
    <aside className="py-4 lg:pl-8 w-72">
      {/* ✅ Collapse button */}
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


      {/* ✅ Price Range Slider */}
      {filters.priceRange?.[0] != null &&
        filters.priceRange?.[1] != null &&
        filters.priceRange[0] < filters.priceRange[1] && (
          <div className="border-b border-gray-200 pb-4 mt-4">
            <h3 className="text-sm font-semibold mb-2">Price Range</h3>
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

      {/* ✅ Year Range Slider */}
      {filters.yearRange?.[0] != null &&
        filters.yearRange?.[1] != null &&
        filters.yearRange[0] < filters.yearRange[1] && (
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-sm font-semibold mb-2">Model Year</h3>
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

      {/* ✅ Brands */}
      {!collapsed && (
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-sm font-semibold mb-2">Brands</h3>
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer text-xs"
            >
              <input
                type="checkbox"
                className="accent-red-600"
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
              <span>{brand}</span>
              <span className="ml-auto text-sm text-gray-500">
                {getCount("brand", brand)}
              </span>
            </label>
          ))}
        </div>
      )}

      {/* ✅ Locations */}
      {!collapsed && (
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-sm font-semibold mb-2">Location</h3>
          {states.map((state) => (
            <Disclosure key={state}>
              {({ open }) => (
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="accent-red-600"
                        checked={selectedFilters.location.includes(state)}
                        onChange={() =>
                          onSelectedFiltersChange({
                            ...selectedFilters,
                            location: selectedFilters.location.includes(state)
                              ? selectedFilters.location.filter(
                                  (l) => l !== state
                                )
                              : [...selectedFilters.location, state],
                          })
                        }
                      />
                      <span>{state}</span>
                    </label>
                    <Disclosure.Button>
                      {open ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </Disclosure.Button>
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
                        <span>{city}</span>
                      </label>
                    ))}
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          ))}
        </div>
      )}

      {/* ✅ Body Types */}
      {!collapsed && (
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-sm font-semibold mb-2">Body Type</h3>
          {bodyTypes.map((body) => {
            const IconComp =
              body.toLowerCase() === "suv"
                ? CarFront
                : body.toLowerCase() === "hatchback"
                ? Car
                : body.toLowerCase() === "sedan"
                ? Truck
                : Bus;
            return (
              <label
                key={body}
                className="flex items-center gap-2 cursor-pointer text-xs"
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
                <IconComp className="text-red-600" size={18} />
                <span>{body}</span>
                <span className="ml-auto text-sm text-gray-500">
                  {getCount("body", body)}
                </span>
              </label>
            );
          })}
        </div>
      )}

      {/* ✅ Fuel Types */}
      {!collapsed && (
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
              <span>{fuel}</span>
              <span className="ml-auto text-sm text-gray-500">
                {getCount("fuel", fuel)}
              </span>
            </label>
          ))}
        </div>
      )}

      {/* ✅ Transmission */}
      {!collapsed && (
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-sm font-semibold mb-2">Transmission</h3>
          {transmissions.map((trans) => (
            <label
              key={trans}
              className="flex items-center gap-2 cursor-pointer text-xs"
            >
              <input
                type="checkbox"
                className="accent-red-600"
                checked={selectedFilters.transmission.includes(trans)}
                onChange={() =>
                  onSelectedFiltersChange({
                    ...selectedFilters,
                    transmission: selectedFilters.transmission.includes(trans)
                      ? selectedFilters.transmission.filter((t) => t !== trans)
                      : [...selectedFilters.transmission, trans],
                  })
                }
              />
              <span>{trans}</span>
              <span className="ml-auto text-sm text-gray-500">
                {getCount("transmission", trans)}
              </span>
            </label>
          ))}
        </div>
      )}

      {/* ✅ Ownership */}
      {!collapsed && (
        <div className="pb-4">
          <h3 className="text-sm font-semibold mb-2">Ownership</h3>
          {ownerships.map((owner) => (
            <label
              key={owner}
              className="flex items-center gap-2 cursor-pointer text-xs"
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
              <span>{owner}</span>
              <span className="ml-auto text-sm text-gray-500">
                {getCount("ownership", owner)}
              </span>
            </label>
          ))}
        </div>
      )}
    </aside>
  );
};