import { useDispatch, useSelector } from "react-redux";
import CarCard from "./CarCard";
import CarCardSkeleton from "./CarCardSkeleton";
import CarListHeader from "./CarListHeader";
import type { AppDispatch, RootState } from "../store/store";
// import { useEffect } from "react";
import { fetchCars } from "../store/slices/carSlice";

export default function CarList() {
  const dispatch = useDispatch<AppDispatch>();
  const { cars, hasMore, page, loading, error } = useSelector(
    (state: RootState) => state.cars
  );
  const limit = 12;

  // 🔹 Initial Fetch
  // useEffect(() => {
  //   if (cars.length === 0) {
  //     dispatch(fetchCars({ page: 1, limit }));
  //   }
  // }, [dispatch]);

  // 🔹 Handle Load More
  const handleLoadMore = async () => {
    if (!hasMore || loading) return;
    await dispatch(fetchCars({ page: page + 1, limit }));
  };

  return (
    <div className="h-full w-full overflow-hidden lg:pl-1 pb-2">
      <div className="w-full lg:max-w-7xl mx-auto">
        {/* Header */}
        <CarListHeader carCount={cars.length} />

        {/* Car Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-8 mx-4 sm:mx-0">
          {loading && cars.length === 0 ? (
            Array(6)
              .fill(0)
              .map((_, i) => <CarCardSkeleton key={i} />)
          ) : error ? (
            <p className="col-span-full text-center text-red-500 font-medium">
              {error}
            </p>
          ) : cars.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No cars found
            </p>
          ) : (
            cars.map((car) => <CarCard key={car.id} car={car} />)
          )}
        </div>

        {/* ✅ Load More Button */}
        {cars.length > 0 && hasMore && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
