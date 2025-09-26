import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
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


export const store = configureStore({
  reducer: {
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
  },
});

// Type exports for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
