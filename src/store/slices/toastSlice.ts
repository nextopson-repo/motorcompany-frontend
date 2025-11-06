import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ToastState {
  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: ToastState = {
  successMessage: null,
  errorMessage: null,
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    setSuccessMessage(state, action: PayloadAction<string | null>) {
      state.successMessage = action.payload;
    },
    setErrorMessage(state, action: PayloadAction<string | null>) {
      state.errorMessage = action.payload;
    },
  },
  
});

export const { setSuccessMessage, setErrorMessage } = toastSlice.actions;
export default toastSlice.reducer;
