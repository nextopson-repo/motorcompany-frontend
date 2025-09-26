import React from "react";
import { Search } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { BiCaretDown } from "react-icons/bi";

const heroImages = ["/Hero-car.png", "/hero-car-2.jpg", "/hero-car-3.jpg"];

const Hero: React.FC = () => {
  return (
    <div
      className="w-full md:max-w-7xl px-2 md:px-0"
    >
      {/* mobile search bar */}
      <div className="block lg:hidden my-2">
        <div className="flex gap-2 items-center justify-between rounded-sm shadow-md">
          {/* Search input with animated last word */}
          <div className="flex justify-between items-center w-full bg-white rounded-sm px-3 py-2 relative ">
            <div className="flex items-center">
              <Search className="text-gray-400 mr-2 h-4 w-4" />
              <span className="text-gray-400 text-xs truncate">
                Search Car by Model
              </span>
              <input
                type="text"
                className="absolute left-9 top-0 md:w-[90%] h-full opacity-0 cursor-text z-20"
              />
            </div>
          </div>
          <button className="text-white text-xs flex items-center font-semibold bg-[#ED1D2B] px-3 py-2 gap-2 rounded-xs ">
            Model
            <span>
              <BiCaretDown className="text-white text-xs" />
            </span>
          </button>
        </div>
      </div>

      {/* Hero Slider */}
      <div className="relative h-[120px] md:min-h-[380px] md:m-6 rounded-sm md:rounded-lg overflow-hidden">
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
                className="h-full md:h-[400px] flex items-center bg-cover bg-center"
                style={{ backgroundImage: `url(${img})` }}
              >
                <div className="relative z-10 text-white px-4 md:px-0 w-[70%] md:max-w-xl -mt-6 md:-mt-24 md:pl-8">
                  <h1 className="text-xs md:text-3xl font-semibold mb-2 md:mb-4 leading-tight tracking-wide drop-shadow-lg">
                    Turn Your Car into Cash — Fast, Fair & Hassle-Free
                  </h1>
                  <p className="text-[8px] md:text-sm font-normal leading-tight tracking-tight drop-shadow-md md:font-roboto pr-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor
                    <span className="hidden md:block">
                      incididunt ut labore et dolore magna aliqua. Ut enim ad
                      minim veniam, quis nostrud exercitation ullamco laboris
                      nisi ut aliquip ex ea commodo consequat.
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
            <button className="text-xs px-8 py-2 rounded-l-sm hover:text-white hover:bg-[#EE1422]">
              By Model
            </button>
            <button className="text-xs px-8 py-2 rounded-r-sm  hover:text-white hover:bg-[#EE1422]">
              By Budget
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search input with animated last word */}
          <div className="flex justify-between items-center w-full bg-white rounded-sm px-3 py-2 relative ">
            <div className="flex items-center">
              <Search className="text-gray-400 mr-2" size={16} />
              <span className="text-gray-400 text-xs md:text-xs whitespace-nowrap">
                Search Car by Model
              </span>
              <input
                type="text"
                className="absolute left-9 top-0 md:w-[90%] h-full opacity-0 cursor-text z-20"
              />
            </div>
            <span>
              <BiCaretDown className="text-black text-xs md:text-xs whitespace-nowrap" />
            </span>
          </div>
          <button className="text-white font-semibold bg-gray-900 px-8 py-[7px] rounded-sm cursor-pointer hover:bg-gray-700 ">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
