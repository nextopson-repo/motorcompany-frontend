import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
// Using fetch for endpoints where we need explicit CORS control

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
      type GetUserCarsResponse = { cars?: Car[] };
      const data: GetUserCarsResponse = await res.json();
      return data.cars || [];
    } catch (error) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: unknown }).message || "Failed to fetch cars")
          : "Failed to fetch cars";
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

      if (!userId) throw new Error("User ID not found in localStorage");

      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/car/update-is-sold`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ carId, isSold: true, userId }),
          mode: "cors",
          credentials: "include",
        }
      );
      return carId;
    } catch (error) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: unknown }).message || "Failed to mark sold")
          : "Failed to mark sold";
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

      if (!userId) throw new Error("User ID not found in localStorage");
      if (!token) throw new Error("Token not found in localStorage");
      await fetch(
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
      return carId;
    } catch (error) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: unknown }).message || "Failed to delete car")
          : "Failed to delete car";
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
      .addCase(
        fetchUserCars.fulfilled,
        (state, action: PayloadAction<Car[]>) => {
          state.loading = false;
          state.cars = action.payload;
        }
      )
      .addCase(fetchUserCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Mark sold
      .addCase(
        markCarAsSold.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.cars = state.cars.map((car) =>
            car.id === action.payload ? { ...car, isSold: true } : car
          );
        }
      )
      // Delete
      .addCase(deleteCar.fulfilled, (state, action: PayloadAction<string>) => {
        state.cars = state.cars.filter((car) => car.id !== action.payload);
      });
  },
});

export default listingsSlice.reducer;

// 🔥 DEMO ONLY SLICE (use when backend is not ready)
// After testing, you can delete this and switch back to your real slice.

// import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

// // -----------------------------
// // Car Interface
// // -----------------------------
// interface Car {
//   id: number;
//   title: string;
//   carImages: string[];
//   isSold: boolean;
//   liked: number;
//   kmDriven: number;
//   bodyType: string;
//   seats: number;
//   fuel: string;
//   transmission: string;
//   address: { city: string; state: string };
//   price: number;
//   trending: number;
//   time: string;
// }

// // -----------------------------
// // State Interface
// // -----------------------------
// interface ListingsState {
//   cars: Car[];
//   loading: boolean;
//   error: string | null;
// }

// // -----------------------------
// // Demo Data (fake cars)
// // -----------------------------
// const demoCars: Car[] = [
//   {
//     id: 1,
//     title: "Maruti Swift VDI new 2025 sports model",
//     carImages: ["/fallback-car-img.png"],
//     isSold: false,
//     liked: 12,
//     kmDriven: 45000,
//     bodyType: "Hatchback",
//     seats: 5,
//     fuel: "Diesel",
//     transmission: "Manual",
//     address: { city: "Delhi", state: "Delhi" },
//     price: 350000,
//     trending: 1,
//     time: "2025-09-19",
//   },
//   {
//     id: 2,
//     title: "Hyundai Creta SX",
//     carImages: ["/fallback-car-img.png"],
//     isSold: false,
//     liked: 22,
//     kmDriven: 30000,
//     bodyType: "SUV",
//     seats: 5,
//     fuel: "Petrol",
//     transmission: "Automatic",
//     address: { city: "Mumbai", state: "Maharashtra" },
//     price: 1050000,
//     trending: 2,
//     time: "2025-08-10",
//   },
//   {
//     id: 3,
//     title: "Honda City ZX",
//     carImages: ["/fallback-car-img.png"],
//     isSold: false,
//     liked: 18,
//     kmDriven: 60000,
//     bodyType: "Sedan",
//     seats: 5,
//     fuel: "Petrol",
//     transmission: "Manual",
//     address: { city: "Bangalore", state: "Karnataka" },
//     price: 800000,
//     trending: 3,
//     time: "2025-07-05",
//   },
// ];

// // -----------------------------
// // Initial State
// // -----------------------------
// const initialState: ListingsState = {
//   cars: [],
//   loading: false,
//   error: null,
// };

// // -----------------------------
// // Async Thunks (fake delay + demo data)
// // -----------------------------

// // ✅ Fetch cars (simulates API with delay)
// export const fetchUserCars = createAsyncThunk("listings/fetchUserCars", async () => {
//   return new Promise<Car[]>((resolve) => {
//     setTimeout(() => {
//       resolve(demoCars);
//     }, 800); // ⏳ simulate API delay
//   });
// });

// // ✅ Mark car as sold
// export const markCarAsSold = createAsyncThunk("listings/markCarAsSold", async (carId: number) => {
//   return new Promise<number>((resolve) => {
//     setTimeout(() => resolve(carId), 400);
//   });
// });

// // ✅ Delete car
// export const deleteCar = createAsyncThunk("listings/deleteCar", async (carId: number) => {
//   return new Promise<number>((resolve) => {
//     setTimeout(() => resolve(carId), 400);
//   });
// });

// // -----------------------------
// // Slice
// // -----------------------------
// const listingsSlice = createSlice({
//   name: "listings",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Fetch
//       .addCase(fetchUserCars.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserCars.fulfilled, (state, action: PayloadAction<Car[]>) => {
//         state.loading = false;
//         state.cars = action.payload;
//       })
//       .addCase(fetchUserCars.rejected, (state) => {
//         state.loading = false;
//         state.error = "Failed to fetch demo cars";
//       })

//       // Mark sold
//       .addCase(markCarAsSold.fulfilled, (state, action: PayloadAction<number>) => {
//         state.cars = state.cars.map((car) =>
//           car.id === action.payload ? { ...car, isSold: true } : car
//         );
//       })

//       // Delete
//       .addCase(deleteCar.fulfilled, (state, action: PayloadAction<number>) => {
//         state.cars = state.cars.filter((car) => car.id !== action.payload);
//       });
//   },
// });

// // -----------------------------
// // Export Reducer
// // -----------------------------
// export default listingsSlice.reducer;
