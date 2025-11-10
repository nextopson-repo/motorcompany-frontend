import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { BiCaretDown, BiCaretUp } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {
  fetchCars,
  setSearchTerm,
  updateSelectedFilter,
} from "../store/slices/carSlice";
import { useNavigate } from "react-router-dom";
const heroImages = ["/Hero-car.png", "/hero-car-2.jpg", "/hero-car-3.jpg"];
import { Search } from "lucide-react";
import useGCarSheetData from "../hooks/useGCarSheetData";

interface DropdownProps {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (v: string) => void;
}

function Dropdown({ placeholder, options, value, onChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options by search
  const filtered = options.filter((opt: string) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative font-[Inter]" ref={dropdownRef}>
      {/* Dropdown Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 text-sm bg-white cursor-pointer transition-all duration-200 ${
          isOpen ? "ring-2 ring-gray-400 border-[#EE1422]" : ""
        }`}
      >
        <span
          className={`text-xs truncate text-gray-700 ${
            !value ? "text-gray-400" : "text-gray-700"
          }`}
        >
          {value || placeholder}
        </span>
        <BiCaretDown
          className={`text-gray-500 text-base transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-48 overflow-y-auto animate-fadeIn">
          {/* Options */}
          {filtered.length > 0 ? (
            filtered.map((opt: string) => (
              <div
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-400/20 transition ${
                  opt === value ? "bg-gray-400/40 font-semibold" : ""
                }`}
              >
                {opt}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-400 text-xs text-center">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const Hero: React.FC = () => {
  const selectedFilters = useSelector(
    (state: RootState) => state.cars.selectedFilters
  );
  // const brandList = useSelector((state: RootState) => state.cars.filters.brand);
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useState<"brand" | "budget">("brand");
  const [query, setQuery] = useState("");

  // ⬇️ Add these right below
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedBrands, setSelectedBrands] = useState("");
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const budgetOptions = [
    { label: "50K - 2 Lakh", value: { min: 50000, max: 200000 } },
    { label: "2 Lakh - 5 Lakh", value: { min: 200000, max: 500000 } },
    { label: "5 Lakh - 10 Lakh", value: { min: 500000, max: 1000000 } },
    { label: "10 Lakh - 20 Lakh", value: { min: 1000000, max: 2000000 } },
    { label: "20 Lakh - 50 Lakh", value: { min: 2000000, max: 5000000 } },
    {
      label: "Above 50 Lakh",
      value: { min: 5000000, max: Number.MAX_SAFE_INTEGER },
    },
  ];

  const handleSearch = () => {
    if (!query.trim()) return;
    if (searchMode === "brand") {
      dispatch(setSearchTerm(query));
      dispatch(fetchCars({ searchTerm: query }));
    } else {
      const maxPrice = Number(query);
      if (!isNaN(maxPrice)) {
        dispatch(
          updateSelectedFilter({
            key: "priceRange",
            value: [0, maxPrice],
          })
        );
        dispatch(
          fetchCars({
            selectedFilters: {
              ...selectedFilters,
              priceRange: [50000, maxPrice],
            },
          })
        );
      }
    }
    navigate("/buy-car");
  };

  useEffect(() => {
    if (searchMode === "brand" && selectedBrands) {
      setQuery(selectedBrands);
    } else if (searchMode === "budget" && selectedBudget) {
      setQuery(selectedBudget);
    }
  }, [selectedBrands, selectedBudget, searchMode]);

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

  return (
    <div className="w-full lg:max-w-7xl px-2 lg:px-0">
      {/* Mobile Search Bar */}
      <div className="block lg:hidden my-2 py-1">
        <div
          className="flex gap-2 items-center justify-between rounded-sm"
          style={{
            boxShadow: "0px 1px 20px 0px rgba(0, 0, 0, 0.15)",
          }}
        >
          {/* Search Icon Button */}
          <button
            disabled={
              searchMode === "brand" ? !selectedBrands : !selectedBudget
            }
            onClick={() => {
              if (searchMode === "brand" && selectedBrands) {
                setQuery(selectedBrands);
              } else if (selectedBudget) {
                setQuery(selectedBudget);
              }
              handleSearch();
            }}
            className={`ml-2.5 h-4 w-4 flex items-center justify-center transition-colors duration-200 ${
              (searchMode === "brand" && selectedBrands) ||
              (searchMode === "budget" && selectedBudget)
                ? "text-gray-800 cursor-pointer" // 🔴 active
                : "text-gray-400 cursor-not-allowed" // 🩶 inactive
            }`}
          >
            <Search className="h-5 w-5" />
          </button>
          
          <div className="flex justify-between items-center w-full bg-white rounded-sm px-1 py-2.5 relative">
            <div
              className="flex items-center w-full cursor-pointer"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <span className="text-gray-600 text-sm truncate">
                {searchMode === "brand"
                  ? selectedBrands || "Select Brand"
                  : selectedBudget || "Select Budget"}
              </span>
            </div>
            <BiCaretDown
              className={`text-gray-400 ml-2 h-4 w-4 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>

          {/* Mode Toggle Button */}
          <button
            onClick={() => {
              setIsDropdownOpen(false);
              setSearchMode(searchMode === "brand" ? "budget" : "brand");
            }}
            className="text-white text-sm flex items-center font-semibold bg-[#ED1D2B] px-3 py-2.5 gap-2 rounded-sm transition-all duration-300 ease-in-out active:scale-95"
          >
            {/* Text label */}
            <span className="capitalize">
              {searchMode === "brand" ? "Brand" : "Budget"}
            </span>
            <span className="relative flex items-center justify-center w-5 h-5">
              {/* Animated icon switch */}
              <span
                className={`absolute transition-all duration-300 ${
                  searchMode === "brand"
                    ? "opacity-100 rotate-0"
                    : "opacity-0 rotate-90"
                }`}
              >
                <BiCaretDown className="w-4 h-4" />
              </span>
              <span
                className={`absolute transition-all duration-300 ${
                  searchMode === "budget"
                    ? "opacity-100 rotate-0"
                    : "opacity-0 -rotate-90"
                }`}
              >
                <BiCaretUp className="w-4 h-4" />
              </span>
            </span>
          </button>

          {/* Dropdown list */}
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 top-25.5 translate-0 mx-2 bg-white border border-gray-200 rounded-md shadow-md z-30 max-h-64 overflow-y-auto">
              {searchMode === "brand"
                ? Object.keys(carDataNested)
                    .sort((a, b) => a.localeCompare(b))
                    .map((brand) => (
                      <div
                        key={brand}
                        onClick={() => {
                          setSelectedBrands(brand);
                          setIsDropdownOpen(false);
                          // handleSearch();
                        }}
                        className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        {brand}
                      </div>
                    ))
                : budgetOptions.map((opt) => (
                    <div
                      key={opt.label}
                      onClick={() => {
                        setSelectedBudget(opt.label);
                        setIsDropdownOpen(false);
                        // handleSearch();
                      }}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      {opt.label}
                    </div>
                  ))}
            </div>
          )}
        </div>
      </div>

      {/* Hero Slider */}
      <div
        className="relative h-[150px] sm:min-h-[245px] lg:min-h-[380px] lg:m-6 rounded-sm md:rounded-lg overflow-hidden"
        style={{
          boxShadow: "0px 1px 20px 0px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Swiper
          modules={[Autoplay, EffectFade]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          effect="fade"
          className="w-full h-full relative"
        >
          {heroImages.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div
                className="h-full lg:h-[400px] flex items-center bg-cover bg-center"
                style={{ backgroundImage: `url(${img})` }}
              >
                <div className="relative z-10 text-white px-4 lg:px-0 w-[80%] sm:max-w-sm lg:max-w-xl lg:-mt-24 lg:pl-8">
                  <h1 className="text-[17px] sm:text-xl lg:text-3xl font-semibold mb-2 lg:mb-4 leading-tight tracking-wide drop-shadow-lg">
                    Turn Your Car into Cash — Fast, Fair & Hassle-Free
                  </h1>
                  <p className="text-xs sm:text-xs lg:text-sm font-normal leading-tight tracking-tight drop-shadow-md lg:font-roboto pr-4">
                    धिकCAR makes buying and selling cars easy, fast, and
                    reliable. Explore and find the perfect vehicle for your
                    needs.
                    <span className="hidden sm:inline">
                      Whether you want to sell your car or get your next ride,
                      DhikCar provides a seamless, secure experience and trusted
                      support every step of the way.
                    </span>
                  </p>
                </div>
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Search Bar */}
      <div className="hidden lg:block relative z-20 -mt-28 ml-14 max-w-xs xs:max-w-md sm:max-w-xl md:max-w-2xl bg-white/94 rounded-lg p-4 md:p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm md:text-[1.20rem] text-center sm:text-left">
            Lets Find the perfect car for you
          </p>
          <div className="border-px border-gray-200 bg-white rounded-md ">
            <button
              className={`text-xs px-8 py-2 rounded-l-sm ${
                searchMode === "brand"
                  ? "bg-[#EE1422] text-white"
                  : "hover:text-white hover:bg-[#EE1422]"
              }`}
              onClick={() => setSearchMode("brand")}
            >
              By Brand
            </button>
            <button
              className={`text-xs px-8 py-2 rounded-r-sm ml-px ${
                searchMode === "budget"
                  ? "bg-[#EE1422] text-white"
                  : "hover:text-white hover:bg-[#EE1422]"
              }`}
              onClick={() => setSearchMode("budget")}
            >
              By Budget
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search input + conditional dropdown */}
          <div className="w-full">
            {/* Conditional Dropdown */}
            {searchMode === "brand" ? (
              <Dropdown
                label="Brand"
                placeholder="Select Brands"
                options={Object.keys(carDataNested).sort((a, b) =>
                  a.localeCompare(b)
                )}
                value={selectedBrands}
                isOpen={isBrandsOpen}
                onToggle={() => setIsBrandsOpen(!isBrandsOpen)}
                onChange={(val: string) => {
                  setSelectedBrands(val);
                  setQuery(val); // ✅ sync dropdown with query
                }}
              />
            ) : (
              <Dropdown
                label="Budget Range"
                placeholder="Select Budget Range"
                options={budgetOptions.map((opt) => opt.label)}
                value={selectedBudget}
                isOpen={isBudgetOpen}
                onToggle={() => setIsBudgetOpen(!isBudgetOpen)}
                onChange={(label: string) => {
                  const selected = budgetOptions.find((b) => b.label === label);
                  if (selected) {
                    setSelectedBudget(label);
                    setQuery(`${selected.value.min}-${selected.value.max}`); // actual numeric range
                    // ya agar tu min/max alag alag bhejna chahta hai:
                    // setQuery(selected.value)
                  }
                }}
              />
            )}
          </div>

          <button
            className="text-white font-semibold bg-gray-900 px-8 py-[7px] rounded-sm cursor-pointer hover:bg-gray-700 "
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
