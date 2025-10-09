import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCars,
  setCityAndStateOptions,
  setSelectedFilters,
  type SelectedFilters,
} from "../store/slices/carSlice";
import { FilterSidebar } from "../components/filters/FilterSidebar";
import CarList from "../components/CarList";
import FindDealers from "../components/FindDealers";
import type { AppDispatch, RootState } from "../store/store";

export default function BuyCars() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    cars,
    filters,
    selectedFilters,
    loading,
    error,
    searchTerm,
    sortOption,
  } = useSelector((state: RootState) => state.cars);

  const location = useSelector((state: RootState) => state.location.location);

  const brandOptions = filters.brand;
  const fuelOptions = filters.fuel;
  const transmissionOptions = filters.transmission;
  const bodyTypeOptions = filters.bodyType;
  const ownershipOptions = filters.ownership;
  const stateOptions = useMemo(() => filters.stateOptions || [], [filters.stateOptions]);
  const cityOptions = useMemo(() => filters.cityOptions || [], [filters.cityOptions]);

  // Build citiesByState map (for sidebar city drilldowns)
  const citiesByState = useMemo(() => {
    const map: Record<string, string[]> = {};
    (cars || []).forEach((c) => {
      const st = c.address?.state;
      const ct = c.address?.city;
      if (st) {
        if (!map[st]) map[st] = [];
        if (ct && !map[st].includes(ct)) map[st].push(ct);
      }
    });
    return map;
  }, [cars]);

  // update frontend static meta once (optional)
  useEffect(() => {
    dispatch(
      setCityAndStateOptions({
        cityOptions,
        stateOptions,
      })
    );
  }, [cityOptions, stateOptions, dispatch]);

  // whenever filters/search/sort/location change -> call API (server-side)
  useEffect(() => {
    const arg = {
      selectedFilters,
      searchTerm,
      sortOption,
    };
    dispatch(fetchCars(arg));
  }, [selectedFilters, searchTerm, sortOption, location, dispatch]);

  const getCount = (type: string, value: string) =>
    (Array.isArray(cars) ? cars : []).filter((car) => {
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

  const handleFilterChange = (newFilters: SelectedFilters) => {
    dispatch(setSelectedFilters(newFilters));
  };

  return (
    <main className="max-w-7xl mx-auto mt-10 md:mt-16 lg:mt-20 min-h-screen relative">
      <div className="relative flex gap-6 lg:pl-8 lg:pr-4">
        {/* Sidebar */}
        <div className="w-fit hidden lg:block">
          <div className="sticky top-20">
            <FilterSidebar
              filters={{
                ...filters,
                priceRange: filters.priceRange || [0, 10000000],
                yearRange: filters.yearRange || [2000, 2025],
              }}
              selectedFilters={{
                ...selectedFilters,
                priceRange: selectedFilters.priceRange || [0, 10000000],
                yearRange: selectedFilters.yearRange || [2000, 2025],
              }}
              onSelectedFiltersChange={handleFilterChange}
              getCount={getCount}
              brandOptions={brandOptions}
              fuelOptions={fuelOptions}
              transmissionOptions={transmissionOptions}
              bodyTypeOptions={bodyTypeOptions}
              ownershipOptions={ownershipOptions}
              stateOptions={stateOptions}
              cityOptions={cityOptions}
              citiesByState={citiesByState}
            />
          </div>
        </div>

        {/* Car List */}
        <div className="w-full py-4 sm:px-6 lg:px-2">
          {loading ? (
            <p>Loading cars...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : Array.isArray(cars) && cars.length > 0 ? (
            <CarList />
          ) : (
            <p className="h-[55vh] lg:h-full w-full flex items-center justify-center">
              No cars available
            </p>
          )}
        </div>
      </div>

      <div className="my-10 ">
        <FindDealers />
      </div>
    </main>
  );
}

// import { useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCars, setSelectedFilters } from "../store/slices/carSlice";
// import { FilterSidebar } from "../components/filters/FilterSidebar";
// import CarList from "../components/CarList";
// import FindDealers from "../components/FindDealers";
// import type { AppDispatch, RootState } from "../store/store";

// export default function BuyCars() {
//   const dispatch = useDispatch<AppDispatch>();

//   // Redux state
//   const { cars, filters, selectedFilters, loading, error } = useSelector(
//     (state: RootState) => state.cars
//   );

// const filtersString = JSON.stringify(selectedFilters);

//   const memoizedFilters = useMemo(
//     () => selectedFilters,
//     [filtersString]
//   );

//   useEffect(() => {
//     dispatch(fetchCars(memoizedFilters));
//   }, [memoizedFilters, dispatch]);

//   // Memoized unique options for sidebar
//   const brandOptions = useMemo(
//     () =>
//       Array.from(new Set(cars.map((c) => c.brand).filter(Boolean))) as string[],
//     [cars]
//   );
//   const fuelOptions = useMemo(
//     () =>
//       Array.from(
//         new Set(cars.map((c) => c.fuelType).filter(Boolean))
//       ) as string[],
//     [cars]
//   );
//   const transmissionOptions = useMemo(
//     () =>
//       Array.from(
//         new Set(cars.map((c) => c.transmission).filter(Boolean))
//       ) as string[],
//     [cars]
//   );
//   const bodyTypeOptions = useMemo(
//     () =>
//       Array.from(
//         new Set(cars.map((c) => c.bodyType).filter(Boolean))
//       ) as string[],
//     [cars]
//   );
//   const ownershipOptions = useMemo(
//     () =>
//       Array.from(
//         new Set(cars.map((c) => c.ownership).filter(Boolean))
//       ) as string[],
//     [cars]
//   );
//   const stateOptions = useMemo(
//     () =>
//       Array.from(
//         new Set(cars.map((c) => c.address?.state).filter(Boolean))
//       ) as string[],
//     [cars]
//   );

//   // Helper to get count for sidebar badges
//   const getCount = (type: string, value: string) =>
//     cars.filter((car) => {
//       switch (type) {
//         case "brand":
//           return car.brand === value;
//         case "fuel":
//           return car.fuelType === value;
//         case "transmission":
//           return car.transmission === value;
//         case "body":
//           return car.bodyType === value;
//         case "ownership":
//           return car.ownership === value;
//         case "location":
//           return car.address?.state === value || car.address?.city === value;
//         default:
//           return false;
//       }
//     }).length;

//     const handleFilterChange = (newFilters: typeof selectedFilters) => {
//   dispatch(setSelectedFilters(newFilters));
//   dispatch(fetchCars(newFilters)); // API call directly
// };

//   return (
//     <main className="max-w-7xl mx-auto mt-10 md:mt-16 lg:mt-20 min-h-screen relative">
//       <div className="relative flex gap-6 lg:pl-8 lg:pr-4">
//         {/* Sidebar */}
//         <div className="w-fit hidden lg:block">
//           <div className="sticky top-20">
//             <FilterSidebar
//               filters={{
//                 ...filters,
//                 priceRange: filters.priceRange || [0, 10000000],
//                 yearRange: filters.yearRange || [2000, 2025],
//                 ownerType: filters.ownerType || "all",
//               }}
//               selectedFilters={{
//                 ...selectedFilters,
//                 priceRange: selectedFilters.priceRange || [0, 10000000],
//                 yearRange: selectedFilters.yearRange || [2000, 2025],
//                 ownerType: selectedFilters.ownerType || "all",
//               }}
//               onSelectedFiltersChange={handleFilterChange}
//               getCount={getCount}
//               brandOptions={brandOptions}
//               fuelOptions={fuelOptions}
//               transmissionOptions={transmissionOptions}
//               bodyTypeOptions={bodyTypeOptions}
//               ownershipOptions={ownershipOptions}
//               stateOptions={stateOptions}
//             />
//           </div>
//         </div>

//         {/* Car List */}
//         <div className="w-full py-4 sm:px-6 lg:px-2">
//           {loading ? (
//             <p>Loading cars...</p>
//           ) : error ? (
//             <p className="text-red-500">{error}</p>
//           ) : cars.length > 0 ? (
//             <CarList />
//           ) : (
//             <p className="h-[55vh] lg:h-full w-full flex items-center justify-center">
//               No cars available
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Optional Section like FindDealers */}
//       <div className="my-10 ">
//         <FindDealers />
//       </div>
//     </main>
//   );
// }
