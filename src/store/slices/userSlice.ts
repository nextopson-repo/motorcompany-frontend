import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: {
    id?: string;
    name?: string;
    phone?: string;
    email?: string;
    image?: string;
  } | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<UserState["user"]>) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<Partial<UserState["user"]>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { loginUser, logoutUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
