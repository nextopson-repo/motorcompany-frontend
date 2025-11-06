import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast"; // ✅ import toast
import type { RootState } from "../store";

// ---------------- TYPES ----------------
export interface Address {
  id: string;
  state: string;
  city: string;
  locality: string;
  latitude: number | null;
  longitude: number | null;
}

export interface Owner {
  id: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  userType?: string;
  userProfileUrl?: string | null;
}

export interface CarDetails {
  id: string;
  userId: string;
  carImages: string[];
  carName: string;
  brand: string;
  model: string;
  variant: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  ownership: string;
  manufacturingYear: number;
  registrationYear: number;
  isSale: string;
  carPrice: number;
  kmDriven: number;
  seats: number;
  isSold: boolean;
  isActive: boolean;
  title?: string | null;
  description?: string | null;
  address?: Address;
  owner: Owner;
}

export interface Enquiry {
  id: string;
  DealerName: string;
  DealerRole: string;
  mobileNumber: string;
  timeAgo: string;
  carId: string;
  carTitle: string;
  calling: boolean;
  carDetails: CarDetails;
}

interface EnquiriesState {
  enquiries: Enquiry[];
  loading: boolean;
  error: string | null;
  creating: boolean;
}

// ---------------- INITIAL STATE ----------------
const initialState: EnquiriesState = {
  enquiries: [],
  loading: false,
  creating: false,
  error: null,
};

// ---------------- BASE URL ----------------
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

// ---------------- THUNKS ----------------

// ✅ Create new enquiry
export const createEnquiry = createAsyncThunk<
  any,
  { carId: string; userId: string; calling: boolean },
  { rejectValue: string }
>("enquiries/create", async (payload, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${BASE_URL}/api/v1/dashboard/create-car-enquiry`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    toast.success("Enquiry created successfully 🚗", { id: "create-enquiry" }); // ✅ Toast success
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to create enquiry";
    toast.error(message, { id: "create-enquiry-error" }); // ❌ Toast error
    return thunkAPI.rejectWithValue(message);
  }
});

// ✅ Fetch all enquiries
export const fetchEnquiries = createAsyncThunk<
  Enquiry[],
  { userId: string },
  { rejectValue: string }
>("enquiries/fetchAll", async ({ userId }, thunkAPI) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/dashboard/get-all-car-enquiries`,
      { userId }
    );

    const data = response.data?.carEnquiries || [];
    toast.success("Enquiries loaded successfully 💬", { id: "fetch-enquiries" }); // ✅ Toast success
    return data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to fetch enquiries";
    toast.error(message, { id: "fetch-enquiries-error" }); // ❌ Toast error
    return thunkAPI.rejectWithValue(message);
  }
});

// ✅ Fetch car details
export const fetchCarDetailsById = createAsyncThunk<
  { carId: string; carDetails: CarDetails; ownerDetails: Owner },
  string,
  { state: RootState; rejectValue: string }
>("enquiries/fetchCarDetailsById", async (carId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/api/v1/car/get-car-by-id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ carId }),
      mode: "cors",
    });

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();

    // toast.success("Car details fetched successfully 🏎️", {
    //   id: "fetch-car-details",
    // }); // ✅ Toast success

    const carDetailsWithOwner = { ...data.car, owner: data.owner };
    return { carId, carDetails: carDetailsWithOwner, ownerDetails: data.owner };
  } catch (err: any) {
    const message = err.message || "Failed to fetch car details";
    toast.error(message, { id: "fetch-car-details-error" }); // ❌ Toast error
    return rejectWithValue(message);
  }
});

// ---------------- SLICE ----------------
const enquiriesSlice = createSlice({
  name: "enquiries",
  initialState,
  reducers: {
    toggleCalling: (state, action: PayloadAction<string>) => {
      const enquiry = state.enquiries.find((e) => e.id === action.payload);
      if (enquiry) enquiry.calling = !enquiry.calling;
    },
  },
  extraReducers: (builder) => {
    builder
      // 📩 Create Enquiry
      .addCase(createEnquiry.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createEnquiry.fulfilled, (state, action) => {
        state.creating = false;
        if (action.payload?.newEnquiry) {
          state.enquiries.unshift(action.payload.newEnquiry);
        }
      })
      .addCase(createEnquiry.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || "Failed to create enquiry";
      })

      // 📦 Fetch Enquiries
      .addCase(fetchEnquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiries = action.payload;
      })
      .addCase(fetchEnquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load enquiries";
      })

      // 🚗 Fetch Car Details
      .addCase(fetchCarDetailsById.fulfilled, (state, action) => {
        const enquiry = state.enquiries.find(
          (e) => e.carId === action.payload.carId
        );
        if (enquiry) enquiry.carDetails = action.payload.carDetails;
      });
  },
});

export const { toggleCalling } = enquiriesSlice.actions;
export default enquiriesSlice.reducer;
