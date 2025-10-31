import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { updateSelectedFilter } from "../store/slices/carSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";

const BrandLogoCards: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const Navigate = useNavigate();

  const brandLogos = [
    {
      Brand: "Tata",
      logo: "/CarsLogo/tata-motors.png",
      description: "120 Cars Available",
    },
    {
      Brand: "Honda",
      logo: "/CarsLogo/honda.png",
      description: "120 Cars Available",
    },
    {
      Brand: "Mahindra",
      logo: "/CarsLogo/mahindra.png",
      description: "120 Cars Available",
    },
    {
      Brand: "Hyundai",
      logo: "/CarsLogo/hyundai.png",
      description: "120 Cars Available",
    },
    {
      Brand: "Ford",
      logo: "/CarsLogo/ford.png",
      description: "120 Cars Available",
    },
    {
      Brand: "Volkswagen",
      logo: "/CarsLogo/volkswagon.png",
      description: "120 Cars Available",
    },
    {
      Brand: "Maruti Suzuki",
      logo: "/CarsLogo/maruti-suzuki.png",
      description: "120 Cars Available",
    },
    {
      Brand: "Suzuki",
      logo: "/CarsLogo/suzuki.avif",
      description: "120 Cars Available",
    },
    {
      Brand: "Audi",
      logo: "/CarsLogo/Audi.png",
      description: "120 Cars Available",
    },
    {
      Brand: "BMW",
      logo: "/CarsLogo/BMW.png",
      description: "120 Cars Available",
    },
    {
      Brand: "Range Rover",
      logo: "/CarsLogo/RangeRover.png",
      description: "20 Cars Available",
    },
    {
      Brand: "Ferrari",
      logo: "/CarsLogo/Ferrari.png",
      description: "5 Cars Available",
    },
    {
      Brand: "Lamborghini",
      logo: "/CarsLogo/Lamborghini.png",
      description: "4 Cars Available",
    },
  ];

   // in city card click handler
  const handleBrandClick = (brandName: string) => {
    dispatch(updateSelectedFilter({ key: 'brand', value: [brandName] }));
    Navigate('/buy-car');
  };

  return (
    <section className="max-w-7xl mx-auto relative bg-[#F8F8F8] px-4 lg:px-0 py-6 md:py-8 md:pb-12  md:px-10 bg-car-handle">
      {/* Top Heading */}
      <div className="mb-5 md:mb-8 mx-auto">
        <h2 className=" text-[17px] md:text-2xl font-semibold">Popular Brands</h2>
      </div>

      {/* Slider */}
      <Swiper
      spaceBetween={16}
        slidesPerView={3}
        breakpoints={{
          1280: { slidesPerView: 10 },
          1024: { slidesPerView: 8 },
          640: { slidesPerView: 6 },
          475: { slidesPerView: 3, spaceBetween: 16, },
          0: { slidesPerView: 3, spaceBetween: 16 },
        }}
        modules={[Navigation]}
        navigation={{
          prevEl: ".custom-prev3",
          nextEl: ".custom-next3",
        }}
      >
        {brandLogos.map((car, idx) => (
          <SwiperSlide key={idx}>
            <div className="bg-white rounded-sm p-2 md:p-4"
            onClick={() => handleBrandClick(car.Brand)}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <img
                  src={car.logo}
                  alt={car.Brand}
                  className="w-10 md:w-14 h-9 md:h-10 object-contain rounded-xs"
                />
                <p className="text-[13px] md:text-sm font-semibold text-black whitespace-nowrap overflow-hidden text-ellipsis">
                  {car.Brand}
                </p>
                <p className="text-[10px] md:text-[10px] text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis -mt-2">
                  {car.description}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons (now with class selectors) */}
      <button className="custom-prev3 absolute left-[3%] md:left-4 top-[60%] sm:top-[60%] -translate-y-1/2 z-30 bg-gray-500 md:bg-gray-900 text-white shadow-lg p-1 md:p-2 rounded-full hover:bg-gray-700 cursor-pointer">
        <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
      </button>
      <button className="custom-next3 absolute right-[3%] md:right-2 top-[60%] sm:top-[60%] -translate-y-1/2 z-30 bg-gray-500 md:bg-gray-900 text-white shadow-lg p-1 md:p-2 rounded-full hover:bg-gray-700 cursor-pointer">
        <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
      </button>
    </section>
  );
};

export default BrandLogoCards;
