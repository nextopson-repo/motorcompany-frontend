import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";
import CarCard from "./CarCard";
import { carsData } from "../data/cars";

const bodyTypes = [
  { name: "Hatchback", vehicles: 26, img: "/CarCategories/hatchback.png" },
  { name: "SUV", vehicles: 26, img: "/CarCategories/suv.png" },
  { name: "Sedan Car", vehicles: 26, img: "/CarCategories/sedan.png" },
  { name: "MUV", vehicles: 125, img: "/CarCategories/muv.png" },
  { name: "Convertible", vehicles: 132, img: "/CarCategories/convertable.png" },
  { name: "Mini Van", vehicles: 26, img: "/CarCategories/mini van.png" },
];

const HeroCategories: React.FC = () => {
  return (
    <section className="w-full font-montserrat my-6">
      {/* Categories */}
      <div className="text-center py-4">
        <p className="text-xs text-[#EE1422] font-semibold mb-4 flex items-center justify-center gap-5">
          <span className="w-10 h-[1.5px] bg-[#EE1422]"></span>
          Categories
          <span className="w-10 h-[1.5px] bg-[#EE1422]"></span>
        </p>
        <h2 className="text-xl md:text-2xl font-semibold ">
          Explore by Body Type
        </h2>
      </div>

      {/* Body Type Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 px-4 md:px-12">
        {bodyTypes.map((type) => (
          <div
            key={type.name}
            className="flex flex-col items-center text-center  border border-white/0 hover:border-[#EE1422] hover:shadow-lg transition-all p-2 rounded-lg bg-white cursor-pointer"
          >
            <img
              src={type.img}
              alt={type.name}
              className="w-28 h-16 object-contain mb-2"
            />
            <p className="font-semibold text-sm md:text-md">{type.name}</p>
            <span className="text-gray-500 text-xs">
              {type.vehicles} Vehicles
            </span>
          </div>
        ))}
      </div>

        {/* Recently Added Cars */}
      <section className="max-w-7xl mx-auto md:px-4 py-10 -mt-4 relative font-montserrat">
        {/* Top Heading */}
        <div className="text-sm text-center mb-10 mx-auto">
          <p className="text-[#EE1422] font-semibold mb-5 flex items-center justify-center gap-5">
            <span className="w-10 h-[1.2px] bg-[#EE1422]"></span>
            Recently Added Cars
            <span className="w-10 h-[1.2px] bg-[#EE1422]"></span>
          </p>
          <h2 className="text-xl md:text-2xl font-semibold">
            The Latest Added and viewed cars
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
            prevEl: ".custom-prev2",
            nextEl: ".custom-next2",
          }}
        >
          {carsData.map((car) => (
            <SwiperSlide key={car.id} className="pb-6">
              <CarCard car={car} />
            </SwiperSlide>
          ))}

         </Swiper>

        {/* Custom Navigation Buttons (now with class selectors) */}
        <button className="custom-prev2 absolute left-[3%] md:left-4 top-[55%] sm:top-1/2 -translate-y-1/2 z-30 bg-gray-900 text-white shadow-lg p-2 rounded-full hover:bg-gray-700 cursor-pointer">
          <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
        </button>
        <button className="custom-next2 absolute right-[3%] md:right-2 top-[55%] sm:top-1/2 -translate-y-1/2 z-30 bg-gray-900 text-white shadow-lg p-2 rounded-full hover:bg-gray-700 cursor-pointer">
          <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
        </button>

        {/* Bottom Button */}
        <div className="flex justify-center">
          <button className="w-xs text-sm md:text-md bg-[#EE1422] text-white font-semibold py-2 rounded hover:bg-[#EE1422]/80 transition cursor-pointer">
            View All
          </button>
        </div>
      </section>
    </section>
  );
};

export default HeroCategories;
