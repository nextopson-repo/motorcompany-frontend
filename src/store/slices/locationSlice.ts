// src/store/locationSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  location: string;
  locations: string[]; // all available cities
}

const initialState: LocationState = {
  location: "Kolkata",
  locations: [], // initially empty, later populate from carsData
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    setLocations: (state, action: PayloadAction<string[]>) => {
      state.locations = action.payload;
    },
  },
});

export const { setLocation, setLocations } = locationSlice.actions;
export default locationSlice.reducer;
