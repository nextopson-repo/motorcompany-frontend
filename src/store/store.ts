import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import authReducer from "./slices/authSlices/authSlice";
import loginModelReducer from "./slices/authSlices/loginModelSlice";
import contactReducer from "./slices/contactSlice";
import buyersReducer from "./slices/buyersSlice";
import savedReducer from "./slices/savedSlice";
import listingsReducer from "./slices/listingsSlice";
import dealerReducer from "./slices/dealerSlice";
import profileReducer from "./slices/profileSlice";
import carsReducer from "./slices/carSlice";
import filtersReducer from "./slices/filterSlice";
import locationReducer from "./slices/locationSlice";
import enquiriesReducer from "./slices/enqueriesSlice";
import boughtPackagesReducer from "./slices/boughtPackagesSlice";
import sellerDetailsReducer from "./slices/sellerDetailsSlice";
import carUploadReducer from "./slices/carUploadSlice";
import carImageReducer from "./slices/carImageSlice";
import requirementsReducer from "./slices/requirementsSlice";
import leadsReducer from "./slices/leadsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loginModel: loginModelReducer,
    carUpload: carUploadReducer,
    user: userReducer,
    contact: contactReducer,
    buyers: buyersReducer,
    saved: savedReducer,
    listings: listingsReducer,
    dealers: dealerReducer,
    profile: profileReducer,
    cars: carsReducer,
    filters: filtersReducer,
    location: locationReducer,
    enquiries: enquiriesReducer,
    boughtPackages: boughtPackagesReducer,
    SellerDetails: sellerDetailsReducer,
    carImage: carImageReducer,
    requirements: requirementsReducer,
    leads: leadsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["carImage/setCarImages"], 
        ignoredPaths: ["carImage.files"], 
      },
    }),
});

// Type exports for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
