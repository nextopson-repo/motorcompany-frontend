import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactState {
  data: ContactFormData;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ContactState = {
  data: {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  },
  status: "idle",
  error: null,
};

// Async thunk to submit contact form
export const submitContactForm = createAsyncThunk(
  "contact/submitContactForm",
  async (formData: ContactFormData) => {
    const response = await axios.post("/api/contact", formData);
    return response.data;
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<{ field: keyof ContactFormData; value: string }>) => {
      state.data[action.payload.field] = action.payload.value;
    },
    resetForm: (state) => {
      state.data = initialState.data;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitContactForm.fulfilled, (state) => {
        state.status = "succeeded";
        state.data = initialState.data; // reset form on success
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to submit form";
      });
  },
});

export const { updateField, resetForm } = contactSlice.actions;
export default contactSlice.reducer;
