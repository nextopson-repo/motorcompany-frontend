import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedFilters } from "../store/slices/carSlice";
import { FilterSidebar } from "../components/filters/FilterSidebar";
import CarList from "../components/CarList";
import FindDealers from "../components/FindDealers";
import type { AppDispatch, RootState } from "../store/store";

export default function BuyCars() {
  const dispatch = useDispatch<AppDispatch>();
  

  // Redux state
  const { cars, filters, selectedFilters, loading, error } = useSelector(
    (state: RootState) => state.cars
  );

  

  // Memoized unique options for sidebar
  const brandOptions = useMemo(
    () => Array.from(new Set(cars.map((c) => c.brand).filter(Boolean))) as string[],
    [cars]
  );
  const fuelOptions = useMemo(
    () => Array.from(new Set(cars.map((c) => c.fuelType).filter(Boolean))) as string[],
    [cars]
  );
  const transmissionOptions = useMemo(
    () => Array.from(new Set(cars.map((c) => c.transmission).filter(Boolean))) as string[],
    [cars]
  );
  const bodyTypeOptions = useMemo(
    () => Array.from(new Set(cars.map((c) => c.bodyType).filter(Boolean))) as string[],
    [cars]
  );
  const ownershipOptions = useMemo(
    () => Array.from(new Set(cars.map((c) => c.ownership).filter(Boolean))) as string[],
    [cars]
  );
  const stateOptions = useMemo(
    () => Array.from(new Set(cars.map((c) => c.address?.state).filter(Boolean))) as string[],
    [cars]
  );

  // Helper to get count for sidebar badges
  const getCount = (type: string, value: string) =>
    cars.filter((car) => {
      switch (type) {
        case "brand":
          return car.brand === value;
        case "fuel":
          return car.fuelType === value;
        case "transmission":
          return car.transmission === value;
        case "body":
          return car.bodyType === value;
        case "ownership":
          return car.ownership === value;
        case "location":
          return car.address?.state === value || car.address?.city === value;
        default:
          return false;
      }
    }).length;

  return (
    <main className="max-w-7xl mx-auto mt-10 md:mt-16 lg:mt-20 min-h-screen relative">
      <div className="relative flex gap-6 px-4 lg:pl-8">
        {/* Sidebar */}
        <div className="w-fit hidden lg:block">
          <div className="sticky top-20">
            <FilterSidebar
              filters={filters}
              selectedFilters={selectedFilters}
              onSelectedFiltersChange={(newFilters) =>
                dispatch(setSelectedFilters(newFilters))
              }
              getCount={getCount}
              brandOptions={brandOptions}
              fuelOptions={fuelOptions}
              transmissionOptions={transmissionOptions}
              bodyTypeOptions={bodyTypeOptions}
              ownershipOptions={ownershipOptions}
              stateOptions={stateOptions}
            />
          </div>
        </div>

        {/* Car List */}
        <div className="w-full py-4 lg:px-2">
          {loading ? (
            <p>Loading cars...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : cars.length > 0 ? (
            <CarList />
          ) : (
            <p>No cars available</p>
          )}
        </div>
      </div>

      {/* Optional Section like FindDealers */}
      <div className="my-10 ">
        <FindDealers />
      </div>
    </main>
  );
}