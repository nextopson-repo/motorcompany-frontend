import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";

import { ChevronDown, ListFilter, X } from "lucide-react";

import BrandModelFilter from "./BrandModelFilter";
import BodyTypeFilter from "./BodyTypeFilter";
import AllFilters from "./AllFilters";
import RoleFilter from "./RoleFilter";

import {
  setSelectedFilters,
  setSortOption,
  type SelectedFilters,
} from "../../store/slices/carSlice";

import { sortOptions } from "../../data/filterOptions";

const FilterBar = () => {
  const [openFilter, setOpenFilter] = useState<null | string>(null);
  const dispatch = useDispatch();

  const { selectedFilters } = useSelector((state: RootState) => state.cars);
  const filterCount = useSelector(
    (state: RootState) => state.cars.filterCounts
  );
  const sortOption = useSelector((state: RootState) => state.cars.sortOption);

  // 🔥 REF TYPES FIXED
  const sortRef = useRef<HTMLButtonElement | null>(null);
  const userTypeRef = useRef<HTMLDivElement | null>(null);

  // open/close handler
  const toggleFilter = (name: string) =>
    setOpenFilter(openFilter === name ? null : name);

  // apply filters
  const handleFilterChange = (newFilters: SelectedFilters) => {
    dispatch(setSelectedFilters(newFilters));
    setOpenFilter(null);
  };

  const removeChip = (key: keyof SelectedFilters, value?: string) => {
    const updated: SelectedFilters = { ...selectedFilters };

    // --- ARRAY KEYS ---
    const arrayKeys: (keyof SelectedFilters)[] = [
      "brand",
      "model",
      "bodyType",
      "fuelType",
      "transmission",
      "ownership",
      "location",
    ];

    if (arrayKeys.includes(key)) {
      updated[key] = (updated[key] as string[]).filter(
        (v) => v !== value
      ) as any;
    }

    // --- PRICE RANGE RESET ---
    if (key === "priceRange") {
      updated.priceRange = { min: 1, max: 10000000 };
    }

    // --- YEAR RANGE RESET ---
    if (key === "yearRange") {
      updated.yearRange = { min: 2000, max: new Date().getFullYear() };
    }

    // --- USER TYPE RESET ---
    if (key === "userType") {
      updated.userType = "EndUser"; // default
    }

    dispatch(setSelectedFilters(updated));
  };

  // get counts
  const getTotalCount = (type: string, value: string) => {
    if (!filterCount || typeof filterCount !== "object") return 0;
    const category = (filterCount as any)[type];
    return category?.[value] || 0;
  };

  // 🔥 outside click/scroll close
  useEffect(() => {
    const handleScroll = () => setOpenFilter(null);
    window.addEventListener("scroll", handleScroll);

    return () => {
      // document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // chip style
  const chipStyle =
    "flex items-center text-blue-500 border border-blue-500 rounded-full py-0.5 px-3 text-xs gap-1 whitespace-nowrap";

  return (
    <div className="w-full flex flex-col gap-2 py-2">
      {/* ------------------- TOP BUTTONS ------------------- */}
      <div className="flex gap-2 overflow-x-auto scroll-hide">
        {/* Filters */}
        <button
          className="px-3 py-2 border border-gray-200 rounded-sm text-xs flex items-center gap-2"
          onClick={() => toggleFilter("allFilters")}
        >
          <ListFilter className="h-4 w-4" /> Filters
          <ChevronDown className="h-4 w-4" />
        </button>

        {/* Role Filter */}
        <div ref={userTypeRef} className="whitespace-nowrap">
          <RoleFilter
            userType={selectedFilters.userType}
            selectedFilters={selectedFilters}
            buttonRef={userTypeRef}
            onSelectedFiltersChange={handleFilterChange}
          />
        </div>

        {/* Sort */}
        <button
          ref={sortRef}
          className="px-3 py-2 border border-gray-200 rounded-sm text-xs flex items-center gap-1 whitespace-nowrap"
          onClick={() => toggleFilter("sort")}
        >
          Sort
          <ChevronDown className="h-4 w-4" />
        </button>

        {/* Brand + Model */}
        <button
          className="px-2 py-2 border border-gray-200 rounded-sm text-xs flex items-center gap-2 whitespace-nowrap"
          onClick={() => toggleFilter("brand")}
        >
          Brand + Model <ChevronDown className="h-4 w-4" />
        </button>

        {/* Body Type */}
        <button
          className="px-3 py-2 border border-gray-200 rounded-sm text-xs flex items-center gap-2 whitespace-nowrap"
          onClick={() => toggleFilter("bodyType")}
        >
          Body Type <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* ------------------- CHIPS ------------------- */}
      <div className="flex gap-2 overflow-x-auto scroll-hide">
        {selectedFilters.location.map((city) => (
          <span key={city} className={chipStyle}>
            {city}
            <X size={12} onClick={() => removeChip("location", city)} />
          </span>
        ))}

        {selectedFilters.brand.map((b) => (
          <span key={b} className={chipStyle}>
            {b}
            <X size={12} onClick={() => removeChip("brand", b)} />
          </span>
        ))}

        {selectedFilters.model.map((m) => (
          <span key={m} className={chipStyle}>
            {m}
            <X size={12} onClick={() => removeChip("model", m)} />
          </span>
        ))}

        {(selectedFilters.priceRange.min !== 1 ||
          selectedFilters.priceRange.max !== 10000000) && (
          <span className={chipStyle}>
            ₹{selectedFilters.priceRange.min.toLocaleString()} - ₹
            {selectedFilters.priceRange.max.toLocaleString()}
            <X size={12} onClick={() => removeChip("priceRange")} />
          </span>
        )}

        {(selectedFilters.yearRange.min !== 2000 ||
          selectedFilters.yearRange.max !== new Date().getFullYear()) && (
          <span className={chipStyle}>
            {selectedFilters.yearRange.min} - {selectedFilters.yearRange.max}
            <X size={12} onClick={() => removeChip("yearRange")} />
          </span>
        )}

        {selectedFilters.bodyType.map((bt) => (
          <span key={bt} className={chipStyle}>
            {bt}
            <X size={12} onClick={() => removeChip("bodyType", bt)} />
          </span>
        ))}
      </div>

      {/* ------------------- POPUPS ------------------- */}

      {openFilter === "allFilters" && (
        <AllFilters
          selectedFilters={selectedFilters}
          onSelectedFiltersChange={handleFilterChange}
          onClose={() => setOpenFilter(null)}
          getTotalCount={getTotalCount}
        />
      )}

      {openFilter === "sort" && (
        <div
          className="fixed z-50 bg-white shadow rounded w-32 border border-gray-200"
          style={{
            top:
              sortRef.current?.getBoundingClientRect().bottom! +
              window.scrollY +
              4,
            left:
              sortRef.current?.getBoundingClientRect().left! + window.scrollX,
          }}
        >
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              className={`block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm ${
                sortOption === opt.value ? "bg-gray-100 font-semibold" : ""
              }`}
              onClick={() => {
                dispatch(setSortOption(opt.value));
                setOpenFilter(null);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {openFilter === "brand" && (
        <BrandModelFilter
          selectedFilters={selectedFilters}
          onSelectedFiltersChange={handleFilterChange}
          onClose={() => setOpenFilter(null)}
          getTotalCount={getTotalCount}
        />
      )}

      {openFilter === "bodyType" && (
        <BodyTypeFilter
          selectedFilters={selectedFilters}
          onSelectedFiltersChange={handleFilterChange}
          onClose={() => setOpenFilter(null)}
          getTotalCount={getTotalCount}
        />
      )}
    </div>
  );
};

export default FilterBar;