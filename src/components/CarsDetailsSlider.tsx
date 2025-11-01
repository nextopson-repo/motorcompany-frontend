import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import CarCard from "./CarCard";

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
          1280: { slidesPerView: 4, spaceBetween: 32 },
          1140: { slidesPerView: 4, spaceBetween: 32 },
          1024: { slidesPerView: 3.3, spaceBetween: 26 },
          640: { slidesPerView: 2.5, spaceBetween: 20 },
          475: { slidesPerView: 1.2, spaceBetween: 20 },
        }}
        loop={true}
      >
        {carsData.map((car, index) => (
              <SwiperSlide key={index} className="py-2 mx-0.5">
                <CarCard car={car} />
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
};

export default CarsDetailsSlider;
