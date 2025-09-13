import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Car {
  id: number;
  title: string;
  carImages: string[];
  isSold: boolean;
  liked: number;
  kmDriven: number;
  bodyType: string;
  seats: number;
  fuel: string;
  transmission: string;
  address: { city: string; state: string };
  price: number;
  trending: number;
  time: string;
}

interface ListingsState {
  cars: Car[];
  loading: boolean;
  error: string | null;
}

const initialState: ListingsState = {
  cars: [],
  loading: false,
  error: null,
};

// ✅ Fetch user cars
export const fetchUserCars = createAsyncThunk(
  "listings/fetchUserCars",
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user?.id;
      if (!userId) return [];

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/car/get-user-cars`,
        { userId }
      );
      return res.data.cars || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch cars");
    }
  }
);

// ✅ Mark as sold
export const markCarAsSold = createAsyncThunk(
  "listings/markCarAsSold",
  async (carId: number, { rejectWithValue }) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/car/mark-sold`,
        { carId }
      );
      return carId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to mark sold");
    }
  }
);

// ✅ Delete car
export const deleteCar = createAsyncThunk(
  "listings/deleteCar",
  async (carId: number, { rejectWithValue }) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/car/delete`,
        { carId }
      );
      return carId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete car");
    }
  }
);

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUserCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCars.fulfilled, (state, action: PayloadAction<Car[]>) => {
        state.loading = false;
        state.cars = action.payload;
      })
      .addCase(fetchUserCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Mark sold
      .addCase(markCarAsSold.fulfilled, (state, action: PayloadAction<number>) => {
        state.cars = state.cars.map((car) =>
          car.id === action.payload ? { ...car, isSold: true } : car
        );
      })
      // Delete
      .addCase(deleteCar.fulfilled, (state, action: PayloadAction<number>) => {
        state.cars = state.cars.filter((car) => car.id !== action.payload);
      });
  },
});

export default listingsSlice.reducer;
