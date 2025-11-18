import { useDispatch, useSelector } from "react-redux";
import CarCard from "./CarCard";
import CarCardSkeleton from "./CarCardSkeleton";
import CarListHeader from "./CarListHeader";
import type { AppDispatch, RootState } from "../store/store";
import { fetchCars } from "../store/slices/carSlice";
import { useCallback, useRef } from "react";
import toast from "react-hot-toast";

export default function CarList() {
  const dispatch = useDispatch<AppDispatch>();
  const { cars, hasMore, page, loading, error } = useSelector(
    (state: RootState) => state.cars
  );
  const limit = 12;

  // Reference for observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastCarRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            dispatch(fetchCars({ page: page + 1, limit }));
          }
        },
        { threshold: 1 }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, dispatch, page]
  );

  if (error) {
    toast.error(error, { id: "priceRange error" });
  }

  const uniqueCars = Array.from(
    new Map(cars.map((car) => [car.id, car])).values()
  );

  return (
    <div className="h-full w-full overflow-y-auto lg:pl-1 scroll-hide">
      <div className="w-full lg:max-w-7xl mx-auto">
        {/* Header */}
        <CarListHeader carCount={cars.length} />

        {/* Car Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-8 mx-4 sm:mx-0">
          {loading && cars.length === 0 ? (
            Array(6)
              .fill(0)
              .map((_, i) => <CarCardSkeleton key={i} />)
          ) : cars.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No cars found
            </p>
          ) : (
            uniqueCars.map((car, idx) => {
              if (idx === uniqueCars.length - 1) {
                return (
                  <div ref={lastCarRef} key={car.id}>
                    <CarCard car={car} />
                  </div>
                );
              } else {
                return <CarCard key={car.id} car={car} />;
              }
            })
          )}
        </div>
      </div>
    </div>
  );
}