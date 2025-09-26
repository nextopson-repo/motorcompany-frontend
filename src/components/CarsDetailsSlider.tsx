import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import CarCard from "./CarCard"; // your CarCard component

interface CarsDetailsSlider {
    carsData: any[];
  }

  const CarsDetailsSlider: React.FC<CarsDetailsSlider> = ({ carsData }) => {
  return (
    <div className="w-full pb-2">
      <Swiper
        modules={[ Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1.2}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 1 }, // Mobile
          768: { slidesPerView: 3.5 }, // Tablet
          1024: { slidesPerView: 3.9 }, // Small desktop
          1280: { slidesPerView: 5 }, // Large desktop
        }}
        loop={true}
      >
        {carsData.map((car, index) => (
          <SwiperSlide key={index} className="py-2">
            <CarCard car={car} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CarsDetailsSlider;
