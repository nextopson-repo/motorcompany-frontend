import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";
import CarCard from "./CarCard";
import { carsData } from "../data/cars";

const FeaturedCars: React.FC = () => {

  const carData = carsData;

  return (
    <section className="max-w-7xl mx-auto px-2 md:px-8 py-6 md:py-14 relative">
      {/* Top Heading */}
      <div className="text-xs text-center mb-5 mx-auto">
        <p className="text-[#EE1422]  text-[9px] md:text-xs font-bold mb-3 flex items-center justify-center gap-2 md:gap-5">
          <span className="w-7 md:w-10 h-[1px] md:h-[1px] bg-[#EE1422]"></span>
          Featured Cars
          <span className="w-7 md:w-10 h-[1px] md:h-[1px] bg-[#EE1422]"></span>
        </p>
        <h2 className="text-xs md:text-2xl font-bold md:font-bold">
          The Most Searched And Liked Cars
        </h2>
      </div>

      {/* Slider */}
      <Swiper
        spaceBetween={34}
        slidesPerView={1.5}
        breakpoints={{
          1280: { slidesPerView: 4 },
          1024: { slidesPerView: 3.9 },
          640: { slidesPerView: 2.5 },
          475: { slidesPerView: 1.5,
            spaceBetween: 24,
           },
          0: { slidesPerView: 1.5,
            spaceBetween: 24,
           },
        }}
        modules={[Navigation]}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
      >
        {carData.map((car) => (
          <SwiperSlide key={car.id} className="pb-4 md:pb-5">
            <CarCard car={car} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons (now with class selectors) */}
      <button className="hidden lg:block custom-prev absolute  left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 bg-gray-900 text-white shadow-lg p-2 rounded-full hover:bg-gray-700 cursor-pointer">
        <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
      </button>
      <button className="hidden lg:block custom-next absolute  right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 bg-gray-900 text-white shadow-lg p-2 rounded-full hover:bg-gray-700 cursor-pointer">
        <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
      </button>

      {/* Bottom Button */}
      <div className="flex justify-center">
        <button className="w-[150px] md:w-[16.5rem] text-xs md:text-sm bg-[#EE1422] text-white font-[500] py-[6px] md:py-2 rounded-sm hover:bg-[#EE1422]/80 transition cursor-pointer">
          View All
        </button>
      </div>
    </section>
  ); 
};

export default FeaturedCars;
