import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import RequirementCard from "../components/RequirementCard";
import type { RootState, AppDispatch } from "../store/store";
import {
  fetchAllRequirements,
  createRequirementEnquiry,
  deleteRequirement,
  type Requirement,
} from "../store/slices/requirementsSlice";
import { selectAuth } from "../store/slices/authSlices/authSlice";
import { ChevronDown, Plus } from "lucide-react";
import { openLogin } from "../store/slices/authSlices/loginModelSlice";
import { fuelOptions, transmissionOptions } from "../data/filterOptions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cityData } from "../data/cityData";
import useGCarSheetData from "../hooks/useGCarSheetData";

// Filter state type
interface FilterState {
  brands: string[];
  fuelTypes: string[];
  transmissions: string[];
  city: string[];
  priceMin: string;
  priceMax: string;
  // state: string;
  userType: string;
  dateFrom: Date | null;
  dateTo: Date | null;
}

// const formatStateName = (state: string): string => state.replace(/([A-Z])/g, " $1").trim();
// const getStateKey = (formattedState: string): string => formattedState.replace(/\s+/g, "");
// const stateList = Object.keys(locationData);

type MultiSelectDropdownProps = {
  label: string;
  options: string[];
  selected: string[];
  onChange: (option: string) => void;
  placeholder: string;
};

