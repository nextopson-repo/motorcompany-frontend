import { Search } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { BiCaretDown } from "react-icons/bi";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { fetchCars, updateSelectedFilter } from "../store/slices/carSlice";
import { useNavigate } from "react-router-dom";
import { setSearchTerm } from "../store/slices/savedSlice";
const heroImages = ["/Hero-car.png", "/hero-car-2.jpg", "/hero-car-3.jpg"];

const Hero: React.FC = () => {
  const selectedFilters = useSelector((state: RootState) => state.cars.selectedFilters);
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useState<"model" | "budget">("model");
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    if (searchMode === "model") {
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
              priceRange: [0, maxPrice],
            },
          })
        );
      }
    }
    navigate("/buy-car");
  };

  return (
    <div className="w-full lg:max-w-7xl px-2 lg:px-0">
      {/* mobile search bar */}
      <div className="block lg:hidden my-2 py-1">
        <div
          className="flex gap-2 items-center justify-between rounded-sm"
          style={{
            boxShadow: "0px 1px 20px 0px rgba(0, 0, 0, 0.15)",
          }}
        >
          {/* Search input with animated last word */}
          <div className="flex justify-between items-center w-full bg-white rounded-sm px-3 py-[10px] relative ">
            <div className="flex items-center">
              <Search className="text-gray-400 mr-2 h-5 w-5" />
              <span className="text-gray-400 text-sm truncate">
                Search Car by Model
              </span>
              <input
                type="text"
                className="absolute left-9 top-0 md:w-[90%] h-full opacity-0 cursor-text z-20"
              />
            </div>
          </div>
          <button className="text-white text-sm flex items-center font-semibold bg-[#ED1D2B] px-3 py-[10px] gap-2 rounded-xs ">
            Model
            <span>
              <BiCaretDown className="text-white text-sm" />
            </span>
          </button>
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
      <div className="hidden lg:block relative z-20 -mt-28 ml-14 max-w-xs xs:max-w-md sm:max-w-xl md:max-w-2xl bg-white/95 rounded-lg p-4 md:p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm md:text-[1.20rem] text-center sm:text-left">
            Lets Find the perfect car for you
          </p>
          <div className="border-[1px] border-gray-200 bg-white rounded-md ">
            <button
              className={`text-xs px-8 py-2 rounded-l-sm ${
                searchMode === "model"
                  ? "bg-[#EE1422] text-white"
                  : "hover:text-white hover:bg-[#EE1422]"
              }`}
              onClick={() => setSearchMode("model")}
            >
              By Model
            </button>
            <button
              className={`text-xs px-8 py-2 rounded-r-sm ${
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
          {/* Search input with animated last word */}
          <div className="flex justify-between items-center w-full bg-white rounded-sm px-3 py-2 relative ">
            <div className="flex items-center">
              <Search className="text-gray-400 mr-2" size={16} />
              <input
                type={searchMode === "budget" ? "number" : "text"}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  searchMode === "model"
                    ? "Search Car by Model"
                    : "Search Car by Budget"
                }
                className="absolute left-9 top-0 md:w-[90%] h-full z-20 px-2 text-sm"
              />
            </div>
            <span>
              <BiCaretDown className="text-black text-xs md:text-xs whitespace-nowrap" />
            </span>
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
