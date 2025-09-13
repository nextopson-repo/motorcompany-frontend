import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  brand: string[];
  fuelType: string[];
  priceRange: [number, number];
}

const initialState: FiltersState = {
  brand: [],
  fuelType: [],
  priceRange: [0, 10000000],
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
    resetFilters(state) {
      state.brand = [];
      state.fuelType = [];
      state.priceRange = [0, 10000000];
    },
  },
});

export const { toggleBrand, toggleFuel, setPriceRange, resetFilters } =
  filtersSlice.actions;
export default filtersSlice.reducer;
