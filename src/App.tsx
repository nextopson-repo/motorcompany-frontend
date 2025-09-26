import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroPage from "./pages/HeroPage";
import BuyCars from "./pages/BuyCars";
import Sell from "./pages/SellMyCar";
import CarDetail from "./components/CarDetails";
import Setting from "./pages/Setting";
import Saved from "./components/settings/Saved";
import LocationModal from "./components/LocationModal";
import LoginModal from "./pages/LoginModal";
import TopDealer from "./pages/TopDealer";
import ContactUs from "./pages/ContactUs";
import SellerDetails from "./pages/SellerDetails";
import ScrollToTop from "./components/scrollToTop";
import AppInitializer from "./components/AppInitializer";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store/store";
import { fetchCars } from "./store/slices/carSlice";

const App = () => {
  const location = useLocation();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const hideNavFooter = ["/register", "/forgot-password"];

  const dispatch = useDispatch<AppDispatch>();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  // Fetch cars on mount
    useEffect(() => {
      dispatch(fetchCars(BACKEND_URL));
    }, [BACKEND_URL, dispatch]);

  useEffect(() => {
    const savedCity = localStorage.getItem("selectedCity");
    if (savedCity) {
      setSelectedCity(savedCity);
    }
  }, []);

  useEffect(() => {
    const modalClosed = localStorage.getItem("locationModalClosed") === "true";
    if (!modalClosed && location.pathname === "/") {
      const timer = setTimeout(() => {
        setIsLocationModalOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const handleCloseModal = () => {
    setIsLocationModalOpen(false);
    localStorage.setItem("locationModalClosed", "true");
  };

  useEffect(() => {
    const anyModalOpen = isLoginOpen || isLocationModalOpen;

    if (anyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLoginOpen, isLocationModalOpen]);

  return (
    <>
      <AppInitializer />

      <ScrollToTop />
      {!hideNavFooter.includes(location.pathname) && (
        <Navbar
          onSelectCityClick={() => setIsLocationModalOpen(true)}
          selectedCity={selectedCity}
        />
      )}

      <main className="min-h-screen z-0 ">
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/buy-car" element={<BuyCars />} />
          <Route path="/buy-car/:id" element={<CarDetail />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="sell" element={<Sell />} />
          <Route path="/settings/*" element={<Setting />} />
          <Route path="/top-dealer" element={<TopDealer />} />
          <Route path="/seller-details/:userId" element={<SellerDetails />} />
          <Route path="/contact-us" element={<ContactUs />} />
        </Routes>
      </main>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={handleCloseModal}
        citySearch={citySearch}
        setCitySearch={setCitySearch}
      />

      {!hideNavFooter.includes(location.pathname) && <Footer />}
    </>
  );
};

export default App;
