// // src/redux/slices/profileSlice.ts
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

// // ✅ Async thunk to fetch user profile
// export const fetchUserProfile = createAsyncThunk(
//   "profile/fetchUserProfile",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/v1/profile/get-userProfile", {
//         withCredentials: true, // if backend uses cookies
//       });
//       return res.data.data; // adjust if API response shape is different
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
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { setUser, updateField, setError, setLoading } = profileSlice.actions;
// export default profileSlice.reducer;


// src/redux/slices/profileSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserProfile {
  avatar: string;
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
    avatar: "/user-img.png",
    fullName: "John Doe",
    userType: "Owner",
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
