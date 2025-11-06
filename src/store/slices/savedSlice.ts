import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { CarRecord } from "../../types/car";
import axios from "axios";
import toast from "react-hot-toast";

interface SavedState {
  cars: CarRecord[];
  savedCarIds: string[];
  searchTerm: string;
  sortOption: string;
  loading: boolean;
  error: string | null;
}

const initialState: SavedState = {
  cars: [],
  savedCarIds: [],
  searchTerm: "",
  sortOption: "popularity",
  loading: false,
  error: null,
};

// 🧠 API base URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// ✅ Fetch saved cars API call
export const fetchSavedCars = createAsyncThunk(
  "saved/fetchSavedCars",
  async (_, { rejectWithValue }) => {
    try {
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      const token = localStorage.getItem("token");
      if (!user || !token) throw new Error("User not logged in");

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/dashboard/get-saved-cars`,
        { userId: user.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("response :", response.data.result.savedCars);

      const savedCars: CarRecord[] = response.data.result.savedCars
        .map((item: any) => {
          const car = item.property;
          if(!car) return null;
          return {
            id: car.id,
            brand: car.brand,
            model: car.model,
            fuelType: car.fuelType,
            transmission: car.transmission,
            bodyType: car.bodyType,
            ownership: car.ownership,
            seats: car.seats,
            carPrice: car.carPrice,
            manufacturingYear: car.manufacturingYear,
            kmDriven: car.kmDriven,
            address: { state: car.state, city: car.city || car.address?.city },
            carImages: car.carImages?.map((img: any) => ({
              imageKey: img,
              imageUrl: img,
            })),
            // ✅ Owner info
            user: {
              // fullName: item.savedCar?.fullName || "Unknown",
              fullName: user.fullName || "Unknown",
              userType: user.userType || "unknown",
            },
            updatedAt: car.updatedAt,
            createdAt: car.createdAt,
            savedCarId: item.savedCar.id,
          };
        })
        .filter(Boolean);

      const savedCarIds = response.data.result.savedCars.map(
        (item: any) => item.savedCar.id
      );

      // console.log("carId:", savedCarIds)

      toast.success("fetched saved cars successfully!", {
        id: "fetch saved cars",
      });
      return { savedCars, savedCarIds };
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message, {
        id: "error saved cars",
      });
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ Save car API
export const createSaveCar = createAsyncThunk(
  "saved/createSaveCar",
  async (carId: string, { rejectWithValue }) => {
    try {
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      const token = localStorage.getItem("token");
      if (!user || !token) throw new Error("User not logged in");

      await axios.post(
        `${BACKEND_URL}/api/v1/dashboard/create-saved-car`,
        { userId: user.id, carId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Car saved successfully!");

      return carId;
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to save car"
      );
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ Unsave car API
export const removeSaveCar = createAsyncThunk(
  "saved/removeSaveCar",
  async (carId: string, { rejectWithValue }) => {
    try {
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      const token = localStorage.getItem("token");
      if (!user || !token) throw new Error("User not logged in");

      await axios.post(
        `${BACKEND_URL}/api/v1/dashboard/remove-saved-car`,
        { userId: user.id, savedCarId: carId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Removed saved car successfully!");

      return carId;
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to Remove saved car"
      );
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const savedSlice = createSlice({
  name: "saved",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSortOption: (state, action: PayloadAction<string>) => {
      state.sortOption = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedCars.fulfilled, (state, action) => {
        state.cars = action.payload.savedCars;
        state.savedCarIds = action.payload.savedCarIds;
      })
      .addCase(createSaveCar.fulfilled, (state, action) => {
        if (!state.savedCarIds.includes(action.payload))
          state.savedCarIds.push(action.payload);
      })
      .addCase(removeSaveCar.fulfilled, (state, action) => {
        state.savedCarIds = state.savedCarIds.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(createSaveCar.pending, (state, action) => {
        // 🟢 Heart turant green show karne ke liye
        if (!state.savedCarIds.includes(action.meta.arg)) {
          state.savedCarIds.push(action.meta.arg);
        }
      })
      .addCase(createSaveCar.rejected, (state, action) => {
        // ❌ Agar API fail ho gaya to rollback
        state.savedCarIds = state.savedCarIds.filter(
          (id) => id !== action.meta.arg
        );
      })
      .addCase(removeSaveCar.pending, (state, action) => {
        // 🟢 Heart turant gray show karne ke liye
        state.savedCarIds = state.savedCarIds.filter(
          (id) => id !== action.meta.arg
        );
      })
      .addCase(removeSaveCar.rejected, (state, action) => {
        // ❌ Agar API fail to rollback
        if (!state.savedCarIds.includes(action.meta.arg)) {
          state.savedCarIds.push(action.meta.arg);
        }
      });
  },
});

export const { setSearchTerm, setSortOption } = savedSlice.actions;
export default savedSlice.reducer;
