import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchCars, setSelectedFilters, type SelectedFilters} from "../store/slices/carSlice";
import { FilterSidebar } from "../components/filters/FilterSidebar";
import CarList from "../components/CarList";
import FindDealers from "../components/FindDealers";
import type { AppDispatch, RootState } from "../store/store";

export default function BuyCars() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedFilters,
    searchTerm,
    sortOption,
  } = useSelector((state: RootState) => state.cars);
  const location = useSelector((state: RootState) => state.location.location);

  useEffect(() => {
    const arg = {
      selectedFilters,
      searchTerm,
      sortOption,
    };
    dispatch(fetchCars(arg));
  }, [selectedFilters, searchTerm, sortOption, location, dispatch]);

  
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
              selectedFilters={{
                ...selectedFilters,
                priceRange: selectedFilters.priceRange || [0, 10000000],
                yearRange: selectedFilters.yearRange || [2000, 2025],
              }}
              onSelectedFiltersChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Car List */}
        <div className="w-full py-4 sm:px-6 lg:px-2">
          <CarList />
        </div>
      </div>

      <div className="my-10 ">
        <FindDealers />
      </div>
    </main>
  );
}