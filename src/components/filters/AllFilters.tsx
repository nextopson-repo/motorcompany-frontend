import React, { useEffect, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Range, getTrackBackground } from "react-range";

import {
  setBrandModelMap,
  setBrandOptions,
  type SelectedFilters,
} from "../../store/slices/carSlice";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";

import useGCarSheetData from "../../hooks/useGCarSheetData";
import { bodyTypes } from "../../data/Data";

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
        min={min}
        max={max}
        onChange={(vals) => onChange([vals[0], vals[1]])}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-1 rounded relative w-full"
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
        )}
        renderThumb={({ props }) => {
          const { key, ...rest } = props || {};
          return (
            <div
              key={key}
              {...rest}
              className="h-3 w-3 bg-red-600 rounded-full border border-white"
            />
          );
        }}
      />
    </div>
  );

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
        model: has ? prev.model.filter((m) => m !== model) : [...prev.model, model],
      };
    });
  };

  const toggleBodyTypeLocal = (b: string) => toggleFromArray("bodyType", b);
  const toggleFuelLocal = (f: string) => toggleFromArray("fuelType", f);
  const toggleTransmissionLocal = (t: string) => toggleFromArray("transmission", t);
  const toggleOwnershipLocal = (o: string) => toggleFromArray("ownership", o);
  // const toggleSeatLocal = (s: string) => toggleFromArray("seat", s);

  // -------------------------------
  // 🔥 Helpers for ranges (local)
  // -------------------------------
  const onChangePriceLocal = (vals: [number, number]) => {
    updateLocal("priceRange", { min: vals[0], max: vals[1] });
  };

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

  const safePriceVals: [number, number] = [
    Math.max(localFilters.priceRange?.min ?? 1),
    Math.min(localFilters.priceRange?.max ?? 10000000),
  ];

  const safeYearVals: [number, number] = [
    Math.max(localFilters.yearRange?.min ?? 2000),
    Math.min(localFilters.yearRange?.max ?? new Date().getFullYear()),
  ];

  // -------------------------------
  // 🔥 JSX START (header + left menu + right content skeleton)
  // -------------------------------
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
                activeFilter === opt ? "bg-black text-white" : "hover:bg-gray-100"
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
            <div>
              <h2 className="font-semibold mb-3">Price Range</h2>
              {renderRange(safePriceVals, onChangePriceLocal, 1, 10000000, 10000, "₹ ")}
            </div>
          )}

          {/* MODEL YEAR */}
          {activeFilter === "Model Year" && (
            <div>
              <h2 className="font-semibold mb-3">Model Year</h2>
              {renderRange(safeYearVals, onChangeYearLocal, 2000, new Date().getFullYear(), 1)}
            </div>
          )}

          {/* OWNERSHIP */}
          {activeFilter === "Ownership" && (
            <div>
              <h2 className="font-semibold mb-3">Ownership</h2>
              {["1st", "2nd", "3rd+"].map((own) => (
                <label key={own} className="flex items-center gap-2 text-xs py-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-red-500"
                    checked={localFilters.ownership?.includes(own)}
                    onChange={() => toggleOwnershipLocal(own)}
                  />
                  <span className="flex justify-between w-full">
                    {own} Owner
                    <span className="text-[10px] text-gray-500">{getTotalCount("ownership", own)}</span>
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
                <label key={fuel} className="flex items-center gap-2 text-xs py-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-red-500"
                    checked={localFilters.fuelType?.includes(fuel)}
                    onChange={() => toggleFuelLocal(fuel)}
                  />
                  <span className="flex justify-between w-full">
                    {fuel}
                    <span className="text-[10px] text-gray-500">{getTotalCount("fuelType", fuel)}</span>
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
                <label key={gear} className="flex items-center gap-2 text-xs py-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-red-500"
                    checked={localFilters.transmission?.includes(gear)}
                    onChange={() => toggleTransmissionLocal(gear)}
                  />
                  <span className="flex justify-between w-full">
                    {gear}
                    <span className="text-[10px] text-gray-500">{getTotalCount("transmission", gear)}</span>
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
                <label key={type.id} className="flex items-center justify-between py-3 text-xs">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="accent-red-600"
                      checked={localFilters.bodyType?.includes(type.name)}
                      onChange={() => toggleBodyTypeLocal(type.name)}
                    />
                    <img src={type.img} className="h-8 w-16 object-contain" />
                    <span>{type.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-500">{getTotalCount("bodyType", String(type.name))}</span>
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
              <div
                className="max-h-64 overflow-y-auto space-y-3 pr-1"
                style={{ minHeight: "140px" }}
              >
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
                          <div className="ml-3 mt-1 border-l pl-2 space-y-1 max-h-32 overflow-y-auto">
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
          onClick={() => {resetLocal(); onClose();}}
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



// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import type { RootState } from "../../store/store";
// import { ArrowLeft, Search } from "lucide-react";
// import { getTrackBackground, Range } from "react-range";

// // UI slice (only for slider UI)
// import {
//   resetFilters as resetFilterUI,
//   setPriceRange,
//   setModelYearRange,
// } from "../../store/slices/filterSlice";

// import {
//   setBrandModelMap,
//   setBrandOptions,
//   type SelectedFilters,
// } from "../../store/slices/carSlice";
// import { bodyTypes } from "../../data/Data";
// import useGCarSheetData from "../../hooks/useGCarSheetData";

// interface AllFiltersProps {
//   onClose: () => void;
//   selectedFilters: SelectedFilters;
//   onSelectedFiltersChange: (filters: SelectedFilters) => void;
//   getTotalCount: (field: string, value: string) => number;
// }

// const filterOptions = [
//   "Price Range",
//   "Brand + Models",
//   "Model Year",
//   "Body Type",
//   "Fuel Type",
//   "Transmission",
//   "Ownership",
// ];

// const AllFilters: React.FC<AllFiltersProps> = ({
//   onClose,
//   selectedFilters,
//   onSelectedFiltersChange,
//   getTotalCount,
// }) => {
//   const dispatch = useDispatch();
//   const filterUI = useSelector((s: RootState) => s.filters);
//   const brands = useSelector((state: RootState) => state.cars.filters.brand);
//   const brandModelMap = useSelector(
//     (state: RootState) => (state.cars.filters as any).brandModelsMap || {}
//   );
//   const [brandSearch, setBrandSearch] = useState("");
//   const [activeFilter, setActiveFilter] = useState("Brand + Models");
  
//   const sheetId = import.meta.env.VITE_SHEET_ID;
//   const range = "sheet2!A:Z";
//   const apiKey = import.meta.env.VITE_API_KEY;
//   const { data, loading, error } = useGCarSheetData(sheetId, range, apiKey);

//   useEffect(() => {
//     if (!loading && !error && data.length > 0) {
//       const getBrand = (row: any) => row["Brand"] || row["A"];
//       const getModel = (row: any) => row["Model"] || row["B"];
//       const carBrands = [
//         ...new Set(data.map((i: any) => getBrand(i)).filter(Boolean)),
//       ];
//       const brandModelsMap = data.reduce<Record<string, string[]>>(
//         (acc, row) => {
//           const brand = getBrand(row);
//           const model = getModel(row);
//           if (!brand || !model) return acc;
//           if (!acc[brand]) acc[brand] = [];
//           if (!acc[brand].includes(model)) acc[brand].push(model);
//           return acc;
//         },
//         {}
//       );
//       dispatch(setBrandOptions(carBrands));
//       dispatch(setBrandModelMap(brandModelsMap));
//     }
//   }, [data, loading, error]);

//   // 🔥 Helper to update selectedFilters cleanly
//   const updateFilter = (key: string, value: any) => {
//     const updated = { ...selectedFilters, [key]: value };
//     onSelectedFiltersChange(updated);
//   };

//   // BODY TYPE
//   const toggleBodyType = (b: string) => {
//     const exists = selectedFilters.bodyType.includes(b);
//     updateFilter(
//       "bodyType",
//       exists
//         ? selectedFilters.bodyType.filter((bd) => bd !== b)
//         : [...selectedFilters.bodyType, b]
//     );
//   };

//   // FUEL
//   const toggleFuel = (fuel: string) => {
//     const exists = selectedFilters.fuelType.includes(fuel);
//     updateFilter(
//       "fuelType",
//       exists
//         ? selectedFilters.fuelType.filter((f) => f !== fuel)
//         : [...selectedFilters.fuelType, fuel]
//     );
//   };

//   // TRANSMISSION
//   const toggleTransmission = (t: string) => {
//     const exists = selectedFilters.transmission.includes(t);
//     updateFilter(
//       "transmission",
//       exists
//         ? selectedFilters.transmission.filter((tr) => tr !== t)
//         : [...selectedFilters.transmission, t]
//     );
//   };

//   // OWNERSHIP
//   const toggleOwnership = (own: string) => {
//     const exists = selectedFilters.ownership.includes(own);
//     updateFilter(
//       "ownership",
//       exists
//         ? selectedFilters.ownership.filter((o) => o !== own)
//         : [...selectedFilters.ownership, own]
//     );
//   };

//   // PRICE
//   const changePriceRange = (vals: number[]) => {
//     dispatch(setPriceRange(vals));
//     updateFilter("price", vals);
//   };

//   // YEAR
//   const changeYearRange = (vals: number[]) => {
//     dispatch(setModelYearRange(vals));
//     updateFilter("year", vals);
//   };

//   // CLEAR ALL
//   const handleReset = () => {
//     dispatch(resetFilterUI());
//     onSelectedFiltersChange({
//       price: [],
//       year: [],
//       brand: [],
//       model: [],
//       city: [],
//       bodyType: [],
//       fuelType: [],
//       transmission: [],
//       seat: [],
//       ownership: [],
//       userType: "",
//     });
//   };

//   return (
//     <div className="lg:hidden h-screen fixed inset-0 bg-white mt-12 overflow-hidden z-50">
//       {/* HEADER */}
//       <div className="h-[7vh] p-4 border-b">
//         <button onClick={onClose} className="flex items-center gap-1 text-sm">
//           <ArrowLeft className="h-4 w-4" />
//           Back
//         </button>
//       </div>

//       <div className="grid grid-cols-4 h-[84vh]">
//         {/* LEFT MENU */}
//         <div className="col-span-1 bg-gray-50 flex flex-col text-[10px]">
//           {filterOptions.map((opt) => (
//             <button
//               key={opt}
//               onClick={() => setActiveFilter(opt)}
//               className={`px-2 py-3 border border-gray-300 text-left ${
//                 activeFilter === opt
//                   ? "bg-black text-white"
//                   : "hover:bg-gray-100"
//               }`}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>

//         {/* RIGHT SIDE CONTENT */}
//         <div className="col-span-3 overflow-y-auto p-4">
//           {/* PRICE RANGE */}
//           {activeFilter === "Price Range" && (
//             <div>
//               <h2 className="font-semibold mb-3">Price Range</h2>
//               <div className="flex justify-between text-xs mb-2">
//                 <span>₹{filterUI.priceRange[0].toLocaleString()}</span>
//                 <span>₹{filterUI.priceRange[1].toLocaleString()}</span>
//               </div>

//               <Range
//                 values={filterUI.priceRange}
//                 step={50000}
//                 min={1}
//                 max={10000000}
//                 onChange={(v) => changePriceRange(v)}
//                 renderTrack={({ props, children }) => (
//                   <div
//                     {...props}
//                     className="h-1 w-full bg-gray-300 rounded"
//                     style={{
//                       background: getTrackBackground({
//                         values: filterUI.priceRange,
//                         colors: ["#d1d5db", "#ef4444", "#d1d5db"],
//                         min: 0,
//                         max: 10000000,
//                       }),
//                     }}
//                   >
//                     {children}
//                   </div>
//                 )}
//                 renderThumb={({ props }) => (
//                   <div
//                     {...props}
//                     className="h-4 w-4 bg-red-600 rounded-full border"
//                   />
//                 )}
//               />
//             </div>
//           )}

//           {/* MODEL YEAR */}
//           {activeFilter === "Model Year" && (
//             <div>
//               <h2 className="font-semibold mb-3">Model Year</h2>
//               <div className="flex justify-between text-xs mb-2">
//                 <span>{filterUI.yearRange[0]}</span>
//                 <span>{filterUI.yearRange[1]}</span>
//               </div>

//               <Range
//                 values={filterUI.yearRange}
//                 step={1}
//                 min={2000}
//                 max={new Date().getFullYear()}
//                 onChange={(v) => changeYearRange(v)}
//                 renderTrack={({ props, children }) => (
//                   <div
//                     {...props}
//                     className="h-[4px] bg-gray-300 rounded w-full"
//                     style={{
//                       background: getTrackBackground({
//                         values: filterUI.yearRange,
//                         colors: ["#d1d5db", "#ef4444", "#d1d5db"],
//                         min: 2000,
//                         max: new Date().getFullYear(),
//                       }),
//                     }}
//                   >
//                     {children}
//                   </div>
//                 )}
//                 renderThumb={({ props }) => (
//                   <div {...props} className="h-4 w-4 bg-red-600 rounded-full" />
//                 )}
//               />
//             </div>
//           )}

//           {/* OWNERSHIP */}
//           {activeFilter === "Ownership" && (
//             <div>
//               <h2 className="font-semibold mb-3">Ownership</h2>

//               {["1st", "2nd", "3rd+"].map((own) => (
//                 <label
//                   key={own}
//                   className="flex items-center gap-2 text-xs py-2"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedFilters.ownership.includes(own)}
//                     onChange={() => toggleOwnership(own)}
//                     className="w-4 h-4 accent-red-500"
//                   />
//                   <span className="flex justify-between w-full">
//                     {own} Owner
//                     <span>{getTotalCount("ownership", own)}</span>
//                   </span>
//                 </label>
//               ))}
//             </div>
//           )}

//           {/* FUEL */}
//           {activeFilter === "Fuel Type" && (
//             <div>
//               <h2 className="font-semibold mb-3">Fuel Type</h2>

//               {["Petrol", "Diesel", "CNG", "Electric", "Hybrid"].map((fuel) => (
//                 <label
//                   key={fuel}
//                   className="flex items-center gap-2 text-xs py-2"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedFilters.fuelType.includes(fuel)}
//                     onChange={() => toggleFuel(fuel)}
//                     className="w-4 h-4 accent-red-500"
//                   />
//                   <span className="flex justify-between w-full">
//                     {fuel}
//                     <span>{getTotalCount("fuelType", fuel)}</span>
//                   </span>
//                 </label>
//               ))}
//             </div>
//           )}

//           {/* TRANSMISSION */}
//           {activeFilter === "Transmission" && (
//             <div>
//               <h2 className="font-semibold mb-3">Transmission</h2>

//               {["Manual", "Automatic", "Hybrid"].map((gear) => (
//                 <label
//                   key={gear}
//                   className="flex items-center gap-2 text-xs py-2"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedFilters.transmission.includes(gear)}
//                     onChange={() => toggleTransmission(gear)}
//                     className="w-4 h-4 accent-red-500"
//                   />
//                   <span className="flex justify-between w-full">
//                     {gear}
//                     <span>{getTotalCount("transmission", gear)}</span>
//                   </span>
//                 </label>
//               ))}
//             </div>
//           )}

//           {/* BODY TYPE */}
//           {activeFilter === "Body Type" && (
//             <div>
//               <h2 className="font-semibold mb-3">Body Type</h2>

//               {bodyTypes.map((type) => (
//                 <label
//                   key={type.id}
//                   className="flex items-center justify-between py-3 text-xs"
//                 >
//                   <div className="flex items-center gap-3">
//                     <input
//                       type="checkbox"
//                       checked={selectedFilters.bodyType.includes(type.name)}
//                       onChange={() => toggleBodyType(type.name)}
//                       className="w-4 h-4 accent-red-500"
//                     />
//                     <img src={type.img} className="h-8 w-16 object-contain" />
//                     <span>{type.name}</span>
//                   </div>
//                   <span>{getTotalCount("bodyType", type.name)}</span>
//                 </label>
//               ))}
//             </div>
//           )}

//           {/* BRAND + MODELS */}
//           {activeFilter === "Brand + Models" && (
//             <div className="space-y-3">
//               {/* 🔍 Search */}
//               <div className="flex items-center gap-2 bg-gray-200 px-3 py-2 rounded mb-2">
//                 <Search className="w-4 h-4" />
//                 <input
//                   placeholder="Search brand or model"
//                   value={brandSearch}
//                   onChange={(e) => setBrandSearch(e.target.value)}
//                   className="w-full bg-transparent text-xs outline-none"
//                 />
//               </div>

//               {/* 🏷️ Title */}
//               <span className="text-[8.5px] font-semibold text-gray-700">
//                 Top Brands
//               </span>

//               {/* 🧾 Scrollable brand + model list */}
//               <div
//                 className="max-h-64 overflow-y-auto space-y-3 pr-1"
//                 style={{ minHeight: "140px" }}
//               >
//                 {brands
//                   ?.filter((brand) =>
//                     brand.toLowerCase().includes(brandSearch.toLowerCase())
//                   )
//                   .map((brand) => {
//                     const brandModels = brandModelMap?.[brand] || [];

//                     return (
//                       <div key={brand} className="space-y-1">
//                         {/* Brand Row */}
//                         <label className="flex items-center gap-2 cursor-pointer text-[10px] pr-2">
//                           <input
//                             type="checkbox"
//                             className="accent-red-600"
//                             checked={selectedFilters.brand.includes(brand)}
//                             onChange={() => {
//                               const isSelected =
//                                 selectedFilters.brand.includes(brand);

//                               const updatedBrands = isSelected
//                                 ? selectedFilters.brand.filter(
//                                     (b) => b !== brand
//                                   )
//                                 : [...selectedFilters.brand, brand];

//                               // Remove models when brand is unchecked
//                               const updatedModels = isSelected
//                                 ? selectedFilters.model.filter(
//                                     (m) => !brandModels.includes(m)
//                                   )
//                                 : selectedFilters.model;

//                               onSelectedFiltersChange({
//                                 ...selectedFilters,
//                                 brand: updatedBrands,
//                                 model: updatedModels,
//                               });
//                             }}
//                           />
//                           <span className="font-semibold">{brand}</span>

//                           <span className="ml-auto text-[9px] text-gray-500">
//                             {getTotalCount("brand", brand)}
//                           </span>
//                         </label>

//                         {/* Models Only When Brand Selected */}
//                         {selectedFilters.brand.includes(brand) && (
//                           <div className="ml-3 mt-1 border-l pl-2 space-y-1 max-h-32 overflow-y-auto">
//                             {brandModels.map((model: any) => (
//                               <label
//                                 key={model}
//                                 className="flex items-center gap-2 text-[9px] cursor-pointer pr-2"
//                               >
//                                 <input
//                                   type="checkbox"
//                                   className="accent-red-500"
//                                   checked={selectedFilters.model.includes(
//                                     model
//                                   )}
//                                   onChange={() => {
//                                     const isSelected =
//                                       selectedFilters.model.includes(model);

//                                     const updatedModels = isSelected
//                                       ? selectedFilters.model.filter(
//                                           (m) => m !== model
//                                         )
//                                       : [...selectedFilters.model, model];

//                                     onSelectedFiltersChange({
//                                       ...selectedFilters,
//                                       model: updatedModels,
//                                     });
//                                   }}
//                                 />
//                                 <span>{model}</span>

//                                 <span className="ml-auto text-[9px] text-gray-500">
//                                   {getTotalCount("model", model)}
//                                 </span>
//                               </label>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}

//                 {/* No results */}
//                 {brands?.filter((b) =>
//                   b.toLowerCase().includes(brandSearch.toLowerCase())
//                 ).length === 0 && (
//                   <p className="text-xs text-gray-500">No matching brands</p>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* FOOTER BUTTONS */}
//       <div className="fixed bottom-0 w-full bg-white border-t p-4 flex gap-3">
//         <button
//           onClick={handleReset}
//           className="flex-1 py-2 border rounded text-xs"
//         >
//           Clear Filters
//         </button>
//         <button
//           onClick={onClose}
//           className="flex-1 py-2 bg-black text-white rounded text-xs"
//         >
//           Show Cars
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AllFilters;