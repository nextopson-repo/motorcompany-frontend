import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import FeaturedCars from "../components/FeaturedCars";
import HeroCategories from "../components/HeroCategories";
import PopularCities from "../components/PopularCities";
import BrandLogoCards from "../components/BrandLogoCards";
import LocationModal from "../components/LocationModal";
import FindDealers from "../components/FindDealers";
import { useDispatch, useSelector } from "react-redux";
import { fetchCars, updateSelectedFilter } from "../store/slices/carSlice";
import { fetchSavedCars } from "../store/slices/savedSlice";
import type { AppDispatch, RootState } from "../store/store";

const HeroPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { filterCounts } = useSelector((state: RootState) => state.cars);
  const locationFilter = useSelector(
    (state: RootState) => state.cars.selectedFilters.location
  );

  const { savedCarIdsByCarId } = useSelector((state: RootState) => state.saved);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("All City");

  /* ----------------------------------------------
       STEP 1: FETCH SAVED CARS (DO THIS ONCE)
  ----------------------------------------------- */
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (user && token) {
      dispatch(fetchSavedCars());
    }
  }, [dispatch]);

  /* ----------------------------------------------
       STEP 2: Fetch cars ONLY by location
  ----------------------------------------------- */
  useEffect(() => {
    dispatch(
      fetchCars({
        selectedFilters: {
          location: locationFilter,
          userType: "EndUser",
          brand: [],
          model: [],
          bodyType: [],
          fuelType: [],
          transmission: [],
          ownership: [],
          priceRange: { min: 0, max: 0 }, 
          yearRange: { min: 0, max: 0 }, //
        },
        onlyLocation: true,
        page: 1,
        limit: 12,
      })
    );
  }, [locationFilter, savedCarIdsByCarId, dispatch]);

  /* ----------------------------------------------
       AUTO SHOW LOCATION MODAL FIRST TIME
  ----------------------------------------------- */
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

  /* ----------------------------------------------
       LOCATION CHANGE HANDLER
  ----------------------------------------------- */
  const handleLocationChange = (city: string) => {
    dispatch(updateSelectedFilter({ key: "location", value: [city] }));
    setIsLocationModalOpen(false);
  };

  /* ----------------------------------------------
       FILTER COUNTS FOR CATEGORIES
  ----------------------------------------------- */
  const getTotalCount = (type: string, value: string) => {
    if (!filterCounts || typeof filterCounts !== "object") return 0;

    const group = (filterCounts as any)[type];
    if (!group) return 0;

    return group[value] || 0;
  };

  return (
    <div className="mt-14 lg:mt-24 min-h-screen max-w-7xl mx-auto">
      <Hero />

      {/* 🔥 Featured Cars will now show saved status */}
      <FeaturedCars />
      <FindDealers />

      {/* 🔥 Hero categories will use updated filterCounts */}
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
