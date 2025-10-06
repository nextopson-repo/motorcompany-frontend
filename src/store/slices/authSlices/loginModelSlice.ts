import { createSlice } from "@reduxjs/toolkit";

const loginModalSlice = createSlice({
  name: "loginModal",
  initialState: { isOpen: false },
  reducers: {
    openLogin: (state) => { state.isOpen = true; },
    closeLogin: (state) => { state.isOpen = false; },
  },
});

export const { openLogin, closeLogin } = loginModalSlice.actions;
export default loginModalSlice.reducer;
