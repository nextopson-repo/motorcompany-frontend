import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";
import CarCard from "./CarCard";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { updateSelectedFilter } from "../store/slices/carSlice";
import CarCardSkeleton from "./CarCardSkeleton";

const bodyTypes = [
  { name: "Hatchback", vehicles: 26, img: "/CarCategories/hatchback.png" },
  { name: "SUV", vehicles: 26, img: "/CarCategories/suv.png" },
  { name: "Sedan Car", vehicles: 26, img: "/CarCategories/sedan.png" },
  { name: "MUV", vehicles: 125, img: "/CarCategories/muv.png" },
  { name: "Convertible", vehicles: 132, img: "/CarCategories/convertable.png" },
  { name: "Coupe", vehicles: 26, img: "/CarCategories/coupe1.png" },
];

const HeroCategories: React.FC = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  // const cars = useSelector((state: RootState) => state.cars.cars);
  const { cars, loading } = useSelector((state: RootState) => state.cars);

  const handleCityClick = (type: string) => {
    dispatch(updateSelectedFilter({ key: "bodyType", value: [type] }));
    Navigate("/buy-car");
  };

  return (
    <section className="w-full mt-2 md:mt-6">
      {/* Categories */}
      <div className="text-center py-4">
        <p className="text-xs md:text-xs text-[#EE1422] font-semibold mb-2 md:mb-4 flex items-center justify-center gap-5">
          <span className="w-8 md:w-10 h-[1px] md:h-[1.5px] bg-[#EE1422]"></span>
          Categories
          <span className="w-8 md:w-10 h-[1px] md:h-[1.5px] bg-[#EE1422]"></span>
        </p>
        <h2 className="text-[17px] md:text-[1.6rem] tracking-wide font-bold md:font-semibold ">
          Explore by Body Type
        </h2>
      </div>

      {/* Body Type Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 px-2 sm:px-12 lg:px-18">
        {bodyTypes.map((type) => (
          <div
            key={type.name}
            className="flex flex-col items-center text-center justify-between hover:border-[#EE1422] hover:shadow-lg transition-all p-2 rounded-lg bg-white cursor-pointer"
            onClick={() => handleCityClick(type.name)}
          >
            <img
              src={type.img}
              alt={type.name}
              className="w-auto h-auto sm:w-28 sm:h-16 md:w-32 md:h-18 object-contain mb-2"
            />
            <span className="flex flex-col items-center">
              <p className="font-semibold text-xs md:text-xs">{type.name}</p>
              <span className="text-gray-500 text-[10px] md:text-[10px]">
                {type.vehicles} Vehicles
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* Recently Added Cars */}
      <section className="max-w-7xl mx-auto px-2 md:px-8 py-10 relative">
        {/* Top Heading */}
        <div className="text-[9px] md:text-sm text-center mb-3 md:mb-5 mx-auto">
          <p className="text-[#EE1422] text-xs md:text-xs font-semibold mb-2 md:mb-5 flex items-center justify-center gap-3 md:gap-5">
            <span className="w-8 md:w-10 h-[1px] md:h-[1.5px] bg-[#EE1422]"></span>
            Recently Added Cars
            <span className="w-8 md:w-10 h-[1px] md:h-[1.5px] bg-[#EE1422]"></span>
          </p>
          <h2 className="text-[17px] md:text-2xl font-bold md:font-semibold">
            The Latest Added and viewed cars
          </h2>
        </div>

        {/* Slider */}
        <Swiper
          spaceBetween={32}
          slidesPerView={1.2}
          breakpoints={{
            0: { slidesPerView: 1.2, spaceBetween: 24 },
            640: { slidesPerView: 2.5, spaceBetween: 24 },
            1024: { slidesPerView: 3.3 },
            1100: { slidesPerView: 4 },
            1280: { slidesPerView: 4 },
          }}
          modules={[Navigation]}
          navigation={{
            prevEl: ".custom-prev2",
            nextEl: ".custom-next2",
          }}
        >
          {loading ? (
            Array(4)
              .fill(0)
              .map((_, i) => (
                <SwiperSlide key={i}>
                  <CarCardSkeleton />
                </SwiperSlide>
              ))
          ) : cars && cars.length > 0 ? (
            cars.map((car) => (
              <SwiperSlide key={car.id} className="pb-4 md:pb-5">
                <CarCard car={car} />
              </SwiperSlide>
            ))
          ) : (
            <p>No featured cars found.</p>
          )}
        </Swiper>

        {/* Custom Navigation Buttons (now with class selectors) */}
        <button className="hidden lg:block custom-prev2 absolute left-[2.5%] md:left-4 top-[55%] sm:top-1/2 -translate-y-1/2 z-30 bg-gray-900 text-white shadow-lg p-2 rounded-full hover:bg-gray-700 cursor-pointer">
          <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
        </button>
        <button className="hidden lg:block custom-next2 absolute right-[2.5%] md:right-2 top-[55%] sm:top-1/2 -translate-y-1/2 z-30 bg-gray-900 text-white shadow-lg p-2 rounded-full hover:bg-gray-700 cursor-pointer">
          <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
        </button>

        {/* Bottom Button */}
        <div className="flex justify-center">
          <button
            className="w-[160px] md:w-[16.5rem] text-sm md:text-sm bg-[#EE1422] text-white font-[500] py-[6px] md:py-2 rounded-sm hover:bg-[#EE1422]/80 transition cursor-pointer"
            onClick={() => {
              Navigate("/buy-car");
            }}
          >
            View All
          </button>
        </div>
      </section>
    </section>
  );
};

export default HeroCategories;
