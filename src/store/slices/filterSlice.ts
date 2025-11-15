import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  brand: string[];
  fuelType: string[];
  priceRange: [number, number];
  yearRange: [number, number]; 
  modelKmDriven: [number, number]; 
  location: string | null;
  ownership: "1st" | "2nd" | "3rd+"; // dropdown selection
}

const initialState: FiltersState = {
  brand: [],
  fuelType: [],
  priceRange: [1, 10000000],
  yearRange: [2000, new Date().getFullYear()],
  modelKmDriven: [1, 999999],
  location: null,
  ownership: "1st",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    toggleBrand(state, action: PayloadAction<string>) {
      if (state.brand.includes(action.payload)) {
        state.brand = state.brand.filter((b) => b !== action.payload);
      } else {
        state.brand.push(action.payload);
      }
    },
    toggleFuel(state, action: PayloadAction<string>) {
      if (state.fuelType.includes(action.payload)) {
        state.fuelType = state.fuelType.filter((f) => f !== action.payload);
      } else {
        state.fuelType.push(action.payload);
      }
    },
    setPriceRange(state, action: PayloadAction<[number, number]>) {
      state.priceRange = action.payload;
    },
    setModelYearRange(state, action: PayloadAction<[number, number]>) {
      state.yearRange = action.payload;
    },
    setCity(state, action: PayloadAction<string>) {
      state.location = action.payload;
    },
    setModelKmDriven(state, action: PayloadAction<[number, number]>){
      state.modelKmDriven = action.payload;
    },
    setOwnership(state, action: PayloadAction<"1st" | "2nd" | "3rd+">) {
      state.ownership = action.payload;
    },
    resetFilters(state) {
      state.brand = [];
      state.fuelType = [];
      state.priceRange = [1, 10000000];
      state.yearRange = [2000, new Date().getFullYear()];
      state.modelKmDriven = [1, 999999];
      state.location = null;
      state.ownership = "1st";
    },
  },
});

export const { toggleBrand, toggleFuel, setPriceRange, setModelYearRange, resetFilters, setCity, setModelKmDriven,
  setOwnership } =
  filtersSlice.actions;
export default filtersSlice.reducer;