function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
  placeholder,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !(ref.current as any).contains(event.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  const handleOptionClick = (option: string) => {
    onChange(option);
    setOpen(false); // close dropdown after selecting
  };

  return (
    <div className="relative w-full min-w-[120px]" ref={ref}>
      <label className="block text-xs mb-1 font-semibold text-black">
        {label}
      </label>
      <button
        type="button"
        className="border border-gray-200 bg-gray-50 rounded w-full text-left px-3 py-2 text-sm flex items-center justify-between focus:ring-1 cursor-pointer"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={selected.length === 0 ? "text-gray-400" : ""}>
          {selected.length === 0
            ? placeholder
            : selected.length <= 2
            ? selected.join(", ")
            : `${selected.length} selected`}
        </span>
        <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
      </button>
      {open && (
        <div className="absolute z-40 mt-1 left-0 w-full bg-white border border-gray-200 rounded shadow-lg max-h-48 overflow-auto animate-fade-in">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 px-3 py-2 text-xs cursor-pointer hover:bg-gray-50"
              onClick={() => handleOptionClick(option)}
            >
              <input
                type="checkbox"
                className="accent-blue-600"
                checked={selected.includes(option)}
                onChange={() => handleOptionClick(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

const Requirements: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data, loading, error, totalCount } = useSelector(
    (state: RootState) => state.requirements
  );
  const { user, token } = useSelector(selectAuth);
  const [sortOption, setSortOption] = useState<string>("newToOld");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [deletingRequirementId, setDeletingRequirementId] = useState<
    string | null
  >(null);
  // Use pending state for the filter UI
  const [pendingFilter, setPendingFilter] = useState<FilterState>({
    brands: [] as string[],
    fuelTypes: [] as string[],
    transmissions: [] as string[],
    city: [] as string[],
    priceMin: "",
    priceMax: "",
    // state: "",
    // city: ,
    userType: "",
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
  });
  // Applied filter (triggers fetch)
  const [appliedFilter, setAppliedFilter] = useState<FilterState>({
    brands: [],
    priceMin: "",
    priceMax: "",
    fuelTypes: [],
    transmissions: [],
    // state: "",
    city: [] ,
    userType: "",
    dateFrom: null,
    dateTo: null,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // google car(brand, model, variant)
  const sheetId = import.meta.env.VITE_SHEET_ID;
  const carRange = "sheet2!A:Z";
  const apiKey = import.meta.env.VITE_API_KEY;
  const {
    data: carSheetData,
    // loading: carSheetLoading,
    // error: carSheetError,
  } = useGCarSheetData(sheetId, carRange, apiKey);

  // Build nested locationData object from Google Sheet
  const carDataObj = carSheetData.reduce((acc, item) => {
    // Clean up all keys: remove spaces + lowercase
    const normalizedItem = Object.fromEntries(
      Object.entries(item).map(([k, v]) => [k.trim().toLowerCase(), v])
    );

    const brand = normalizedItem["brand"];

    if (!brand) return acc;
    if (!acc[brand]) acc[brand] = {};

    return acc;
  }, {} as { [brand: string]: { [model: string]: Set<string> } });

  const carDataNested = Object.fromEntries(
    Object.entries(carDataObj).map(([brand]) => [brand])
  );

  useEffect(() => {
    // Prepare filter object as required by backend
    const filter: Record<string, any> = {};
    if (appliedFilter.brands.length) filter.brands = appliedFilter.brands;
    if (appliedFilter.priceMin !== "" && appliedFilter.priceMax !== "")
      filter.priceRange = {
        min: Number(appliedFilter.priceMin),
        max: Number(appliedFilter.priceMax),
      };
    if (appliedFilter.fuelTypes.length)
      filter.fuelTypes = appliedFilter.fuelTypes;
    if (appliedFilter.transmissions.length)
      filter.transmissions = appliedFilter.transmissions;
    const location = appliedFilter.city[0]
      ? { city: appliedFilter.city[0] }
      : undefined;
    if (appliedFilter.dateFrom || appliedFilter.dateTo) {
      filter.createdAt = {};
      if (appliedFilter.dateFrom)
        filter.createdAt.$gte = appliedFilter.dateFrom;
      if (appliedFilter.dateTo) filter.createdAt.$lte = appliedFilter.dateTo;
    }
    const params: Record<string, any> = {
      userId: user?.id,
      page: 1,
      limit: 20,
      sort: sortOption === "oldToNew" ? "oldToNew" : "newToOld",
      ...(Object.keys(filter).length ? { filter } : {}),
      ...(location ? { location } : {}),
      ...(appliedFilter.userType ? { userType: appliedFilter.userType } : {}),
    };
    dispatch(fetchAllRequirements(params));
  }, [dispatch, sortOption, user?.id, appliedFilter]);

  const handleContact = async (requirement: Requirement) => {
    if (!user || !token) {
      dispatch(openLogin());
      return;
    }

    const requirementId = requirement.requirementId || requirement.id;
    if (!requirementId) {
      console.error("Requirement ID not found");
      return;
    }

    // Create enquiry
    try {
      await dispatch(
        createRequirementEnquiry({
          userId: user.id,
          requirementId: requirementId,
        })
      ).unwrap();
    } catch (err: any) {
      console.error("Failed to create enquiry:", err);
      // Still open the phone dialer even if enquiry creation fails
    }

    // Open phone dialer
    const phoneNumber = requirement.user?.mobileNumber;
    if (phoneNumber) {
      window.location.href = `tel:+91${phoneNumber}`;
    } else {
      alert("Phone number not available");
    }
  };

  const handleDelete = async (requirementId: string) => {
    if (!user || !token) {
      dispatch(openLogin());
      return;
    }

    setDeletingRequirementId(requirementId);

    try {
      await dispatch(
        deleteRequirement({
          userId: user.id,
          requirementId: requirementId,
        })
      ).unwrap();

      setDeletingRequirementId(null);

      // Refresh the requirements list
      dispatch(
        fetchAllRequirements({
          userId: user.id,
          page: 1,
          limit: 20,
          sort: sortOption === "oldToNew" ? "oldToNew" : "newToOld",
        })
      );
    } catch (err: any) {
      console.error("Failed to delete requirement:", err);
      setDeletingRequirementId(null);
    }
  };

  const handleToggleExpand = (requirementId: string) => {
    setExpandedCardId(expandedCardId === requirementId ? null : requirementId);
  };

  // Used/triggered only by "Apply" button
  const handleApplyFilters = () => {
    setAppliedFilter({ ...pendingFilter });
    setShowFilters(false); // Optionally close on apply
  };

  const handleResetFilters = () => {
    const reset: FilterState = {
      brands: [],
      priceMin: "",
      priceMax: "",
      fuelTypes: [],
      transmissions: [],
      // state: "",
      city: [],
      userType: "",
      dateFrom: null,
      dateTo: null,
    };
    setPendingFilter(reset);
    setAppliedFilter(reset);
  };

  // Multi select helper (typed)
  type MultiSelectFilterKey =
    | "brands"
    | "fuelTypes"
    | "transmissions"
    | "city";
  const toggleMultiSelect = (field: MultiSelectFilterKey, value: string) => {
    setPendingFilter((prev) => {
      const arr: string[] = prev[field];
      return arr.includes(value)
        ? { ...prev, [field]: arr.filter((v: string) => v !== value) }
        : { ...prev, [field]: [...arr, value] };
    });
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto my-12">
        <div className="text-center">Loading requirements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto my-12">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto my-12 transition-all duration-300">
      {/* HEADER BUTTONS */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5">
        <div className="flex items-center justify-between lg:flex-none">
          <h2 className="text-xl sm:text-2xl font-semibold">Requirements</h2>
          <p className="text-sm text-gray-500">Total: {totalCount}</p>
        </div>
        <div className="flex items-center flex-wrap gap-1.5 lg:gap-3 min-w-0">
          <button
            onClick={() => {
              if (!user || !token) dispatch(openLogin());
              else navigate("/create-requirement");
            }}
            className="text-xs lg:text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 hidden lg:block" />
            Post Requirement
          </button>

          <button
            onClick={() => setShowFilters((f) => !f)}
            className="text-xs lg:text-sm border rounded-md px-4 py-2 hover:bg-gray-100 transition flex items-center gap-2 cursor-pointer"
          >
            {showFilters ? "Hide Filter" : "Show Filter"}
          </button>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              className="text-xs lg:text-sm border rounded-md px-4 py-2 hover:bg-gray-100 transition flex items-center gap-2 min-w-[140px] cursor-pointer"
              onClick={() => setSortDropdownOpen((v) => !v)}
              type="button"
            >
              <span>
                Sort:{" "}
                {sortOption === "oldToNew" ? "Oldest First" : "Newest First"}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {sortDropdownOpen && (
              <div className="absolute mt-1 w-full bg-white border rounded shadow z-30 animate-fade-in">
                <button
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-t cursor-pointer ${
                    sortOption === "newToOld" ? "font-semibold" : ""
                  }`}
                  onClick={() => {
                    setSortOption("newToOld");
                    setSortDropdownOpen(false);
                  }}
                  type="button"
                >
                  Newest First
                </button>
                <button
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-b cursor-pointer ${
                    sortOption === "oldToNew" ? "font-semibold" : ""
                  }`}
                  onClick={() => {
                    setSortOption("oldToNew");
                    setSortDropdownOpen(false);
                  }}
                  type="button"
                >
                  Oldest First
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🧱 MAIN CONTENT LAYOUT */}
      <div
        className={`flex flex-col-reverse lg:flex-row gap-6 transition-all duration-300 ${
          showFilters ? "lg:gap-10" : "lg:gap-0"
        }`}
      >
        {/* 🧩 CARD GRID */}
        <div
          className={`flex-1 transition-all duration-300 ${
            showFilters ? "lg:w-3/4" : "lg:w-full"
          }`}
        >
          {data.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No requirements found.</p>
              <p className="text-sm mt-2">Be the first to post one!</p>
            </div>
          ) : (
            <div
              className={`grid gap-5 transition-all duration-300 ${
                showFilters
                  ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
                  : "sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
              }`}
            >
              {data
                .filter((item: Requirement) => {
                  const itemId = item.requirementId || item.id || "";
                  return itemId !== deletingRequirementId;
                })
                .map((item: Requirement) => {
                  const cardId = item.requirementId || item.id || "";
                  const isOwner = user?.id === item.user?.id;
                  return (
                    <RequirementCard
                      key={cardId}
                      {...item}
                      onContact={handleContact}
                      onDelete={handleDelete}
                      isExpanded={expandedCardId === cardId}
                      onToggleExpand={() => handleToggleExpand(cardId)}
                      isOwner={isOwner}
                    />
                  );
                })}
            </div>
          )}
        </div>

        {/* 🎛️ FILTER PANEL (RIGHT SIDE) */}
        {showFilters && (
          <div className="w-full lg:w-1/4 bg-white rounded-xl border border-gray-200 shadow-sm h-fit lg:sticky top-20 p-5 animate-fade-in">
            <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-3">
              Filters
            </div>

            <div className="grid grid-cols-1 gap-4">
              <MultiSelectDropdown
                label="Brand"
                options={Object.keys(carDataNested).sort((a, b) =>
                  a.localeCompare(b)
                )}
                selected={pendingFilter.brands}
                onChange={(option) => toggleMultiSelect("brands", option)}
                placeholder="Select brands"
              />

              <MultiSelectDropdown
                label="Fuel Type"
                options={fuelOptions}
                selected={pendingFilter.fuelTypes}
                onChange={(option) => toggleMultiSelect("fuelTypes", option)}
                placeholder="Select fuel types"
              />

              <MultiSelectDropdown
                label="Transmission"
                options={transmissionOptions}
                selected={pendingFilter.transmissions}
                onChange={(option) =>
                  toggleMultiSelect("transmissions", option)
                }
                placeholder="Select transmissions"
              />

              <MultiSelectDropdown
                label="City"
                options={cityData}
                selected={pendingFilter.city || []}
                onChange={(option) => toggleMultiSelect("city", option)}
                placeholder="Select cities"
              />

              {/* <div>
              <label className="block text-xs mb-1 font-semibold text-gray-700">
                City
              </label>
              <select
                value={pendingFilter.city}
                onChange={(e) =>
                  setPendingFilter((f) => ({ ...f, city: e.target.value }))
                }
                className="border bg-gray-50 p-2 rounded w-full text-sm h-9"
              >
                <option value="">All Cities</option>
                {cityOptions.map((c) => (
                  <option value={c} key={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div> */}

              <div>
                <label className="block text-xs mb-1 font-semibold text-gray-700">
                  User Type
                </label>
                <select
                  value={pendingFilter.userType}
                  onChange={(e) =>
                    setPendingFilter((f) => ({
                      ...f,
                      userType: e.target.value,
                    }))
                  }
                  className="border bg-gray-50 p-2 rounded w-full text-sm h-9 cursor-pointer "
                >
                  <option value="">Any</option>
                  <option value="Owner">Owner</option>
                  <option value="Dealer">Dealer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs mb-1 font-semibold text-gray-700">
                  Price (₹)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={pendingFilter.priceMin}
                    onChange={(e) =>
                      setPendingFilter((f) => ({
                        ...f,
                        priceMin: e.target.value,
                      }))
                    }
                    className="border bg-gray-50 p-2 rounded w-full text-sm h-9"
                    placeholder="Min"
                  />
                  <span className="text-xs text-gray-400">-</span>
                  <input
                    type="number"
                    min={0}
                    value={pendingFilter.priceMax}
                    onChange={(e) =>
                      setPendingFilter((f) => ({
                        ...f,
                        priceMax: e.target.value,
                      }))
                    }
                    className="border bg-gray-50 p-2 rounded w-full text-sm h-9"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs mb-1 font-semibold text-gray-700">
                  Created Date Range
                </label>
                <DatePicker
                  selectsRange
                  startDate={pendingFilter.dateFrom}
                  endDate={pendingFilter.dateTo}
                  onChange={([from, to]: [Date | null, Date | null]) =>
                    setPendingFilter((f) => ({
                      ...f,
                      dateFrom: from,
                      dateTo: to,
                    }))
                  }
                  isClearable={true}
                  className="border bg-gray-50 rounded px-3 h-9 text-sm w-full"
                  calendarClassName="rounded-xl border shadow-lg"
                />
              </div>

              <div className="flex items-center justify-between mt-4">
                <button
                  className="text-sm bg-red-600 text-white px-5 h-9 rounded-md hover:bg-red-700 transition cursor-pointer"
                  onClick={handleApplyFilters}
                >
                  Apply
                </button>
                <button
                  className="text-sm bg-gray-200 text-gray-800 px-5 h-9 rounded-md hover:bg-gray-300 transition cursor-pointer"
                  onClick={handleResetFilters}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requirements;