import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
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

// ✅ Fetch Buyers (using fetch instead of axios)
export const fetchBuyers = createAsyncThunk<
  Buyer[],
  void,
  { rejectValue: string }
>("buyers/fetchBuyers", async (_, { rejectWithValue }) => {
  try {
    const backend = import.meta.env.VITE_BACKEND_URL || "";
    const token = localStorage.getItem("token");

    const response = await fetch(`${backend}/api/v1/hotleads/get`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ page: 1, limit: 10 }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || "Failed to fetch buyers");
    }

    const data = await response.json();
    const leads = data.data?.leads || [];

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
    const message = error.message || "Failed to fetch buyers";
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
