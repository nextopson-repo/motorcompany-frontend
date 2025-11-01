import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarCard from "./CarCard";
import CarCardSkeleton from "./CarCardSkeleton";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";

const FeaturedCars: React.FC = () => {
  const navigate = useNavigate();
  const { cars: featuredCars, loading } = useSelector(
    (state: RootState) => state.cars
  );

  const skeletons = Array.from({ length: 4 }, (_, i) => (
    <SwiperSlide key={`skeleton-${i}`} className="pb-4 md:pb-5">
      <CarCardSkeleton />
    </SwiperSlide>
  ));

  return (
    <section className="max-w-7xl mx-auto px-2 lg:px-8 py-6 lg:py-14 relative">
      {/* Heading */}
      <div className="text-xs text-center mb-5 mx-auto">
        <p className="text-[#EE1422] text-xs md:text-xs font-bold mb-3 flex items-center justify-center gap-2 md:gap-5">
          <span className="w-8 md:w-10 h-px bg-[#EE1422]" />
          Featured Cars
          <span className="w-8 md:w-10 h-px bg-[#EE1422]" />
        </p>
        <h2 className="text-[17px] md:text-2xl font-bold">The Most Searched And Liked Cars</h2>
      </div>

      {/* Swiper */}
      <Swiper
        spaceBetween={20}
        slidesPerView={1.2}
        breakpoints={{
          1280: { slidesPerView: 4, spaceBetween: 32 },
          1140: { slidesPerView: 4, spaceBetween: 32 },
          1024: { slidesPerView: 3.3, spaceBetween: 26 },
          640: { slidesPerView: 2.5, spaceBetween: 20 },
          475: { slidesPerView: 1.2, spaceBetween: 20 },
        }}
        modules={[Navigation]}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
      >
        {loading
          ? skeletons
          : featuredCars?.length > 0
          ? featuredCars.map((car) => (
              <SwiperSlide key={car.id} className="pb-4 md:pb-5">
                <CarCard car={car} />
              </SwiperSlide>
            ))
          : <p>No featured cars found.</p>}
      </Swiper>

      {/* Nav buttons */}
      <button className="hidden lg:block custom-prev absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 bg-gray-900 text-white shadow-lg p-2 rounded-full hover:bg-gray-700">
        <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
      </button>
      <button className="hidden lg:block custom-next absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 bg-gray-900 text-white shadow-lg p-2 rounded-full hover:bg-gray-700">
        <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
      </button>

      {/* Bottom Button */}
      <div className="flex justify-center lg:mt-4">
        <button
          className="w-40 md:w-66 text-sm md:text-sm bg-[#EE1422] text-white font-medium py-1.5 md:py-2 rounded-sm hover:bg-[#EE1422]/80 transition"
          onClick={() => navigate("/buy-car")}
        >
          View All
        </button>
      </div>
    </section>
  );
};

export default FeaturedCars;