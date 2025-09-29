import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";

const BrandLogoCards: React.FC = () => {
  const brandLogos = [
    {
      title: "Tata",
      logo: "/CarsLogo/tata-motors.png",
      description: "120 Cars Available",
    },
    {
      title: "Honda",
      logo: "/CarsLogo/honda.png",
      description: "120 Cars Available",
    },
    {
      title: "Mahindra",
      logo: "/CarsLogo/mahindra.png",
      description: "120 Cars Available",
    },
    {
      title: "Hyundai",
      logo: "/CarsLogo/hyundai.png",
      description: "120 Cars Available",
    },
    {
      title: "Ford",
      logo: "/CarsLogo/ford.png",
      description: "120 Cars Available",
    },
    {
      title: "Volkswagen",
      logo: "/CarsLogo/volkswagon.png",
      description: "120 Cars Available",
    },
    {
      title: "Maruti Suzuki",
      logo: "/CarsLogo/maruti-suzuki.png",
      description: "120 Cars Available",
    },
    {
      title: "Suzuki",
      logo: "/CarsLogo/suzuki.avif",
      description: "120 Cars Available",
    },
    {
      title: "Audi",
      logo: "/CarsLogo/Audi.png",
      description: "120 Cars Available",
    },
    {
      title: "BMW",
      logo: "/CarsLogo/BMW.png",
      description: "120 Cars Available",
    },
    {
      title: "Range Rover",
      logo: "/CarsLogo/RangeRover.png",
      description: "20 Cars Available",
    },
    {
      title: "Ferrari",
      logo: "/CarsLogo/Ferrari.png",
      description: "5 Cars Available",
    },
    {
      title: "Lamborghini",
      logo: "/CarsLogo/Lamborghini.png",
      description: "4 Cars Available",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto relative bg-[#F8F8F8] py-4 md:py-8 md:pb-12  md:px-10 bg-car-handle">
      {/* Top Heading */}
      <div className="mb-3 md:mb-8 mx-auto px-4 md:px-0">
        <h2 className=" text-sm md:text-2xl font-semibold">Popular Brands</h2>
      </div>

      {/* Slider */}
      <Swiper
      spaceBetween={20}
        slidesPerView={3.5}
        breakpoints={{
          1280: { slidesPerView: 10 },
          1024: { slidesPerView: 8 },
          640: { slidesPerView: 4 },
          475: { slidesPerView: 4, spaceBetween: 20, },
          0: { slidesPerView: 4, spaceBetween: 20 },
        }}
        modules={[Navigation]}
        navigation={{
          prevEl: ".custom-prev3",
          nextEl: ".custom-next3",
        }}
      >
        {brandLogos.map((car, idx) => (
          <SwiperSlide key={idx}>
            <div className="bg-white rounded-sm p-2 md:p-4">
              <div className="flex flex-col items-center justify-center space-y-2">
                <img
                  src={car.logo}
                  alt={car.title}
                  className="w-6 md:w-14 h-6 md:h-10 object-contain rounded-xs"
                />
                <p className="text-[10px] md:text-sm font-semibold text-black whitespace-nowrap overflow-hidden text-ellipsis">
                  {car.title}
                </p>
                <p className="text-[7px] md:text-[10px] text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis -mt-2">
                  {car.description}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons (now with class selectors) */}
      <button className="custom-prev3 absolute left-[3%] md:left-4 top-[55%] sm:top-[60%] -translate-y-1/2 z-30 bg-gray-500 md:bg-gray-900 text-white shadow-lg p-1 md:p-2 rounded-full hover:bg-gray-700 cursor-pointer">
        <ChevronLeft className="h-3 w-3 md:h-6 md:w-6" />
      </button>
      <button className="custom-next3 absolute right-[3%] md:right-2 top-[55%] sm:top-[60%] -translate-y-1/2 z-30 bg-gray-500 md:bg-gray-900 text-white shadow-lg p-1 md:p-2 rounded-full hover:bg-gray-700 cursor-pointer">
        <ChevronRight className="h-3 w-3 md:h-6 md:w-6" />
      </button>
    </section>
  );
};

export default BrandLogoCards;
