import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Car {
  id: number;
  title: string;
  price: number;
  oldPrice: number;
  image: string;
  city: string;
  fuelType: string;
  brand: string;
}

interface CarsState {
  cars: Car[];
  loading: boolean;
  error: string | null;
}

const initialState: CarsState = {
  cars: [],
  loading: false,
  error: null,
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// API call
export const fetchCars = createAsyncThunk("cars/fetchCars", async () => {
  const res = await axios.get(`${BACKEND_URL}/api/v1/car/getAll`); // change API url
  return res.data;
});

const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action: PayloadAction<Car[]>) => {
        state.loading = false;
        state.cars = action.payload;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cars";
      });
  },
});

export default carsSlice.reducer;
