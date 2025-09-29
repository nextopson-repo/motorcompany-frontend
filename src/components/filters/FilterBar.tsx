import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import LocationFilter from "./LocationFilter";
import BrandModelFilter from "./BrandModelFilter";
import { ChevronDown, ListFilter } from "lucide-react";
import ModelYearFilter from "./ModelYearFilter";
import BodyTypeFilter from "./BodyTypeFilter";
import AllFilters from "./AllFilters";
import RoleFilter from "./RoleFilter";

const FilterBar = () => {
  const [openFilter, setOpenFilter] = useState<null | string>(null);
  const userType = useSelector((state: RootState) => state.filters.ownership);
  const city = useSelector((state: RootState) => state.filters.city);

  const toggleFilter = (name: string) => {
    setOpenFilter(openFilter === name ? null : name);
  };

  return (
    <div className="w-full flex gap-2 py-2 overflow-x-auto">
      {/* Filters */}
      <div className="whitespace-nowrap">
        <button
          className="px-3 py-[6px] border border-gray-200 rounded-sm text-[10px] flex items-center gap-2"
          onClick={() => toggleFilter("allFilters")}
        >
          <ListFilter className="h-3 w-3" /> Filters{" "}
          <ChevronDown className="h-3 w-3" />
        </button>
        {openFilter === "allFilters" && (
          <AllFilters onClose={() => setOpenFilter(null)} />
        )}
      </div>

      {/* Ownership Dropdown */}
      <div className="whitespace-nowrap">
        <RoleFilter userType={userType} />
      </div>

      {/* City Selector */}
      <div className="whitespace-nowrap">
        <button
          className="px-2 py-[6px] border border-blue-500 text-blue-500 rounded-sm text-[10px] flex items-center gap-1 active:bg-gray-300 transition-all duration-300"
          onClick={() => toggleFilter("city")}
        >
          {city ? city : "City "}
          <ChevronDown className="h-3 w-3 " />
        </button>
        {openFilter === "city" && (
          <LocationFilter onClose={() => setOpenFilter(null)} />
        )}
      </div>

      {/* Brand + Models */}
      <div className="whitespace-nowrap">
        <button
          className="px-2 py-[6px] border border-gray-200 rounded-sm text-[10px] flex items-center gap-2"
          onClick={() => toggleFilter("brand")}
        >
          Brand + Models <ChevronDown className="h-3 w-3" />
        </button>
        {openFilter === "brand" && (
          <BrandModelFilter onClose={() => setOpenFilter(null)} />
        )}
      </div>

      {/* Model Year */}
      <div className="whitespace-nowrap">
        <button
          className="px-2 py-[6px] border border-gray-200 rounded-sm text-[10px] flex items-center gap-2"
          onClick={() => toggleFilter("modelYear")}
        >
          Models Year <ChevronDown className="h-3 w-3" />
        </button>
        {openFilter === "modelYear" && (
          <ModelYearFilter onClose={() => setOpenFilter(null)} />
        )}
      </div>

      {/* body type */}
      <div className="whitespace-nowrap">
        <button
          className="px-3 py-[6px] border border-gray-200 rounded-sm text-[10px] flex items-center gap-2"
          onClick={() => toggleFilter("bodyType")}
        >
          Body Type <ChevronDown className="h-3 w-3" />
        </button>
        {openFilter === "bodyType" && (
          <BodyTypeFilter onClose={() => setOpenFilter(null)} />
        )}
      </div>
    </div>
  );
};

export default FilterBar;
