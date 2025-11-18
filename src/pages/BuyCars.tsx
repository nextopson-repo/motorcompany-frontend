import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCars,
  setSelectedFilters,
  updateSelectedFilter,
  type SelectedFilters,
} from "../store/slices/carSlice";
import { FilterSidebar } from "../components/filters/FilterSidebar";
import CarList from "../components/CarList";
import FindDealers from "../components/FindDealers";
import type { AppDispatch, RootState } from "../store/store";
import LocationModal from "../components/LocationModal";
import { setLocation } from "../store/slices/locationSlice";

export default function BuyCars() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useSelector((state: RootState) => state.location.location);
  const { selectedFilters, searchTerm, sortOption } = useSelector(
    (state: RootState) => state.cars
  );
  const [citySearch, setCitySearch] = useState("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(
    location === ""
  );
  // Jab location change ho, modal close karo agar city select ho gayi to
  useEffect(() => {
    if (location && location !== "All City") {
      setIsLocationModalOpen(false);
      setCitySearch(""); // City search reset
    } else {
      setIsLocationModalOpen(true);
    }
  }, [location]);
  // Location select karne ka handler
  const handleSelectCity = (city: string) => {
    dispatch(setLocation(city));
    dispatch(updateSelectedFilter({ key: "location", value: [city] }));
    setIsLocationModalOpen(false);
    setCitySearch("");
  };

  // Modal close manual (agar close button pe click ho)
  const handleCloseModal = () => {
    setIsLocationModalOpen(false);
  };

  useEffect(() => {
    if (location && location !== "All City") {
      const arg = {
        selectedFilters,
        searchTerm,
        sortOption,
      };
      dispatch(fetchCars(arg));
    }
  }, [selectedFilters, searchTerm, sortOption, dispatch]);

  // console.log("setSelectedFilter log:", selectedFilters);

  const handleFilterChange = (newFilters: SelectedFilters) => {
    dispatch(setSelectedFilters(newFilters));
  };

  useEffect(() => {
    if (isLocationModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLocationModalOpen]);

  return (
    <main className="max-w-7xl mx-auto mt-10 md:mt-16 lg:mt-16 min-h-screen relative">
      {/* --- MODAL OVERLAY --- */}
      {isLocationModalOpen && (
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={handleCloseModal}
          onLocationChange={handleSelectCity} // Pass the handler!
          citySearch={citySearch}
          setCitySearch={setCitySearch}
        />
      )}

      {/* --- PAGE LAYOUT WITH SEPARATE SCROLLS --- */}
      <div className="relative flex gap-6 lg:pl-8 lg:pr-4 lg:mb-10 h-[calc(100vh-40px)] scroll-hide">
        {/* Sidebar with own scroll */}
        <div className="w-fit hidden lg:block">
          <div className="h-full overflow-y-auto pr-2 lg:mt-2 scroll-hide">
            <FilterSidebar
              selectedFilters={selectedFilters}
              onSelectedFiltersChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Car list with own scroll */}
        <div className="w-full pt-4 sm:px-6 lg:px-2 h-full overflow-y-auto scroll-hide">
          <CarList />
        </div>
      </div>

      <div className="mb-10 ">
        <FindDealers />
      </div>
    </main>
  );
}
