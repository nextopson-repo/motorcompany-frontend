// src/store/slices/carImageSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CarImageState {
  files: File[];
}

const initialState: CarImageState = {
  files: [],
};

const carImageSlice = createSlice({
  name: "carImage",
  initialState,
  reducers: {
    setCarImages(state, action: PayloadAction<File[]>) {
      state.files = action.payload;
    },
    addCarImages(state, action: PayloadAction<File[]>) {
      state.files = [...state.files, ...action.payload];
    },
    clearCarImages(state) {
      state.files = [];
    },
  },
});

export const { setCarImages, addCarImages, clearCarImages } = carImageSlice.actions;
export default carImageSlice.reducer;
