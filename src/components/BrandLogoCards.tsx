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
      logo: "/CarsLogo/suzuki.png",
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
    <section className="max-w-7xl mx-auto relative font-montserrat bg-[#F8F8F8] py-8 px-4 bg-car-handle">
      {/* Top Heading */}
      <div className="mb-6 mx-auto">
        <h2 className="text-lg md:text-xl font-semibold ml-4">
          Popular Brands
        </h2>
      </div>

      {/* Slider */}
      <Swiper
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 4 },
          1024: { slidesPerView: 8 },
          1280: { slidesPerView: 10 },
        }}
        modules={[Navigation]}
        navigation={{
          prevEl: ".custom-prev3",
          nextEl: ".custom-next3",
        }}
      >
        {brandLogos.map((car, idx) => (
          <SwiperSlide key={idx}>
            <div className=" flex flex-col items-center justify-center space-y-3">
                <img src={car.logo} alt={car.title} className="w-16 h-12 object-contain rounded-sm" />
                <p className="text-md font-semibold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                  {car.title}
                </p>
                <p className="text-xs text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis -mt-2">
                  {car.description}
                </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons (now with class selectors) */}
      <button className="custom-prev3 absolute left-[3%] md:left-4 top-[55%] sm:top-[60%] -translate-y-1/2 z-30 bg-gray-900 text-white shadow-lg p-2 rounded-full hover:bg-gray-700 cursor-pointer">
        <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
      </button>
      <button className="custom-next3 absolute right-[3%] md:right-2 top-[55%] sm:top-[60%] -translate-y-1/2 z-30 bg-gray-900 text-white shadow-lg p-2 rounded-full hover:bg-gray-700 cursor-pointer">
        <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
      </button>

    </section>
  );
};

export default BrandLogoCards;
