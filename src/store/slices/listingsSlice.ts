import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import toast from "react-hot-toast"; // ✅ Toast added

interface Car {
  id: string;
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
  enquiries:{ viewProperty: number, calling: number};
  isSaved: boolean;
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
      if (!userId) {
        toast.error("User not logged in", { id: "not login" });
        return [];
      }

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/car/get-user-cars`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
          mode: "cors",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Failed to fetch cars");

      toast.success("Your cars loaded successfully!", { id: "car-load" });
      return data.cars || [];
    } catch (error: any) {
      const message = error?.message || "Failed to fetch cars";
      toast.error(message, { id: "fetch error" });
      return rejectWithValue(message);
    }
  }
);

// ✅ Mark as sold
export const markCarAsSold = createAsyncThunk(
  "listings/markCarAsSold",
  async (carId: string, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user?.id;

      if (!userId) throw new Error("User not logged in");

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/car/update-is-sold`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ carId, isSold: true, userId }),
          mode: "cors",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Failed to mark car sold");

      toast.success("Car marked as sold ✅", { id: "mark as sold" });
      return carId;
    } catch (error: any) {
      const message = error?.message || "Failed to mark sold";
      toast.error(message, { id: "sold Error" });
      return rejectWithValue(message);
    }
  }
);

// ✅ Delete car
export const deleteCar = createAsyncThunk(
  "listings/deleteCar",
  async (carId: string, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user?.id;
      const token = localStorage.getItem("token");

      if (!userId) throw new Error("User not logged in");
      if (!token) throw new Error("Token missing, please login again");

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/car/delete-car`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ carId, userId }),
          mode: "cors",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Failed to delete car");

      toast.success("Car deleted successfully 🗑️", { id: "car delete" });
      return carId;
    } catch (error: any) {
      const message = error?.message || "Failed to delete car";
      toast.error(message, { id: "car delete error" });
      return rejectWithValue(message);
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
      .addCase(markCarAsSold.fulfilled, (state, action: PayloadAction<string>) => {
        state.cars = state.cars.map((car) =>
          car.id === action.payload ? { ...car, isSold: true } : car
        );
      })
      // Delete
      .addCase(deleteCar.fulfilled, (state, action: PayloadAction<string>) => {
        state.cars = state.cars.filter((car) => car.id !== action.payload);
      });
  },
});

export default listingsSlice.reducer;