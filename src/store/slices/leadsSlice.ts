import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";

// ------------------
// Interfaces
// ------------------
interface Lead {
  id: number;
  name: string;
  city: string;
  timeAgo: string;
  image: string;
}

interface LeadsState {
  leads: Lead[];
  loading: boolean;
  error: string | null;
}

// ------------------
// Initial State
// ------------------
const initialState: LeadsState = {
  leads: [],
  loading: false,
  error: null,
};

// ------------------
// Async Thunk
// ------------------
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";
export const fetchCarLeads = createAsyncThunk(
  "leads/fetchCarLeads",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.user?.id;
      console.log("lead user id:",userId)

      if (!userId) {
        return rejectWithValue("User not logged in");
      }

      const res = await axios.post(`${BASE_URL}/api/v1/car/get-car-leads`, {
        userId,
      });

      console.log("📦 Car Leads Response:", res.data);

      return res.data?.data || []; // assuming API returns { data: [...] }
    } catch (err: any) {
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



// import { createSlice } from "@reduxjs/toolkit";

// interface Lead {
//   id: number;
//   name: string;
//   city: string;
//   timeAgo: string;
//   image: string;
// }

// interface LeadsState {
//   leads: Lead[];
// }

// const initialState: LeadsState = {
//   leads: [
//     {
//       id: 1,
//       name: "Sourav Chakraborty",
//       city: "Mumbai",
//       timeAgo: "3 weeks ago",
//       image: "https://randomuser.me/api/portraits/men/1.jpg",
//     },
//     {
//       id: 2,
//       name: "Marvin McKinney",
//       city: "Mumbai",
//       timeAgo: "3 weeks ago",
//       image: "https://randomuser.me/api/portraits/women/2.jpg",
//     },
//   ],
// };

// const leadsSlice = createSlice({
//   name: "leads",
//   initialState,
//   reducers: {},
// });

// export default leadsSlice.reducer;
