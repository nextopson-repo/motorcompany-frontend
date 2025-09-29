import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  brand: string[];
  fuelType: string[];
  priceRange: [number, number];
  modelYearRange: [number, number]; 
  modelKmDriven: [number, number]; 
  city: string | null;
  ownership: "All" | "Dealer" | "Owner"; // dropdown selection
}

const initialState: FiltersState = {
  brand: [],
  fuelType: [],
  priceRange: [0, 10000000],
  modelYearRange: [2000, new Date().getFullYear()],
  modelKmDriven: [0, 999999],
  city: null,
  ownership: "All",
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
      state.modelYearRange = action.payload;
    },
    setCity(state, action: PayloadAction<string>) {
      state.city = action.payload;
    },
    setModelKmDriven(state, action: PayloadAction<[number, number]>){
      state.modelKmDriven = action.payload;
    },
    setOwnership(state, action: PayloadAction<"All" | "Dealer" | "Owner">) {
      state.ownership = action.payload;
    },
    resetFilters(state) {
      state.brand = [];
      state.fuelType = [];
      state.priceRange = [0, 10000000];
      state.modelYearRange = [2000, new Date().getFullYear()];
      state.modelKmDriven = [0, 999999];
      state.city = null;
      state.ownership = "All";
    },
  },
});

export const { toggleBrand, toggleFuel, setPriceRange, setModelYearRange, resetFilters, setCity, setModelKmDriven,
  setOwnership } =
  filtersSlice.actions;
export default filtersSlice.reducer;
