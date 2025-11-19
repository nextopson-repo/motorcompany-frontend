import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { cityData } from "../../data/cityData";

// --------------------
// Types
// --------------------
export interface Dealer {
  id: number;
  name: string;
  role: string;
  location: string;
  imageUrl: string;
}

interface DealerState {
  dealers: Dealer[];
  cities: string[];
  selectedCity: string;
  loading: boolean;
  error: string | null;
}

// --------------------
// Initial State
// --------------------
const initialState: DealerState = {
  dealers: [] as any[],
  cities: cityData,
  selectedCity: "",
  loading: false,
  error: null,
};

// --------------------
// Async Thunk (API Call)
// --------------------
export const fetchDealersByCity = createAsyncThunk(
  "dealers/fetchDealersByCity",
  async (city: string, { rejectWithValue }) => {
    const backend = import.meta.env.VITE_BACKEND_URL || "";
    try {
      const res = await axios.post(`${backend}/api/v1/dashboard/top-dealers`, {
        city,
        limit: 10,
      });
      return res.data.data || [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch dealers");
    }
  }
);


// --------------------
// Slice
// --------------------
const dealerSlice = createSlice({
  name: "dealers",
  initialState,
  reducers: {
    setDealers: (state, action: PayloadAction<Dealer[]>) => {
      state.dealers = action.payload;
    },
    setSelectedCity: (state, action: PayloadAction<string>) => {
      state.selectedCity = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDealersByCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDealersByCity.fulfilled, (state, action) => {
        state.loading = false;
        state.dealers = action.payload;
      })
      .addCase(fetchDealersByCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// --------------------
// Exports
// --------------------
export const { setDealers, setSelectedCity } = dealerSlice.actions;
export default dealerSlice.reducer;