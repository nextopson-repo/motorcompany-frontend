import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface UserProfile {
  fullName: string;
  userType: string;
  mobileNumber: string;
  email: string;
  address: string;
  landmark: string;
  city: string;
  pin: string;
  avatar: string;
}

interface ProfileState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>(
  "profile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return rejectWithValue("User not found in localStorage");

      const user = JSON.parse(userStr) as { id?: string };
      if (!user?.id) return rejectWithValue("User ID not found");

      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/profile/get-userProfile`,
        { userId: user.id },
        { withCredentials: true }
      );

      if (!res.data?.data) return rejectWithValue("Invalid response from server");

      return res.data.data as UserProfile;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProfile>) {
      state.user = action.payload;
      state.error = null;
    },
    updateField(
      state,
      action: PayloadAction<{ field: keyof UserProfile; value: string }>
    ) {
      if (state.user) {
        state.user[action.payload.field] = action.payload.value;
      }
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch profile";
      });
  },
});

export const { setUser, updateField, setError, setLoading } = profileSlice.actions;
export default profileSlice.reducer;