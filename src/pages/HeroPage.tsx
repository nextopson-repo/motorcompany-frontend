import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import FeaturedCars from "../components/FeaturedCars";
import HeroCategories from "../components/HeroCategories";
import PopularCities from "../components/PopularCities";
import BrandLogoCards from "../components/BrandLogoCards";
import LocationModal from "../components/LocationModal";
import FindDealers from "../components/FindDealers";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { fetchCars, updateSelectedFilter } from "../store/slices/carSlice";

const HeroPage = () => {

  const dispatch = useDispatch<AppDispatch>();

  const {
    filterCounts,
    selectedFilters,
    searchTerm,
    sortOption,
  } = useSelector((state: RootState) => state.cars);

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("All City");

  // ------------------------------
  // UPDATE LIST WHEN FILTERS CHANGE
  // ------------------------------
  useEffect(() => {
    // check if no filters applied
    const noFiltersApplied =
      selectedFilters.brand.length === 0 &&
      selectedFilters.model.length === 0 &&
      selectedFilters.bodyType.length === 0 &&
      selectedFilters.fuelType.length === 0 &&
      selectedFilters.transmission.length === 0 &&
      selectedFilters.ownership.length === 0 &&
      selectedFilters.location.length === 0 &&
      selectedFilters.userType === "EndUser" &&
      searchTerm === "";

    if (noFiltersApplied) {
      // load ALL cars only once
      dispatch(fetchCars({ page: 1, limit: 12 }));
    } else {
      // load filtered cars
      dispatch(
        fetchCars({
          selectedFilters,
          searchTerm,
          sortOption,
          page: 1,
          limit: 12,
        })
      );
    }
  }, [selectedFilters, searchTerm, sortOption]);

  // ------------------------------
  // AUTO SHOW LOCATION MODAL FIRST TIME
  // ------------------------------
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("locationModalShown");
    if (!alreadyShown) {
      const timer = setTimeout(() => {
        setIsLocationModalOpen(true);
        sessionStorage.setItem("locationModalShown", "true");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  // ------------------------------
  // LOCATION CHANGE HANDLER
  // ------------------------------
  const handleLocationChange = (city: string) => {
    dispatch(updateSelectedFilter({ key: "location", value: [city] }));
    setIsLocationModalOpen(false);
  };

  // ------------------------------
  // CATEGORY FILTER COUNT
  // ------------------------------
  const getTotalCount = (type: string, value: string) => {
    if (!filterCounts || typeof filterCounts !== "object") return 0;

    const group = (filterCounts as any)[type];
    if (!group) return 0;

    return group[value] || 0;
  };

  return (
    <div className="mt-14 lg:mt-24 min-h-screen max-w-7xl mx-auto">
      <Hero />
      <FeaturedCars />
      <FindDealers />
      <HeroCategories getTotalCount={getTotalCount} />
      <BrandLogoCards getTotalCount={getTotalCount} />
      <PopularCities getTotalCount={getTotalCount} />

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        citySearch={citySearch}
        setCitySearch={setCitySearch}
        onLocationChange={handleLocationChange}
      />
    </div>
  );
};

export default HeroPage;