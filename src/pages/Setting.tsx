import { Routes, Route, Navigate } from "react-router-dom";
import AccountSidebar from "../components/settings/SettingSidebar";
import Profile from "../components/settings/Profile";
import MyListing from "../components/settings/MyListing";
import BuyPackages from "../components/settings/BuyPackages";
import BoughtPackages from "../components/settings/BoughtPackages";
import Saved from "../components/settings/Saved";
import { useAuth } from "../context/AuthContext";
import InterestedBuyers from "../components/settings/IntrustedBuyers";
import Enquiries from "../components/settings/Enquiries";

const Setting = () => {
  const { user } = useAuth();

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Header */}
      <div className="hidden md:block relative h-78">
        <img
          src="/settings/main-bg.png"
          alt="header car"
          className="w-full h-full opacity-[30%] object-cover object-center"
        />
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto md:-mt-50 md:mb-20 relative">
        <h1 className="hidden md:block md:absolute top-0 left-5 text-2xl font-semibold">
          Account Setting
        </h1>

        <div className="flex flex-col md:flex-row gap-8 md:p-4 pt-12 md:pt-14">
          {/* Sidebar */}
          <AccountSidebar
            name={user?.fullName || ""}
            role={user?.userType || ""}
            imageUrl={user?.image || "/user-img.png"}
            onUploadImage={() => alert("Upload image clicked")}
          />

          {/* Main Content: Nested Routes */}
          <div className="flex-1 bg-white md:shadow rounded-sm md:p-8">
            <Routes>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<Profile />} />
              <Route path="listings" element={<MyListing />} />
              <Route path="enquiries" element={<Enquiries/> } />
              <Route path="interested-buyers" element={<InterestedBuyers /> } />
              <Route path="saved" element={<Saved />} />
              <Route path="buy-packages" element={<BuyPackages />} />
              <Route path="bought-packages" element={<BoughtPackages />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;