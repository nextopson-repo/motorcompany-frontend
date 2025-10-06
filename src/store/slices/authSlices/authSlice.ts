import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// ---------- Thunks for APIs ----------

export const selectAuth = (state: RootState) => state.auth;

// 1) Signup
export const signup = createAsyncThunk(
  "auth/signup",
  async (
    { fullName, email, mobileNumber, userType }: 
    { fullName: string; email: string; mobileNumber: string; userType: string },
    thunkAPI
  ) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, mobileNumber, userType }),
      });
      return await res.json();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 2) Send OTP
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async ({ mobileNumber }: { mobileNumber: string }, thunkAPI) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber }),
      });
      return await res.json();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 3) Verify OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (
    { userId, otp }: { userId: string; otp: string },
    thunkAPI
  ) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otpType: "mobile", otp }),
      });
      return await res.json();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 4) Login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return await res.json();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 5) Resend Email OTP
export const resendEmailOtp = createAsyncThunk(
  "auth/resendEmailOtp",
  async ({ email }: { email: string }, thunkAPI) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/resend-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return await res.json();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 6) Resend Mobile OTP
export const resendMobileOtp = createAsyncThunk(
  "auth/resendMobileOtp",
  async ({ mobileNumber }: { mobileNumber: string }, thunkAPI) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/resend-mobile-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber }),
      });
      return await res.json();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 7) Update User Type
export const updateUserType = createAsyncThunk(
  "auth/updateUserType",
  async ({ userId, userType }: { userId: string; userType: string }, thunkAPI) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/update-user-type`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userType }),
      });
      return await res.json();
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ---------- Slice ----------
interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setAuth: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", state.token || '');
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    updateUser: (state, action: PayloadAction<Partial<any>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    // ✅ common handling for all thunks
    const pending = (state: AuthState) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state: AuthState, action: any) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    };

    builder
      .addCase(signup.pending, pending)
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(signup.rejected, rejected)

      .addCase(sendOtp.pending, pending)
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOtp.rejected, rejected)

      .addCase(verifyOtp.pending, pending)
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.responseObject?.user) {
          state.user = action.payload.responseObject.user;
          state.token = action.payload.responseObject.token;
          localStorage.setItem("token", state.token || "");
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addCase(verifyOtp.rejected, rejected)

      .addCase(login.pending, pending)
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.token) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          localStorage.setItem("token", state.token);
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addCase(login.rejected, rejected)

      .addCase(resendEmailOtp.pending, pending)
      .addCase(resendEmailOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendEmailOtp.rejected, rejected)

      .addCase(resendMobileOtp.pending, pending)
      .addCase(resendMobileOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendMobileOtp.rejected, rejected)

      .addCase(updateUserType.pending, pending)
      .addCase(updateUserType.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.userType = action.payload.userType;
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addCase(updateUserType.rejected, rejected);
  },
});

export const { logout, setAuth, updateUser } = authSlice.actions;
export default authSlice.reducer;
