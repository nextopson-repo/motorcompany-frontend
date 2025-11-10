import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

// ------------------
// Interfaces
// ------------------
interface Lead {
  id: number;
  name: string;
  city: string;
  timeAgo: string;
  image: string;
  carId: string;
  carName: string;
}

interface LeadsState {
  leads: Lead[];
  loading: boolean;
  error: string | null;
}

const initialState: LeadsState = {
  leads: [],
  loading: false,
  error: null,
};

// ------------------
// Base URL
// ------------------
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

// ------------------
// Async Thunk (Modified)
// ------------------
export const fetchCarLeads = createAsyncThunk(
  "leads/fetchCarLeads",
  async (
    payload: { userId?: string; carId?: string },
    { rejectWithValue }
  ) => {
    try {
      let bodyData = {};

      // ✅ case 1: agar carId diya gaya hai (Show Lead button case)
      if (payload.carId) {
        bodyData = { carId: payload.carId };
      }
      // ✅ case 2: otherwise userId use karo
      else if (payload.userId) {
        bodyData = { userId: payload.userId };
      } else {
        return rejectWithValue("Either userId or carId is required");
      }

      const res = await axios.post(`${BASE_URL}/api/v1/car/get-car-leads`, bodyData);

      console.log("📦 Car Leads Response:", res.data);
      toast.success("Car leads fetched successfully ✅", { id: "lead-success" });

      return res.data?.leads || [];
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch leads ❌", { id: "lead-error" });
      console.error("❌ Error fetching car leads:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch leads");
    }
  }
);


// ------------------
// Slice
// ------------------
const leadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload;
      })
      .addCase(fetchCarLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default leadsSlice.reducer;
