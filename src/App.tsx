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

const App = () => {
  const location = useLocation();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const hideNavFooter = ["/register", "/forgot-password"];

  const handleLocationChange = (loc: string) => {
    setSelectedCity(loc);
    setIsLocationModalOpen(false);
    localStorage.setItem("selectedCity", loc);
    console.log("Selected City:", loc);
  };

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

  return (
    <>
      {!hideNavFooter.includes(location.pathname) && (
        <Navbar
          onSelectCityClick={() => setIsLocationModalOpen(true)}
          // onLoginClick={() => setIsLoginOpen(true)} // ✅ Trigger login modal
        />
      )}

      <main className="min-h-screen z-0">
        <Routes>
          <Route path="/" element={<HeroPage selectedCity={selectedCity} />} />
          <Route path="/buy-car" element={<BuyCars />} />
          <Route path="/buy-car/:id" element={<CarDetail />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="sell" element={<Sell />} />
          <Route path="/settings/*" element={<Setting />} />
          <Route path="/top-dealer" element={<TopDealer />} />
        </Routes>
      </main>

      {/* ✅ Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={handleCloseModal}
        onLocationChange={handleLocationChange}
        citySearch={citySearch}
        setCitySearch={setCitySearch}
      />

      {!hideNavFooter.includes(location.pathname) && <Footer />}
    </>
  );
};

export default App;