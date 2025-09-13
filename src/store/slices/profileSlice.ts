// src/redux/slices/profileSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserProfile {
  fullName: string;
  userType: string;
  mobileNumber: string;
  email: string;
  address: string;
  landmark: string;
  city: string;
  pin: string;
}

interface ProfileState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: {
    fullName: "John Doe",
    userType: "Customer",
    mobileNumber: "9876543210",
    email: "john@example.com",
    address: "123 Main Street",
    landmark: "Near Mall",
    city: "Mumbai",
    pin: "400001",
  },
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProfile>) {
      state.user = action.payload;
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
});

export const { setUser, updateField, setError, setLoading } =
  profileSlice.actions;
export default profileSlice.reducer;
