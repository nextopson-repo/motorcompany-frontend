import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";

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
  userProfile: File;
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

const initialState: ProfileState = {
  user: null,
  loading: false,
  error: null,
  otp: "",
  otpSent: false,
  otpVerified: false,
  verifyingOtp: false,
};

// Fetch profile
export const fetchUserProfile = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>("profile/fetchUserProfile", async (_, { rejectWithValue }) => {
  try {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!userStr) return rejectWithValue("User not found in localStorage");
    if (!token) return rejectWithValue("token not found in localStorage");

    const user = JSON.parse(userStr) as { id?: string };
    if (!user?.id) return rejectWithValue("User ID not found");
    console.log(user);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/profile/get-userProfile`,
      { userId: user.id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    if (!res.data?.data) return rejectWithValue("Invalid response from server");

    console.log("getProfile", res.data.data);

    return res.data.data as UserProfile;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch profile"
    );
  }
});

// 🧩 Update User Profile
export const updateUserProfile = createAsyncThunk<
  UserProfile,
  Partial<UserProfile> & { userProfile?: File },
  { rejectValue: string }
>("profile/updateUserProfile", async (userData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!userStr) return rejectWithValue("User not found in localStorage");
    if (!token) return rejectWithValue("Token not found in localStorage");

    const user = JSON.parse(userStr) as { id?: string };
    if (!user?.id) return rejectWithValue("User ID not found");

    // ✅ Convert all data into FormData
    const formData = new FormData();
    formData.append("userId", user.id);

    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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

    if (!res.data?.data)
      return rejectWithValue("Invalid response from update API");

    localStorage.setItem("token", res.data.token);

    return res.data.data as UserProfile;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to update profile"
    );
  }
});

// Send OTP
export const sendOtp = createAsyncThunk<
  { message: string },
  void,
  { rejectValue: string; state: { profile: ProfileState } }
>("profile/sendOtp", async (_, { rejectWithValue, getState }) => {
  try {
    const { user } = getState().profile;
    if (!user?.email) return rejectWithValue("Email not found");

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/auth/send-otp`,
      { email: user.email },
      { withCredentials: true }
    );
    return { message: res.data.message || "OTP sent" };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "OTP sending failed");
  }
});

// Verify OTP
export const verifyOtp = createAsyncThunk<
  { message: string },
  { otp: string },
  { rejectValue: string; state: { profile: ProfileState } }
>("profile/verifyOtp", async ({ otp }, { rejectWithValue, getState }) => {
  try {
    const { user } = getState().profile;
    if (!user?.email) return rejectWithValue("Email not found");

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const res = await axios.post(
      `${BACKEND_URL}/api/v1/auth/verify-otp`,
      { email: user.email, otp },
      { withCredentials: true }
    );
    return { message: res.data.message || "OTP verified" };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "OTP verification failed"
    );
  }
});

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
    clearProfile: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
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

// import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export interface UserProfile {
//   fullName: string;
//   userType: string;
//   mobileNumber: string;
//   email: string;
//   address: string;
//   landmark: string;
//   city: string;
//   pin: string;
//   avatar: string;
// }

// interface ProfileState {
//   user: UserProfile | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ProfileState = {
//   user: null,
//   loading: false,
//   error: null,
// };

// export const fetchUserProfile = createAsyncThunk<
//   UserProfile,
//   void,
//   { rejectValue: string }
// >(
//   "profile/fetchUserProfile",
//   async (_, { rejectWithValue }) => {
//     try {
//       const userStr = localStorage.getItem("user");
//       if (!userStr) return rejectWithValue("User not found in localStorage");

//       const user = JSON.parse(userStr) as { id?: string };
//       if (!user?.id) return rejectWithValue("User ID not found");

//       const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
//       const res = await axios.post(
//         `${BACKEND_URL}/api/v1/profile/get-userProfile`,
//         { userId: user.id },
//         { withCredentials: true }
//       );

//       if (!res.data?.data) return rejectWithValue("Invalid response from server");

//       return res.data.data as UserProfile;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
//     }
//   }
// );

// const profileSlice = createSlice({
//   name: "profile",
//   initialState,
//   reducers: {
//     setUser(state, action: PayloadAction<UserProfile>) {
//       state.user = action.payload;
//       state.error = null;
//     },
//     updateField(
//       state,
//       action: PayloadAction<{ field: keyof UserProfile; value: string }>
//     ) {
//       if (state.user) {
//         state.user[action.payload.field] = action.payload.value;
//       }
//     },
//     setError(state, action: PayloadAction<string | null>) {
//       state.error = action.payload;
//     },
//     setLoading(state, action: PayloadAction<boolean>) {
//       state.loading = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUserProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(fetchUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to fetch profile";
//       });
//   },
// });

// export const { setUser, updateField, setError, setLoading } = profileSlice.actions;
// export default profileSlice.reducer;
