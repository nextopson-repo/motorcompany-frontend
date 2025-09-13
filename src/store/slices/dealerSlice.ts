import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Dealer {
  id: number;
  name: string;
  role: string;
  location: string;
  imageUrl: string;
}

interface DealerState {
  dealers: Dealer[];
  cities: string[];
  selectedCity: string;
}

const initialState: DealerState = {
  dealers: [
    {
      id: 1,
      name: "Sourav Chakraborty",
      role: "Owner",
      location: "Kurla, Mumbai - 700008",
      imageUrl: "/default-men-logo.jpg",
    },
    {
      id: 2,
      name: "Sourav Chakraborty",
      role: "Owner",
      location: "Kurla, Mumbai - 700008",
      imageUrl: "/default-men-logo.jpg",
    },
  ],
  cities: ["Kolkata", "Mumbai", "Delhi"],
  selectedCity: "Kolkata",
};

const dealerSlice = createSlice({
  name: "dealers",
  initialState,
  reducers: {
    setDealers: (state, action: PayloadAction<Dealer[]>) => {
      state.dealers = action.payload;
    },
    setSelectedCity: (state, action: PayloadAction<string>) => {
      state.selectedCity = action.payload;
    },
  },
});

export const { setDealers, setSelectedCity } = dealerSlice.actions;
export default dealerSlice.reducer;
