import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// --- Types based on your Postman response ---
interface CarImage {
  id: string;
  imageKey: string;
  presignedUrl: string;
  imgClassifications: string;
  accurencyPercent: number;
  carId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface CarAddress {
  id: string;
  state: string;
  city: string;
  locality: string;
  latitude: string | null;
  longitude: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Car {
  id: string;
  userId: string;
  title: string | null;
  description: string | null;
  isActive: boolean;
  carName: string;
  brand: string;
  model: string;
  variant: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  ownership: string;
  manufacturingYear: number;
  registrationYear: number;
  isSale: string;
  carPrice: number;
  kmDriven: number;
  seats: number;
  isSold: boolean;
  workingWithDealer: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  address: CarAddress;
  carImages: CarImage[];
}

interface UploadCarResponse {
  success: boolean;
  message: string;
  car: Car;
  activeCar: number;
}

interface UploadState {
  loading: boolean;
  error: string | null;
  success: boolean;
  car?: Car;
}

const initialState: UploadState = {
  loading: false,
  error: null,
  success: false,
  car: undefined,
};

// --- Async thunk using FormData for file upload ---
export const uploadCar = createAsyncThunk<UploadCarResponse, any>(
  "carUpload/uploadCar",
  async (formData, { rejectWithValue }) => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");

      const res = await fetch(`${BACKEND_URL}/api/v1/car/create-update`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
        mode: "cors",
      });

      const data = await res.json();
      console.log("car upload:",data)
      if (!res.ok) {
         toast.error(data.message || "Failed to upload car");
        return rejectWithValue(data.message || "Failed to upload car");
      }
       toast.success("Your Car Uploaded Successfully!");
      return data;
    } catch (error: any) {
       toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// --- Slice ---
const carUploadSlice = createSlice({
  name: "carUpload",
  initialState,
  reducers: {
    resetUploadState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.car = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadCar.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        uploadCar.fulfilled,
        (state, action: PayloadAction<UploadCarResponse>) => {
          state.loading = false;
          state.success = true;
          state.car = action.payload.car;
        }
      )
      .addCase(uploadCar.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetUploadState } = carUploadSlice.actions;
export default carUploadSlice.reducer;