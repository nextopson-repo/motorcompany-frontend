import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

interface Buyer {
  id: number;
  name: string;
  role: string;
  phone: string;
  location: string;
  preferences: string[];
  imageUrl: string;
}

interface BuyersState {
  buyers: Buyer[];
  loading: boolean;
  error: string | null;
}

const initialState: BuyersState = {
  buyers: [],
  loading: false,
  error: null,
};

// ✅ Fetch Buyers
export const fetchBuyers = createAsyncThunk<
  Buyer[],
  void,
  { rejectValue: string }
>("buyers/fetchBuyers", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "https://www.dhikkar.online/api/v1/hotleads/get",
      { page: 1, limit: 10 },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const leads = response.data.data.leads;

    const buyers = leads.map((lead: any) => ({
      id: lead.id,
      name: lead.userName,
      role: "buyer",
      phone: String(lead.userPhone),
      location: [lead.city].filter(Boolean).join(", "),
      preferences: lead.details?.brand ? [lead.details.brand] : [],
      imageUrl: lead.userProfileUrl || "/default-buyer-profile.png",
    }));

    // ✅ show toast once per successful fetch
    toast.success("Buyers fetched successfully!", { id: "buyers-fetch" });

    return buyers;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Failed to fetch buyers";

    toast.error(message, { id: "buyers-fetch-error" });
    return rejectWithValue(message);
  }
});

// ✅ Slice
const buyersSlice = createSlice({
  name: "buyers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuyers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBuyers.fulfilled,
        (state, action: PayloadAction<Buyer[]>) => {
          state.buyers = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchBuyers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default buyersSlice.reducer;
