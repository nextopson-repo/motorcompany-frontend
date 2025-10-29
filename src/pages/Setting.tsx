import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AccountSidebar from "../components/settings/SettingSidebar";
import Profile from "../components/settings/Profile";
import { MyListing } from "../components/settings/MyListing";
import BuyPackages from "../components/settings/BuyPackages";
import BoughtPackages from "../components/settings/BoughtPackages";
import Saved from "../components/settings/Saved";
import InterestedBuyers from "../components/settings/IntrustedBuyers";
import Enquiries from "../components/settings/Enquiries";
import { useAppDispatch, useAppSelector } from "../store/redux/hooks";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../store/slices/profileSlice";
import MyLeads from "../components/settings/MyLeads";

const Setting = () => {
  const dispatch = useAppDispatch();
  const { user: profile, loading } = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (!profile) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, profile]);

 const handleImageUpload = async (file: File) => {
  await dispatch(updateUserProfile({ userProfileFile: file }));
  await dispatch(fetchUserProfile());
};

  if (loading || !profile) {
    return <p className="text-center my-[10%] ">Loading profile...</p>;
  }

  return (
    <div className="relative w-full h-fit lg:min-h-screen overflow-hidden">
      <div className="hidden lg:block relative h-78">
        <img
          src="/settings/main-bg.png"
          alt="header car"
          className="w-full h-full opacity-[30%] object-cover object-center"
        />
      </div>

      <div className="max-w-6xl mx-auto lg:-mt-50 lg:mb-20 relative">
        <h1 className="hidden md:block md:absolute top-0 left-5 text-2xl font-semibold">
          Account Setting
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 md:p-4 pt-12 md:pt-14 lg:pt-14">
          {/* Sidebar */}
          <AccountSidebar
            name={profile.fullName || ""}
            role={profile.userType || ""}
            imageUrl={profile.userProfileUrl || "/user-img.png"}
            onUploadImage={handleImageUpload}
          />

          {/* Main Content */}
          <div className="w-full lg:w-fit flex-1 bg-white lg:shadow rounded-sm lg:p-8">
            <Routes>
              <Route index element={<Navigate to="profile" replace />} />
              <Route
                path="profile"
                element={<Profile user={profile} />}
              />
              <Route path="listings" element={<MyListing />} />
              <Route path="my-leads" element={<MyLeads />} />
              <Route path="interested-buyers" element={<InterestedBuyers />} />
              <Route path="enquiries" element={<Enquiries />} />
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