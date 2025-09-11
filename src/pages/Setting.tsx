import { Routes, Route, Navigate } from "react-router-dom";
// import { useState } from "react";
import AccountSidebar from "../components/settings/SettingSidebar";
import Profile from "../components/settings/Profile";
import MyListing from "../components/settings/MyListing";
import BuyPackages from "../components/settings/BuyPackages";
import BoughtPackages from "../components/settings/BoughtPackages";
import Saved from "../components/settings/Saved";
import { useAuth } from "../context/AuthContext";

const Setting = () => {
  const { user, setUser } = useAuth();
  // const [profile, setProfile] = useState();

  console.log("setUser:", setUser);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Header */}
      <div className="relative h-72 -m-8">
        <img
          src="/settings/main-bg.png"
          alt="header car"
          className="w-full h-[380px] opacity-[50%]"
        />
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto -mt-30 mb-20 relative">
        <h1 className="absolute top-0 left-5 text-2xl font-semibold">
          Account Setting
        </h1>

        <div className="flex flex-col md:flex-row gap-6 p-4 pt-10">
          {/* Sidebar */}
          <AccountSidebar
            name={user?.fullName || ""}
            role={user?.userType || ""}
            imageUrl={user?.image || "/user-img.png"}
            onUploadImage={() => alert("Upload image clicked")}
          />

          {/* Main Content: Nested Routes */}
          <div className="flex-1 bg-white shadow rounded-sm p-8">
            <Routes>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<Profile />} />
              <Route path="listings" element={<MyListing />} />
              <Route path="sell" element={<Saved />} />
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