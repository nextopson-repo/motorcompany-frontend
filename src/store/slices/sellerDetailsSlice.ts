import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
// Use fetch here to explicitly set CORS mode and credentials

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
  likes: number;
  views: number;
  createdAt: string;
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
>("seller/fetchSellerCars", async ({ userId }, { rejectWithValue }) => {
  try {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const res = await fetch(`${BACKEND_URL}/api/v1/car/get-user-cars`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
      mode: "cors",
      credentials: "include",
    });
    const data: { cars: Array<Record<string, unknown>> } = await res.json();

    // Map backend cars to our Car interface
    const cars: Car[] = data.cars.map((c) => {
      const car = c as Record<string, unknown>;
      const address = (car.address as Record<string, unknown>) || {};
      return {
        id: String(car.id || ""),
        title: String(car.title || ""),
        image: (Array.isArray((car as any).images) && (car as any).images[0]) || "/fallback-car-img.png",
        kms: String((car as Record<string, any>).kmDriven || 0),
        type: String(car.bodyType || ""),
        seats: Number(car.seats || 4),
        mileage: (car as Record<string, any>).mileage ? `${(car as Record<string, any>).mileage} Kmpl` : "N/A",
        fuel: String((car as Record<string, any>).fuel || ""),
        transmission: String((car as Record<string, any>).transmission || ""),
        location: `${String(address.city || "")}, ${String(address.state || "")}`,
        price: String((car as Record<string, any>).price || 0),
        emi: (car as Record<string, any>).emi ? `₹ ${(car as Record<string, any>).emi} /mo` : `₹ 7599 /mo`,
        likes: Number((car as Record<string, any>).likes || 1),
        views: Number(((car as Record<string, any>).enquiries as any)?.viewProperty || 1),
        createdAt: String(car.createdAt),
      } as Car;
    });

    // Grab first car for seller info
    const firstCar = (data.cars?.[0] as Record<string, unknown>) || {};
    const owner = (firstCar.ownerDetails as Record<string, unknown>) || {};
    const fAddress = (firstCar.address as Record<string, unknown>) || {};
    const seller = {
      id: String(owner.id || ""),
      name: String(owner.name || ""),
      role: String(owner.role || "Owner"),
      joinDate: String(owner.joinDate || "10th September, 2025"),
      location: fAddress ? `${String(fAddress.city || "")}, ${String(fAddress.state || "")}` : "city, state",
      email: String(owner.email || ""),
      phone: String(owner.mobileNumber || ""),
      verified: Boolean(owner.verified ?? true),
      avatar: String(owner.avatar || "/default-men-logo.jpg"),
    } as Omit<SellerState, "cars" | "loading" | "error">;

    return { seller, cars };
  } catch (err) {
    const message = typeof err === "object" && err && "message" in err ? String((err as { message?: unknown }).message) : "Failed to fetch seller cars";
    return rejectWithValue(message);
  }
});

// ---------- Slice ----------
const sellerDetailsSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    setSeller(state, action: PayloadAction<SellerState>) {
      Object.assign(state, action.payload);
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
