import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import FeaturedCars from "../components/FeaturedCars";
import HeroCategories from "../components/HeroCategories";
import PopularCities from "../components/PopularCities";
import BrandLogoCards from "../components/BrandLogoCards";
import LocationModal from "../components/LocationModal";
import FindDealers from "../components/FindDealers";

const HeroPage = () => {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  // ✅ Auto-open after 5s (only first time per session)
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

  return (
    <div className="mt-24 min-h-screen max-w-7xl mx-auto font-montserrat">
      <Hero />
      <FeaturedCars />
      <FindDealers />
      <HeroCategories />
      <BrandLogoCards />
      <PopularCities />

      {/* Location Modal (shared) */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={handleClose}
        onLocationChange={(loc) => {
          console.log("Selected location:", loc);
          handleClose();
        }}
        citySearch={citySearch}
        setCitySearch={setCitySearch}
      />
    </div>
  );
};

export default HeroPage;



// import Hero from '../components/Hero'
// import FeaturedCars from '../components/FeaturedCars'
// import HeroCategories from '../components/HeroCategories'
// import PopularCities from '../components/PopularCities'
// import BrandLogoCards from '../components/BrandLogoCards'

// const HeroPage = () => {
//   return (
//     <div className="mt-24 min-h-screen max-w-7xl mx-auto px-2 xs:px-4 font-montserrat">
//         <Hero />
//         <FeaturedCars />
//         <HeroCategories />
//         <BrandLogoCards />
//         <PopularCities />
//       </div>
//   )
// }

// export default HeroPage
