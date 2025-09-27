import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// ---------- Interfaces ----------
export interface Car {
  id: string;
  title: string;
  image: string;
  kms: string;
  type: string;
  seats: number;
  mileage: string;
  fuel: string;
  transmission: string;
  location: string;
  price: string;
  emi: string;
  likes: number;
  views: number;
}

export interface SellerState {
  id: string;
  name: string;
  role: string;
  joinDate: string;
  location: string;
  email: string;
  phone: string;
  verified: boolean;
  avatar: string;
  cars: Car[];
  loading: boolean;
  error: string | null;
}

// ---------- Initial State ----------
const initialState: SellerState = {
  id: "",
  name: "",
  role: "Seller",
  joinDate: "",
  location: "",
  email: "",
  phone: "",
  verified: false,
  avatar: "/default-avatar.png",
  cars: [],
  loading: false,
  error: null,
};

// ---------- Thunk to Fetch Seller Cars ----------
export const fetchSellerCars = createAsyncThunk<
  { seller: Omit<SellerState, "cars" | "loading" | "error">; cars: Car[] },
  { userId: string }
>(
  "seller/fetchSellerCars",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.post(`${BACKEND_URL}/api/v1/car/get-user-cars`, { userId });

      const data = res.data;

      // Map backend cars to our Car interface
      const cars: Car[] = data.cars.map((c: any) => ({
        id: c.id,
        title: c.title,
        image: c.images?.[0] || "/fallback-car-img.png",
        kms: c.kmDriven || 0,
        type: c.bodyType || "",
        seats: c.seats || 4,
        mileage: c.mileage ? `${c.mileage} Kmpl` : "N/A",
        fuel: c.fuel || "",
        transmission: c.transmission || "",
        location: `${c.address?.city || ""}, ${c.address?.state || ""}`,
        price: c.price || 0,
        emi: c.emi ? `₹ ${c.emi} /mo` : `₹ 7599 /mo`,
        likes: c.likes || 1,
        views: c.enquiries?.viewProperty || 1,
      }));

      // Grab first car for seller info
      const firstCar = data.cars?.[0] || {};
      const seller = {
        id: firstCar.ownerDetails?.id || "",
        name: firstCar.ownerDetails?.name || "",
        role: firstCar.ownerDetails?.role || "Owner",
        joinDate: firstCar.ownerDetails?.joinDate || "10th September, 2025",
        location: firstCar.address
          ? `${firstCar.address.city}, ${firstCar.address.state}`
          : "city, state",
        email: firstCar.ownerDetails?.email || "",
        phone: firstCar.ownerDetails?.mobileNumber || "",
        verified: firstCar.ownerDetails?.verified || true,
        avatar: firstCar.ownerDetails?.avatar || "/default-men-logo.jpg",
      };

      return { seller, cars };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ---------- Slice ----------
const sellerDetailsSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    setSeller(_, action: PayloadAction<SellerState>) {
      return action.payload;
    },
    clearSeller() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerCars.fulfilled, (state, action) => {
        const { seller, cars } = action.payload;
        Object.assign(state, seller);
        state.cars = cars;
        state.loading = false;
      })
      .addCase(fetchSellerCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSeller, clearSeller } = sellerDetailsSlice.actions;
export default sellerDetailsSlice.reducer;
