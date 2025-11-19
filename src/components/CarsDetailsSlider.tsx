import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import CarCard from "./CarCard";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import CarCardSkeleton from "./CarCardSkeleton";
import { fetchCars } from "../store/slices/carSlice";

// interface CarsDetailsSlider {
//   carsData: any[];
// }

const CarsDetailsSlider: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    cars,
    // allCars,
    // filteredCars,
    loading,
    selectedFilters,
    searchTerm,
    sortOption,
  } = useSelector((state: RootState) => state.cars);

  const carsData = cars?.length > 0 ? cars : [];

  console.log("carsData :", carsData);

  const skeletons = Array.from({ length: 4 }, (_, i) => (
    <SwiperSlide key={`skeleton-${i}`} className="pb-4 md:pb-5">
      <CarCardSkeleton />
    </SwiperSlide>
  ));

  /* ----------------------------------------------
         STEP 2: Fetch cars 
    ----------------------------------------------- */
  useEffect(() => {
    dispatch(
      fetchCars({
        selectedFilters: {
          ...selectedFilters,
        },
      })
    );
  }, [dispatch, selectedFilters, searchTerm, sortOption]);

  return (
    <div className="w-full pb-2">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={16}
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
          640: { slidesPerView: 2.5, spaceBetween: 16 },
          475: { slidesPerView: 1.2, spaceBetween: 16 },
        }}
        loop={true}
      >
        {loading ? (
          skeletons
        ) : carsData?.length > 0 ? (
          carsData.map((car: any) => (
            <SwiperSlide key={car.id} className="py-2 px-2">
              <CarCard car={car} />
            </SwiperSlide>
          ))
        ) : (
          <p>No featured cars found.</p>
        )}
      </Swiper>
    </div>
  );
};

export default CarsDetailsSlider;
