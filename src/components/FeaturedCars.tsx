import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";
import CarCard from "./CarCard";
import { carsData } from "../data/cars";

const FeaturedCars: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto md:px-4 py-10 -mt-4 relative font-montserrat">
      {/* Top Heading */}
      <div className="text-sm text-center mb-10 mx-auto">
        <p className="text-[#EE1422] font-semibold mb-5 flex items-center justify-center gap-5">
          <span className="w-10 h-[1.5px] bg-[#EE1422]"></span>
          Featured Cars
          <span className="w-10 h-[1.5px] bg-[#EE1422]"></span>
        </p>
        <h2 className="text-xl md:text-2xl font-semibold">
          The Most Searched And Liked Cars
        </h2>
      </div>

      {/* Slider */}
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3.7 },
          1280: { slidesPerView: 4 },
        }}
        modules={[Navigation]}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
      >
        {carsData.map((car) => (
          <SwiperSlide key={car.id} className="pb-6">
            <CarCard car={car}/>
          </SwiperSlide>
        ))}

        {/* Fade gradient on right */}
        {/* <div className="hidden md:block xl:hidden h-full w-30 absolute top-0 right-0 bg-gradient-to-r from-white/0 to-white z-10 pointer-events-none"></div> */}
      </Swiper>

      {/* Custom Navigation Buttons (now with class selectors) */}
      <button
        className="custom-prev absolute left-[3%] md:left-4 top-[55%] sm:top-1/2 -translate-y-1/2 z-30 bg-gray-900 text-white shadow-lg p-2 rounded-full hover:bg-gray-700 cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4 md:h-6 md:w-6"/>
      </button>
      <button
        className="custom-next absolute right-[3%] md:right-2 top-[55%] sm:top-1/2 -translate-y-1/2 z-30 bg-gray-900 text-white shadow-lg p-2 rounded-full hover:bg-gray-700 cursor-pointer"
      >
        <ChevronRight className="h-4 w-4 md:h-6 md:w-6"/>
      </button>

      {/* Bottom Button */}
      <div className="flex justify-center">
        <button className="w-xs text-sm md:text-md bg-[#EE1422] text-white font-semibold py-2 rounded hover:bg-[#EE1422]/80 transition cursor-pointer">
          View All
        </button>
      </div>
    </section>
  );
};

export default FeaturedCars;
