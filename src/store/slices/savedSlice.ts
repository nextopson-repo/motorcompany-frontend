import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { CarRecord } from "../../types/car";
import axios from "axios";
import toast from "react-hot-toast";

interface SavedState {
  cars: CarRecord[];
  savedCarIds: string[]; // saved table IDs
  savedCarIdsByCarId: string[]; // actual CAR IDs
  searchTerm: string;
  sortOption: string;
  loading: boolean;
  error: string | null;
}

const initialState: SavedState = {
  cars: [],
  savedCarIds: [],
  savedCarIdsByCarId: [],
  searchTerm: "",
  sortOption: "popularity",
  loading: false,
  error: null,
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/* ---------------------------------------------------------
   FETCH SAVED CARS
--------------------------------------------------------- */
export const fetchSavedCars = createAsyncThunk(
  "saved/fetchSavedCars",
  async (_, { rejectWithValue }) => {
    try {
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      const token = localStorage.getItem("token");

      if (!user || !token) {
        return { savedCars: [], savedCarIds: [], savedCarIdsByCarId: [] };
      }

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/dashboard/get-saved-cars`,
        { userId: user.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const list = response.data.result.savedCars || [];

      const savedCars: CarRecord[] = list
        .map((item: any) => {
          const car = item.property;
          if (!car) return null;

          return {
            id: car.id,
            brand: car.brand,
            model: car.model,
            fuelType: car.fuelType,
            transmission: car.transmission,
            bodyType: car.bodyType,
            ownership: car.ownership,
            seats: car.seats,
            carPrice: car.carPrice,
            manufacturingYear: car.manufacturingYear,
            kmDriven: car.kmDriven,

            address: {
              state: car.state,
              city: car.city || car.address?.city,
            },

            carImages: car.carImages?.map((img: any) => ({
              imageKey: img,
              imageUrl: img,
            })),

            user: {
              fullName: user.fullName || "Unknown",
              userType: user.userType || "unknown",
            },

            savedCarId: item.savedCar.id,
            createdAt: car.createdAt,
            updatedAt: car.updatedAt,
          };
        })
        .filter(Boolean);

      const savedCarIds = list.map((i: any) => String(i.savedCar.id));
      const savedCarIdsByCarId = list.map((i: any) => String(i.property?.id));

      return { savedCars, savedCarIds, savedCarIdsByCarId };
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ---------------------------------------------------------
   SAVE CAR
--------------------------------------------------------- */
export const createSaveCar = createAsyncThunk(
  "saved/createSaveCar",
  async (carId: string, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user")!);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${BACKEND_URL}/api/v1/dashboard/create-saved-car`,
        { userId: user.id, carId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("res create saved car:", res.data);

      const savedCarId = res.data.newCar.id;
      toast.success("Car saved!");

      return { savedCarId: String(savedCarId), carId: String(carId) };
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ---------------------------------------------------------
   REMOVE SAVED CAR
--------------------------------------------------------- */
export const removeSaveCar = createAsyncThunk(
  "saved/removeSaveCar",
  async (carId: string, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user")!);
      const token = localStorage.getItem("token");

      await axios.post(
        `${BACKEND_URL}/api/v1/dashboard/remove-saved-car`,
        { userId: user.id, savedCarId: carId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Removed saved car!");

      return carId;
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ---------------------------------------------------------
   SLICE
--------------------------------------------------------- */
const savedSlice = createSlice({
  name: "saved",
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setSortOption(state, action) {
      state.sortOption = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchSavedCars.fulfilled, (state, action) => {
        state.cars = action.payload.savedCars;
        state.savedCarIds = action.payload.savedCarIds;
        state.savedCarIdsByCarId = action.payload.savedCarIdsByCarId;
      })

      /* SAVE — optimistic */
      // .addCase(createSaveCar.pending, (state, action) => {
      //   const carId = action.meta.arg;
      //   if (!state.savedCarIdsByCarId.includes(carId)) {
      //     state.savedCarIdsByCarId.push(carId);
      //   }
      // })

      .addCase(createSaveCar.fulfilled, (state, action) => {
        const { savedCarId, carId } = action.payload;

        if (!state.savedCarIdsByCarId.includes(carId)) {
          state.savedCarIdsByCarId.push(carId);
        }

        if (!state.savedCarIds.includes(savedCarId)) {
          state.savedCarIds.push(savedCarId);
        }

        // ⭐ store entry inside savedCars array
        state.cars.push({
          id: carId, // actual carId
          savedCarId: savedCarId, // table id saved for unsave
        } as any);
      })

      .addCase(createSaveCar.rejected, (state, action) => {
        const carId = action.meta.arg;
        state.savedCarIdsByCarId = state.savedCarIdsByCarId.filter(
          (id) => id !== carId
        );
      })

      .addCase(removeSaveCar.pending, (state, action) => {
        const carId = action.meta.arg;

        // remove from savedCarIdsByCarId instantly
        state.savedCarIdsByCarId = state.savedCarIdsByCarId.filter(
          (id) => id !== carId
        );

        // remove savedCars instantly
        state.cars = state.cars.filter((c) => String(c.id) !== carId);

        // remove savedCarIds (table ids may remain but optional)
        state.savedCarIds = state.savedCarIds.filter((id) => id !== carId);
      })

      .addCase(removeSaveCar.fulfilled, (state, action) => {
        const carId = action.payload;

        state.savedCarIdsByCarId = state.savedCarIdsByCarId.filter(
          (id) => id !== String(carId)
        );

        state.cars = state.cars.filter((c) => String(c.id) !== String(carId));

        state.savedCarIds = state.savedCarIds.filter((id) => id !== carId);
      })

      /* REMOVE — rollback */
      .addCase(removeSaveCar.rejected, (state, action) => {
        const carId = action.meta.arg;

        // rollback add carId back
        if (!state.savedCarIdsByCarId.includes(carId)) {
          state.savedCarIdsByCarId.push(carId);
        }
      });
  },
});

export const { setSearchTerm, setSortOption } = savedSlice.actions;
export default savedSlice.reducer;
