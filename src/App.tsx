import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
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
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store/store";
import { fetchCars } from "./store/slices/carSlice";
import { closeLogin } from "./store/slices/authSlices/loginModelSlice";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import Requirements from "./pages/Requirements";
import CreateRequirement from "./pages/CreateRequirement";
import { setSuccessMessage } from "./store/slices/toastSlice";

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const { isOpen } = useSelector((state: RootState) => state.loginModel);
  const hideNavFooter = ["/register", "/forgot-password"];
  const successMessage = useSelector(
    (state: RootState) => state.toast.successMessage
  );

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(setSuccessMessage(null));
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    dispatch(fetchCars(BACKEND_URL));
  }, [BACKEND_URL, dispatch]);

  useEffect(() => {
    const anyModalOpen = isOpen || isLocationModalOpen;

    if (anyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, isLocationModalOpen]);

  return (
    <div className="flex flex-col min-h-screen">
      <AppInitializer />

      <Toaster position="top-right" reverseOrder={false} />

      <ScrollToTop />
      {!hideNavFooter.includes(location.pathname) && (
        <Navbar onSelectCityClick={() => setIsLocationModalOpen(true)} />
      )}

      <main className="flex-1 z-0 ">
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/buy-car" element={<BuyCars />} />
          <Route path="/buy-car/:id" element={<CarDetail />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="sell" element={<Sell />} />
          <Route path="/requirements" element={<Requirements />} />
          <Route path="/create-requirement" element={<CreateRequirement />} />
          <Route path="/settings/*" element={<Setting />} />
          <Route path="/top-dealer" element={<TopDealer />} />
          <Route path="/seller-details/:userId" element={<SellerDetails />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refund" element={<RefundPolicy />} />
        </Routes>
      </main>

      <LoginModal
        isOpen={isOpen}
        onClose={() => dispatch(closeLogin())}
        mobileNumber=""
        checkbox={false}
      />

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        citySearch={citySearch}
        setCitySearch={setCitySearch}
      />

      {!hideNavFooter.includes(location.pathname) && <Footer />}
    </div>
  );
};

export default App;
