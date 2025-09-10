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
    <div className="w-full md:max-w-7xl font-montserrat">
      {/* Hero Slider */}
      <div className="relative h-auto lg:min-h-[350px] md:m-6 rounded-lg overflow-hidden">
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
                className="h-screen md:h-[400px] flex items-center bg-cover bg-center"
                style={{ backgroundImage: `url(${img})` }}
              >
                <div className="relative z-10 text-white px-3 md:px-6 w-[80%] md:max-w-xl md:-mt-24">
                  <h1 className="text-2xl md:text-3xl font-semibold mb-4 leading-tight drop-shadow-lg">
                    Turn Your Car into Cash — Fast, Fair & Hassle-Free
                  </h1>
                  <p className="text-sm md:text-md font-light leading-tight drop-shadow-md">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </div>
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Search Bar */}
      <div className="relative z-20 -mt-28 ml-12 max-w-xs xs:max-w-md sm:max-w-xl md:max-w-2xl bg-white/95 rounded-lg p-4 md:p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm md:text-xl text-center sm:text-left">
            Lets Find the perfect car for you
          </p>
          <div className="border-[1px] border-gray-200 bg-white rounded-md ">
            <button className="text-xs px-4 py-2 rounded-l-md hover:text-white hover:bg-[#EE1422]">
              By Model
            </button>
            <button className="text-xs px-4 py-2 rounded-r-md  hover:text-white hover:bg-[#EE1422]">
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
              <BiCaretDown className="text-gray-400 text-xs md:text-xs whitespace-nowrap" />
            </span>
          </div>
          <button className="text-white font-semibold bg-gray-900 px-6 py-[7px] rounded-sm cursor-pointer hover:bg-gray-700 ">
            Search
          </button>
        </div>
      </div>

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto mt-16 mb-6">
        <div className="group flex items-center justify-between bg-white text-black rounded-sm shadow-md p-6 cursor-pointer border border-gray-200 transition hover:bg-red-500 hover:text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-gray-300 p-1 bg-white transition group-hover:border-white group-hover:bg-red-500">
              <span className="border-2 border-gray-300 rounded-full p-2 transition group-hover:border-white group-hover:bg-white">
                <Car className="w-6 h-6 text-gray-700 transition group-hover:text-red-500" />
              </span>
            </div>
            <div className="px-4">
              <h3 className="text-lg font-semibold transition group-hover:text-white">
                Want to Buy a New Car ?
              </h3>
              <p className="text-sm text-gray-500 mt-1 transition group-hover:text-white">
                4000+ Cars Available | 120+ Cities Availability | Verified
                Pre-Owned Cars
              </p>
            </div>
          </div>
          <span className="rounded-full bg-gray-100 p-1 transition group-hover:bg-white">
            <ChevronRight
              size={24}
              className="text-gray-700 transition group-hover:text-red-500"
            />
          </span>
        </div>

        <div className="group flex items-center justify-between bg-white text-black rounded-sm shadow-md p-6 cursor-pointer border border-gray-200 transition hover:bg-red-500 hover:text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-gray-300 p-4 transition group-hover:border-white group-hover:bg-red-500">
              <span className="border-2 border-gray-300 rounded-full p-1 transition group-hover:border-white group-hover:bg-white">
                <DollarSign className="w-8 h-8 text-gray-700 transition group-hover:text-red-500" />
              </span>
            </div>
            <div className="px-4">
              <h3 className="text-lg font-semibold transition group-hover:text-white">
                Want to Sell your Car ?
              </h3>
              <p className="text-sm text-gray-500 mt-1 transition group-hover:text-white">
                4000+ Cars Available | 120+ Cities Availability | Verified
                Pre-Owned Cars
              </p>
            </div>
          </div>
          <span className="rounded-full bg-gray-100 p-1 transition group-hover:bg-white">
            <ChevronRight
              size={24}
              className="text-gray-700 transition group-hover:text-red-500"
            />
          </span>
        </div>
      </div> */}
    </div>
  );
};

export default Hero;
