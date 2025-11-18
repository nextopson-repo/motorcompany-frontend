import React, { useEffect, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Direction, Range, getTrackBackground } from "react-range";

import {
  setBrandModelMap,
  setBrandOptions,
  type SelectedFilters,
} from "../../store/slices/carSlice";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";

import useGCarSheetData from "../../hooks/useGCarSheetData";
import { bodyTypes, priceSteps } from "../../data/Data";

interface AllFiltersProps {
  onClose: () => void;
  selectedFilters: SelectedFilters;
  onSelectedFiltersChange: (filters: SelectedFilters) => void;
  getTotalCount: (field: string, value: string) => number;
}

const filterOptions = [
  "Price Range",
  "Brand + Models",
  "Model Year",
  "Body Type",
  "Fuel Type",
  "Transmission",
  "Ownership",
];

const AllFilters: React.FC<AllFiltersProps> = ({
  onClose,
  selectedFilters,
  onSelectedFiltersChange,
  getTotalCount,
}) => {
  const dispatch = useDispatch();

  // -------------------------------
  // 🔥 LOCAL STATE (No instant Redux dispatch)
  // -------------------------------
  const [localFilters, setLocalFilters] = useState<SelectedFilters>({
    ...selectedFilters,
    priceRange: selectedFilters.priceRange || { min: 1, max: 10000000 },
    yearRange: selectedFilters.yearRange || {
      min: 2000,
      max: new Date().getFullYear(),
    },
  });

  const brands = useSelector((s: RootState) => s.cars.filters.brand);
  const brandModelMap = useSelector(
    (s: RootState) => (s.cars.filters as any).brandModelsMap || {}
  );
  const [brandSearch, setBrandSearch] = useState("");

  const [activeFilter, setActiveFilter] = useState("Brand + Models");

  // -------------------------------
  // 🔥 Google Sheet → Brand/Model Mapping
  // -------------------------------
  const sheetId = import.meta.env.VITE_SHEET_ID;
  const range = "sheet2!A:Z";
  const apiKey = import.meta.env.VITE_API_KEY;

  const { data, loading, error } = useGCarSheetData(sheetId, range, apiKey);

  useEffect(() => {
    if (!loading && !error && data.length > 0) {
      const getBrand = (row: any) => row["Brand"] || row["A"];
      const getModel = (row: any) => row["Model"] || row["B"];

      const carBrands = [
        ...new Set(
          data.map((row: any) => getBrand(row)).filter((x: any) => !!x)
        ),
      ];

      const map: Record<string, string[]> = {};

      data.forEach((row: any) => {
        const brand = getBrand(row);
        const model = getModel(row);

        if (!brand || !model) return;

        if (!map[brand]) map[brand] = [];
        if (!map[brand].includes(model)) map[brand].push(model);
      });

      dispatch(setBrandOptions(carBrands));
      dispatch(setBrandModelMap(map));
    }
  }, [data, loading, error]);

  // -------------------------------
  // 🔥 Safe Local Toggle Helpers
  // -------------------------------
  const updateLocal = (key: keyof SelectedFilters, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFromArray = (
    key: keyof SelectedFilters,
    value: string,
    extraRemove: string[] = []
  ) => {
    setLocalFilters((prev) => {
      const arr = prev[key] as string[];
      const exists = arr.includes(value);

      return {
        ...prev,
        [key]: exists ? arr.filter((x) => x !== value) : [...arr, value],
        model:
          key === "brand" && exists
            ? prev.model.filter((m) => !extraRemove.includes(m))
            : prev.model,
      };
    });
  };

  // -------------------------------
  // 🔥 Render helpers
  // -------------------------------
  const renderRange = (
    values: [number, number],
    onChange: (vals: [number, number]) => void,
    min: number,
    max: number,
    step: number,
    prefix?: string
  ) => {
    const years = [];
    for (let i = max; i >= min; i--) years.push(i);

    return (
      <div className="flex gap-10 px-3 h-[calc(100vh-40vh)]">
        {/* Slider Section */}
        <div className="relative flex flex-col items-center">
          {/* Value Bubble - Top */}
          <div className="text-xs font-semibold text-white bg-[#EE1422] rounded-full px-3 py-1 mb-2.5">
            {prefix}
            {values[1].toLocaleString()}
          </div>

          {/* Vertical Slider */}
          <Range
            values={values}
            step={step}
            min={min}
            max={max}
            onChange={(vals) => onChange([vals[0], vals[1]])}
            direction={Direction.Up}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                className="h-full w-2 rounded-full relative"
                style={{
                  background: getTrackBackground({
                    values,
                    colors: ["#D1D5DB", "#EE1422", "#D1D5DB"],
                    min,
                    max,
                    direction: Direction.Up,
                  }),
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => {
              const { key, ...rest } = props || {};
              return (
                <div
                  key={key}
                  {...rest}
                  className="h-4 w-4 bg-white border-2 border-[#EE1422] rounded-full shadow-md"
                />
              );
            }}
          />

          {/* Value Bubble - Bottom */}
          <div className="text-xs font-semibold text-white bg-[#EE1422] rounded-full px-3 py-1 mt-2.5">
            {prefix}
            {values[0].toLocaleString()}
          </div>
        </div>

        {/* Right Side Tick Labels */}
        <div className="flex flex-col justify-between text-xs font-medium text-gray-700 py-8">
          {years.map((y) => (
            <span key={y} className="leading-1">
              {prefix}
              {y.toLocaleString()}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // -------------------------------
  // 🔥 Local toggles (brands/models/seats/etc)
  // -------------------------------
  const toggleBrandLocal = (brand: string) => {
    const brandModels = brandModelMap?.[brand] || [];
    setLocalFilters((prev) => {
      const has = prev.brand.includes(brand);
      const newBrand = has
        ? prev.brand.filter((b) => b !== brand)
        : [...prev.brand, brand];

      // if unchecking brand -> remove its models
      const newModel = has
        ? prev.model.filter((m) => !brandModels.includes(m))
        : prev.model;

      return {
        ...prev,
        brand: newBrand,
        model: newModel,
      };
    });
  };

  const toggleModelLocal = (model: string) => {
    setLocalFilters((prev) => {
      const has = prev.model.includes(model);
      return {
        ...prev,
        model: has
          ? prev.model.filter((m) => m !== model)
          : [...prev.model, model],
      };
    });
  };

  const toggleBodyTypeLocal = (b: string) => toggleFromArray("bodyType", b);
  const toggleFuelLocal = (f: string) => toggleFromArray("fuelType", f);
  const toggleTransmissionLocal = (t: string) =>
    toggleFromArray("transmission", t);
  const toggleOwnershipLocal = (o: string) => toggleFromArray("ownership", o);
  // const toggleSeatLocal = (s: string) => toggleFromArray("seat", s);

  // -------------------------------
  // 🔥 Helpers for ranges (local)
  // -------------------------------
  // const onChangePriceLocal = (vals: [number, number]) => {
  //   updateLocal("priceRange", { min: vals[0], max: vals[1] });
  // };

  const onChangeYearLocal = (vals: [number, number]) => {
    updateLocal("yearRange", { min: vals[0], max: vals[1] });
  };

  // -------------------------------
  // 🔥 Local clear (resets localFilters only)
  // -------------------------------
  const resetLocal = () => {
    setLocalFilters({
      userType: "EndUser", // default value only ONE
      brand: [],
      model: [],
      bodyType: [],
      fuelType: [],
      transmission: [],
      ownership: [],
      location: [],
      priceRange: { min: 1, max: 10000000 },
      yearRange: { min: 2000, max: new Date().getFullYear() },
    });
    setBrandSearch("");
  };

  // -------------------------------
  // 🔥 Derived safe values to show in sliders
  // -------------------------------
  const safeYearVals: [number, number] = [
    Math.max(localFilters.yearRange?.min ?? 2000),
    Math.min(localFilters.yearRange?.max ?? new Date().getFullYear()),
  ];

  return (
    <div className="lg:hidden h-screen fixed inset-0 bg-white mt-12 overflow-hidden z-50">
      {/* header */}
      <div className="h-fit p-4 border-b">
        <button
          onClick={() => {
            // discard local changes if back pressed (keep selectedFilters unchanged)
            onClose();
          }}
          className="flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="grid grid-cols-4 h-[84vh]">
        {/* LEFT MENU */}
        <div className="col-span-1 bg-gray-50 flex flex-col text-[10px]">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setActiveFilter(opt)}
              className={`px-2 py-3 border border-gray-300 text-left ${
                activeFilter === opt
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* RIGHT CONTENT */}
        <div className="col-span-3 overflow-y-auto p-4">
          {/* PRICE RANGE */}
          {activeFilter === "Price Range" && (
            <div className="h-full">
              <h2 className="font-semibold mb-3">Price Range</h2>

              <PriceVerticalRange
                values={[
                  localFilters.priceRange.min,
                  localFilters.priceRange.max,
                ]}
                onChange={(vals) =>
                  updateLocal("priceRange", { min: vals[0], max: vals[1] })
                }
              />
            </div>
          )}

          {/* MODEL YEAR */}
          {activeFilter === "Model Year" && (
            <div className="h-full">
              <h2 className="font-semibold mb-3">Model Year</h2>
              {renderRange(
                safeYearVals,
                onChangeYearLocal,
                2000,
                new Date().getFullYear(),
                1
              )}
            </div>
          )}

          {/* OWNERSHIP */}
          {activeFilter === "Ownership" && (
            <div>
              <h2 className="font-semibold mb-3">Ownership</h2>
              {["1st", "2nd", "3rd+"].map((own) => (
                <label
                  key={own}
                  className="flex items-center gap-2 text-xs py-2"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-red-500"
                    checked={localFilters.ownership?.includes(own)}
                    onChange={() => toggleOwnershipLocal(own)}
                  />
                  <span className="flex justify-between w-full">
                    {own} Owner
                    <span className="text-[10px] text-gray-500">
                      {getTotalCount("ownership", own)}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* FUEL */}
          {activeFilter === "Fuel Type" && (
            <div>
              <h2 className="font-semibold mb-3">Fuel Type</h2>
              {["Petrol", "Diesel", "CNG", "Electric", "Hybrid"].map((fuel) => (
                <label
                  key={fuel}
                  className="flex items-center gap-2 text-xs py-2"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-red-500"
                    checked={localFilters.fuelType?.includes(fuel)}
                    onChange={() => toggleFuelLocal(fuel)}
                  />
                  <span className="flex justify-between w-full">
                    {fuel}
                    <span className="text-[10px] text-gray-500">
                      {getTotalCount("fuelType", fuel)}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* TRANSMISSION */}
          {activeFilter === "Transmission" && (
            <div>
              <h2 className="font-semibold mb-3">Transmission</h2>
              {["Manual", "Automatic", "Hybrid"].map((gear) => (
                <label
                  key={gear}
                  className="flex items-center gap-2 text-xs py-2"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-red-500"
                    checked={localFilters.transmission?.includes(gear)}
                    onChange={() => toggleTransmissionLocal(gear)}
                  />
                  <span className="flex justify-between w-full">
                    {gear}
                    <span className="text-[10px] text-gray-500">
                      {getTotalCount("transmission", gear)}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* BODY TYPE */}
          {activeFilter === "Body Type" && (
            <div>
              <h2 className="font-semibold mb-3">Body Type</h2>
              {bodyTypes.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center justify-between text-xs py-1"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="accent-red-600 h-4 w-4"
                      checked={localFilters.bodyType?.includes(type.name)}
                      onChange={() => toggleBodyTypeLocal(type.name)}
                    />
                    <img src={type.img} className="h-8 w-16 object-contain " />
                    <span>{type.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-500">
                    {getTotalCount("bodyType", String(type.name))}
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* BRAND + MODELS */}
          {activeFilter === "Brand + Models" && (
            <div className="space-y-3">
              {/* 🔍 Search */}
              <div className="flex items-center gap-2 bg-gray-200 px-3 py-2 rounded mb-2">
                <Search className="w-4 h-4" />
                <input
                  placeholder="Search brand or model"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full bg-transparent text-xs outline-none"
                />
              </div>

              <span className="text-[8.5px] font-semibold text-gray-700">
                Top Brands
              </span>

              {/* 🧾 Scrollable brand + model section */}
              <div className=" overflow-y-auto space-y-3 pr-1">
                {brands
                  ?.filter((brand) =>
                    brand.toLowerCase().includes(brandSearch.toLowerCase())
                  )
                  .map((brand) => {
                    const models = brandModelMap?.[brand] || [];

                    return (
                      <div key={brand} className="space-y-1">
                        {/* BRAND ROW */}
                        <label className="flex items-center gap-2 cursor-pointer text-[10px] pr-2">
                          <input
                            type="checkbox"
                            className="accent-red-600"
                            checked={localFilters.brand.includes(brand)}
                            onChange={() => toggleBrandLocal(brand)}
                          />
                          <span className="font-semibold">{brand}</span>
                          <span className="ml-auto text-[9px] text-gray-500">
                            {getTotalCount("brand", brand)}
                          </span>
                        </label>

                        {/* MODELS ROW */}
                        {localFilters.brand.includes(brand) && (
                          <div className="mx-2 mt-1 px-2 space-y-1 max-h-60 overflow-y-auto">
                            {models.map((m: string) => (
                              <label
                                key={m}
                                className="flex items-center gap-2 text-[9px] cursor-pointer pr-2"
                              >
                                <input
                                  type="checkbox"
                                  className="accent-red-500"
                                  checked={localFilters.model.includes(m)}
                                  onChange={() => toggleModelLocal(m)}
                                />
                                <span>{m}</span>

                                <span className="ml-auto text-[9px] text-gray-500">
                                  {getTotalCount("model", m)}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                {/* NO RESULTS */}
                {brands?.filter((b) =>
                  b.toLowerCase().includes(brandSearch.toLowerCase())
                ).length === 0 && (
                  <p className="text-xs text-gray-500">No matching brands</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER BUTTONS */}
      <div className="fixed bottom-0 w-full bg-white border-t p-4 flex gap-3">
        <button
          onClick={() => {
            resetLocal();
            onClose();
          }}
          className="flex-1 py-2 border rounded text-xs"
        >
          Clear Filters
        </button>

        <button
          onClick={() => {
            // APPLY LOCAL FILTERS TO PARENT
            onSelectedFiltersChange(localFilters);
            onClose();
          }}
          className="flex-1 py-2 bg-black text-white rounded text-xs"
        >
          Show Cars
        </button>
      </div>
    </div>
  );
};

export default AllFilters;

// -------------------------------
// 🔥 priceRange helper code
// -------------------------------
const valueToIndex = (v: number) => {
  let closest = 0;
  priceSteps.forEach((p, i) => {
    if (Math.abs(p - v) < Math.abs(priceSteps[closest] - v)) {
      closest = i;
    }
  });
  return closest;
};

const indexToValue = (i: number) => priceSteps[i];

const PriceVerticalRange = ({
  values,
  onChange,
}: {
  values: [number, number];
  onChange: (vals: [number, number]) => void;
}) => {
  const idxValues = [valueToIndex(values[0]), valueToIndex(values[1])];

  return (
    <div className="flex gap-6 px-3 max-h-full">
      {/* Slider Section */}
      <div className="relative flex flex-col items-center">
        {/* Top bubble */}
        <div className="text-xs font-semibold text-white bg-[#EE1422] rounded-full px-3 py-1 mb-2.5">
          ₹{values[1].toLocaleString()}
        </div>

        <Range
          values={idxValues}
          step={1}
          min={0}
          max={priceSteps.length - 1}
          direction={Direction.Up}
          onChange={(newIdx) =>
            onChange([indexToValue(newIdx[0]), indexToValue(newIdx[1])])
          }
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="h-full w-2 rounded-full"
              style={{
                background: getTrackBackground({
                  values: idxValues,
                  colors: ["#D1D5DB", "#EE1422", "#D1D5DB"],
                  min: 0,
                  max: priceSteps.length - 1,
                  direction: Direction.Up,
                }),
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="h-4 w-4 bg-white border-2 border-red-600 rounded-full shadow-md"
            />
          )}
        />

        {/* Bottom bubble */}
        <div className="text-xs font-semibold text-white bg-[#EE1422] rounded-full px-3 py-1 mt-2.5">
          ₹{values[0].toLocaleString()}
        </div>
      </div>

      {/* Tick labels */}
      <div className="flex flex-col justify-between h-full text-xs font-medium text-gray-700 space-y-1.5 py-8">
        {[...priceSteps].reverse().map((p) => (
          <span key={p}>₹{p.toLocaleString()}</span>
        ))}
      </div>
    </div>
  );
};