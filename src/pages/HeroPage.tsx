import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import FeaturedCars from "../components/FeaturedCars";
import HeroCategories from "../components/HeroCategories";
import PopularCities from "../components/PopularCities";
import BrandLogoCards from "../components/BrandLogoCards";
import LocationModal from "../components/LocationModal";
import FindDealers from "../components/FindDealers";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const HeroPage = () => {
  const {allCars}= useSelector((state: RootState) => state.cars);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");

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

  const handleClose = () => {
    setIsLocationModalOpen(false);
  };

    const getTotalCount = (type: string, value: string) =>
      (Array.isArray(allCars) ? allCars : []).filter((car) => {
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
            return car.address?.city === value;
          default:
            return false;
        }
      }).length;

  return (
    <div className="mt-14 lg:mt-24 min-h-screen max-w-7xl mx-auto">
      <Hero />
      <FeaturedCars/>
      <FindDealers />
      <HeroCategories getTotalCount = {getTotalCount}/>
      <BrandLogoCards getTotalCount = {getTotalCount} />
      <PopularCities getTotalCount = {getTotalCount}/>

      {/* Location Modal (shared) */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={handleClose}
        citySearch={citySearch}
        setCitySearch={setCitySearch}
      />
    </div>
  );
};

export default HeroPage;