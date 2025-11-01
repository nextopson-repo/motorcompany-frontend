import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
// Use axios for multipart/form-data; use fetch when CORS mode is required
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
}

interface ProfileState {
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
    if (!userStr) return rejectWithValue("User not found in localStorage");
    if (!token) return rejectWithValue("Token not found in localStorage");

    const user = JSON.parse(userStr) as { id?: string };
    if (!user?.id) return rejectWithValue("User ID not found");

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const res = await fetch(
      `${BACKEND_URL}/api/v1/profile/get-userProfile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
        mode: "cors",
        credentials: "include",
      }
    );

    const data = await res.json();
    if (!data?.data) return rejectWithValue("Invalid response from server");
    return data.data as UserProfile;
  } catch (err) {
    const message =
      typeof err === "object" && err && "message" in err
        ? String((err as { message?: unknown }).message || "Failed to fetch profile")
        : "Failed to fetch profile";
    return rejectWithValue(message);
  }
});

// --------------------
// Update Profile (supports image upload)
// --------------------
export const updateUserProfile = createAsyncThunk<
  UserProfile,
  Partial<UserProfile> & { userProfileFile?: File },
  { rejectValue: string }
>("profile/updateUserProfile", async (userData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!userStr) return rejectWithValue("User not found in localStorage");
    if (!token) return rejectWithValue("Token not found in localStorage");

    const user = JSON.parse(userStr) as { id?: string };
    if (!user?.id) return rejectWithValue("User ID not found");

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    // ✅ Build FormData (text + file fields)
    const formData = new FormData();
    formData.append("userId", user.id);

    for (const [key, value] of Object.entries(userData)) {
      if (value === undefined || value === null) continue;

      if (key === "userProfileFile" && value instanceof File) {
        formData.append("profileImage", value); // match backend field name
      } else {
        formData.append(key, String(value));
      }
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

    if (!res.data?.data) return rejectWithValue("Invalid response from update API");

    // ✅ Update token if provided
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    const updatedUser = res.data.data as UserProfile;

    // ✅ Update user in localStorage
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: user.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        userType: updatedUser.userType,
        isEmailVerified: updatedUser.emailVerified,
        isMobileVerified: true, // assuming mobile verified already
        userProfileUrl: updatedUser.userProfileUrl,
        isFullyVerified: false,
        mobileNumber: updatedUser.mobileNumber,
        profileImg: updatedUser.userProfileUrl,
      })
    );

    return updatedUser;
  } catch (err) {
    const message =
      typeof err === "object" && err && "message" in err
        ? String(
            (err as { message?: unknown }).message ||
              "Failed to update profile"
          )
        : "Failed to update profile";
    return rejectWithValue(message);
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
    if (!user?.email) return rejectWithValue("Email not found");

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
      mode: "cors",
      credentials: "include",
    });
    const data = await res.json();
    return { message: data.message || "OTP sent" };
  } catch (err) {
    const message =
      typeof err === "object" && err && "message" in err
        ? String((err as { message?: unknown }).message || "OTP sending failed")
        : "OTP sending failed";
    return rejectWithValue(message);
  }
});

export const verifyOtp = createAsyncThunk<
  { message: string },
  { otp: string },
  { rejectValue: string; state: { profile: ProfileState } }
>("profile/verifyOtp", async ({ otp }, { rejectWithValue, getState }) => {
  try {
    const { user } = getState().profile;
    if (!user?.email) return rejectWithValue("Email not found");

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, otp }),
      mode: "cors",
      credentials: "include",
    });
    const data = await res.json();
    return { message: data.message || "OTP verified" };
  } catch (err) {
    const message =
      typeof err === "object" && err && "message" in err
        ? String((err as { message?: unknown }).message || "OTP verification failed")
        : "OTP verification failed";
    return rejectWithValue(message);
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
      if (state.user) (state.user as Record<string, unknown>)[action.payload.field] = action.payload.value;
    },
    setOtp(state, action: PayloadAction<string>) {
      state.otp = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
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
      })
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