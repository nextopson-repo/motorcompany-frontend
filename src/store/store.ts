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
  },
});

// Type exports for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
