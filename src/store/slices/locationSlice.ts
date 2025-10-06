import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  location: string;
  locations: string[]; 
}

const initialState: LocationState = {
  location: "All City",
  locations: [],
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