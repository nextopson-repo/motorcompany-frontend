import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import type { RootState } from "../store";

// --------------------
// Types
// --------------------
export interface UserProfile {
  fullName: string;
  userType: string;
  mobileNumber: string;
  email: string;
  emailVerified: boolean;
  address: string;
  landmark: string;
  city: string;
  pin: string;
  userProfileUrl: string;
  subscriptionsType?: string;
}

interface ProfileState {
  success: boolean;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  otp: string;
  otpSent: boolean;
  otpVerified: boolean;
  verifyingOtp: boolean;
}

// --------------------
// Initial State
// --------------------
const initialState: ProfileState = {
  success: false,
  user: null,
  loading: false,
  error: null,
  otp: "",
  otpSent: false,
  otpVerified: false,
  verifyingOtp: false,
};

// --------------------
// Fetch User Profile
// --------------------
export const fetchUserProfile = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>("profile/fetchUserProfile", async (_, { rejectWithValue }) => {
  try {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!userStr) throw new Error("User not found in localStorage");
    if (!token) throw new Error("Token not found in localStorage");

    const user = JSON.parse(userStr) as { id?: string };
    if (!user?.id) throw new Error("User ID not found");

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const res = await fetch(`${BACKEND_URL}/api/v1/profile/get-userProfile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: user.id }),
      mode: "cors",
      credentials: "include",
    });

    const data = await res.json();
    if (!data?.data) throw new Error("Invalid response from server");
    return data.data as UserProfile;
  } catch (err: any) {
    const msg = err.message || "Failed to fetch profile";
    toast.error(msg, { id: "error" });
    return rejectWithValue(msg);
  }
});

// --------------------
// Update Profile
// --------------------
export const updateUserProfile = createAsyncThunk<
  UserProfile,
  Partial<UserProfile> & { userProfileFile?: File },
  { rejectValue: string }
>("profile/updateUserProfile", async (userData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!userStr) throw new Error("User not found in localStorage");
    if (!token) throw new Error("Token not found in localStorage");

    const user = JSON.parse(userStr) as { id?: string };
    if (!user?.id) throw new Error("User ID not found");

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const formData = new FormData();
    formData.append("userId", user.id);

    for (const [key, value] of Object.entries(userData)) {
      if (!value) continue;
      if (key === "userProfileFile" && value instanceof File)
        formData.append("profileImage", value);
      else formData.append(key, String(value));
    }

    const axios = (await import("axios")).default;
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/profile/profile-edit`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    if (!res.data?.data) throw new Error("Invalid response from update API");

    if (res.data.token) localStorage.setItem("token", res.data.token);
    const updatedUser = res.data.data as UserProfile;

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: user.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        userType: updatedUser.userType,
        isEmailVerified: updatedUser.emailVerified,
        isMobileVerified: true,
        userProfileUrl: updatedUser.userProfileUrl,
        mobileNumber: updatedUser.mobileNumber,
        profileImg: updatedUser.userProfileUrl,
      })
    );

    toast.success("Profile updated successfully!", { id: "profile-update" });
    return updatedUser;
  } catch (err: any) {
    const msg = err.message || "Failed to update profile";
    toast.error(msg, { id: "profile-update error" });
    return rejectWithValue(msg);
  }
});

// --------------------
// OTP Send & Verify
// --------------------
export const sendOtp = createAsyncThunk<
  { message: string },
  void,
  { rejectValue: string; state: { profile: ProfileState } }
>("profile/sendOtp", async (_, { rejectWithValue, getState }) => {
  try {
    const { user } = getState().profile;
    if (!user?.email) throw new Error("Email not found");

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
      mode: "cors",
      credentials: "include",
    });
    const data = await res.json();

    toast.success("OTP sent successfully!", { id: "otp send" });
    return { message: data.message || "OTP sent" };
  } catch (err: any) {
    const msg = err.message || "OTP sending failed";
    toast.error(msg, { id: "otp error" });
    return rejectWithValue(msg);
  }
});

export const verifyOtp = createAsyncThunk<
  { message: string },
  { otp: string },
  { rejectValue: string; state: { profile: ProfileState } }
>("profile/verifyOtp", async ({ otp }, { rejectWithValue, getState }) => {
  try {
    const { user } = getState().profile;
    if (!user?.email) throw new Error("Email not found");

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, otp }),
      mode: "cors",
      credentials: "include",
    });
    const data = await res.json();

    toast.success("OTP verified successfully!", { id: "otp verified" });
    return { message: data.message || "OTP verified" };
  } catch (err: any) {
    const msg = err.message || "OTP verification failed";
    toast.error(msg, { id: "otp error" });
    return rejectWithValue(msg);
  }
});

// --------------------
// Slice
// --------------------
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
      if (state.user)
        (state.user as Record<string, unknown>)[action.payload.field] =
          action.payload.value;
    },
    setOtp(state, action: PayloadAction<string>) {
      state.otp = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      if (action.payload) toast.error(action.payload, { id: "error message" });
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    resetOtpState(state) {
      state.otp = "";
      state.otpSent = false;
      state.otpVerified = false;
    },
    clearProfile(state) {
      Object.assign(state, initialState);
      toast.success("Profile cleared!", { id: "profile-clear" });
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
         state.success = false;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true; // ✅ mark as success
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch profile";
         state.success = false;
      })
      // Update
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update profile";
      })
      // OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send OTP";
      })
      .addCase(verifyOtp.pending, (state) => {
        state.verifyingOtp = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.verifyingOtp = false;
        state.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.verifyingOtp = false;
        state.error = action.payload || "OTP verification failed";
      });
  },
});

// --------------------
// Exports
// --------------------
export const {
  setUser,
  updateField,
  setOtp,
  setError,
  setLoading,
  resetOtpState,
  clearProfile,
} = profileSlice.actions;

export const selectUserProfile = (state: RootState) => state.profile.user;
export const selectProfileLoading = (state: RootState) => state.profile.loading;
export const selectProfileError = (state: RootState) => state.profile.error;

export default profileSlice.reducer;
