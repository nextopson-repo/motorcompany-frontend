import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { CarRecord, FiltersState } from "../../types/car";

export interface CarsState {
  cars: CarRecord[];
  filters: FiltersState;
  selectedFilters: FiltersState;
  searchTerm: string;
  sortOption:
    | "yearNewToOld"
    | "yearOldToNew"
    | "priceLowToHigh"
    | "priceHighToLow";
  selectedCar: CarRecord | null;
  loading: boolean;
  error: string | null;
}

const initialState: CarsState = {
  cars: [],
  filters: {
    brand: [],
    fuel: [],
    transmission: [],
    bodyType: [],
    ownership: [],
    location: [],
    priceRange: [0, 10000000],
    yearRange: [2000, 2025],
    ownerType: "all",
  },
  selectedFilters: {
    brand: [],
    fuel: [],
    transmission: [],
    bodyType: [],
    ownership: [],
    location: [],
    priceRange: [0, 10000000],
    yearRange: [2000, 2025],
    ownerType: "all",
  },
  searchTerm: "",
  sortOption: "yearNewToOld",
  selectedCar: null,
  loading: false,
  error: null,
};

export const fetchCars = createAsyncThunk<
  CarRecord[],
  string,
  { rejectValue: string }
>("cars/fetchCars", async (BACKEND_URL, { rejectWithValue }) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/car/getAll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userType: "Dealer" }),
    });

    const data = await res.json();

    if (!res.ok) return rejectWithValue(data.message || "Failed to fetch cars");

    return data.properties || [];
  } catch (err) {
    console.log("in carSlice", err);
    return rejectWithValue("Something went wrong");
  }
});

const carSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    setSelectedFilters: (
      state,
      action: PayloadAction<Partial<FiltersState>>
    ) => {
      state.selectedFilters = { ...state.selectedFilters, ...action.payload };
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSortOption: (state, action: PayloadAction<CarsState["sortOption"]>) => {
      state.sortOption = action.payload;
    },
    setSelectedCar: (state, action: PayloadAction<CarRecord | null>) => {
      state.selectedCar = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCars.fulfilled,
        (state, action: PayloadAction<CarRecord[]>) => {
          state.loading = false;
          state.cars = action.payload;

          if (action.payload.length) {
            const prices = action.payload.map((c) => c.carPrice || 0);
            const years = action.payload.map(
              (c) => c.manufacturingYear || new Date().getFullYear()
            );

            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            const minYear = Math.min(...years);
            const maxYear = Math.max(...years);

            state.filters.priceRange = [minPrice, maxPrice];
            state.filters.yearRange = [minYear, maxYear];
            state.selectedFilters.priceRange = [minPrice, maxPrice];
            state.selectedFilters.yearRange = [minYear, maxYear];
          }
        }
      )
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cars";
      });
  },
});

export const {
  setSelectedFilters,
  setSearchTerm,
  setSortOption,
  setSelectedCar,
} = carSlice.actions;
export default carSlice.reducer;

// import {
//   createSlice,
//   createAsyncThunk,
//   type PayloadAction,
// } from "@reduxjs/toolkit";

// // ---------------- Types ----------------
// export type CarRecord = {
//   id?: string | number;
//   brand?: string;
//   model?: string;
//   fuelType?: string;
//   transmission?: string;
//   bodyType?: string;
//   ownership?: string;
//   seats?: number;
//   carPrice?: number;
//   manufacturingYear?: number;
//   kmDriven?: number;
//   address?: { state?: string; city?: string };
//   carImages?: { imageUrl: string }[];
//   user?: { fullName?: string; userType?: string; mobileNumber?: number };
//   updatedAt?: string;
//   [key: string]: unknown;
// };

// export interface FiltersState {
//   brand: string[];
//   fuel: string[];
//   transmission: string[];
//   bodyType: string[];
//   ownership: string[];
//   location: string[];
//   priceRange: [number, number] | null;
//   yearRange: [number, number] | null;
// }

// export interface CarsState {
//   cars: CarRecord[];
//   filters: FiltersState;
//   selectedFilters: FiltersState;
//   searchTerm: string;
//   sortOption:
//     | "yearNewToOld"
//     | "yearOldToNew"
//     | "priceLowToHigh"
//     | "priceHighToLow";
//   selectedCar: CarRecord | null;
//   loading: boolean;
//   error: string | null;
// }

// // ---------------- Initial State ----------------
// const initialState: CarsState = {
//   cars: [],
//   filters: {
//     brand: [],
//     fuel: [],
//     transmission: [],
//     bodyType: [],
//     ownership: [],
//     location: [],
//     priceRange: null,
//     yearRange: null,
//   },
//   selectedFilters: {
//     brand: [],
//     fuel: [],
//     transmission: [],
//     bodyType: [],
//     ownership: [],
//     location: [],
//     priceRange: null,
//     yearRange: null,
//   },
//   searchTerm: "",
//   sortOption: "yearNewToOld",
//   selectedCar: null,
//   loading: false,
//   error: null,
// };

// // ---------------- Async Thunk ----------------
// export const fetchCars = createAsyncThunk<
//   CarRecord[],
//   string,
//   { rejectValue: string }
// >("cars/fetchCars", async (BACKEND_URL, { rejectWithValue }) => {
//   try {
//     const res = await fetch(`${BACKEND_URL}/api/v1/car/getAll`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userType: "Dealer" }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       return rejectWithValue(data.message || "Failed to fetch cars");
//     }

//     return (
//       data.properties || []
//     );
//   } catch (err) {
//     console.error("Fetch cars error:", err);
//     return rejectWithValue("Something went wrong");
//   }
// });

// // ---------------- Slice ----------------
// const carSlice = createSlice({
//   name: "cars",
//   initialState,
//   reducers: {
//     setSelectedFilters: (
//       state,
//       action: PayloadAction<Partial<FiltersState>>
//     ) => {
//       state.selectedFilters = { ...state.selectedFilters, ...action.payload };
//     },
//     setSearchTerm: (state, action: PayloadAction<string>) => {
//       state.searchTerm = action.payload;
//     },
//     setSortOption: (
//       state,
//       action: PayloadAction<
//         "yearNewToOld" | "yearOldToNew" | "priceLowToHigh" | "priceHighToLow"
//       >
//     ) => {
//       state.sortOption = action.payload;
//     },
//     setSelectedCar: (state, action: PayloadAction<CarRecord | null>) => {
//       state.selectedCar = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCars.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(
//         fetchCars.fulfilled,
//         (state, action: PayloadAction<CarRecord[]>) => {
//           state.loading = false;
//           state.cars = action.payload;

//           if (action.payload.length > 0) {
//             const prices = action.payload.map((c) => c.carPrice || 0);
//             const years = action.payload.map(
//               (c) => c.manufacturingYear || new Date().getFullYear()
//             );

//             const minPrice = Math.min(...prices);
//             const maxPrice = Math.max(...prices);
//             const minYear = Math.min(...years);
//             const maxYear = Math.max(...years);

//             state.filters.priceRange = [minPrice, maxPrice];
//             state.filters.yearRange = [minYear, maxYear];

//             // ✅ Ensure selectedFilters are within bounds
//             state.selectedFilters.priceRange = [minPrice, maxPrice];
//             state.selectedFilters.yearRange = [minYear, maxYear];
//           }
//         }
//       )
//       .addCase(fetchCars.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to fetch cars";
//       });
//   },
// });

// // ---------------- Exports ----------------
// export const {
//   setSelectedFilters,
//   setSearchTerm,
//   setSortOption,
//   setSelectedCar,
// } = carSlice.actions;
// export default carSlice.reducer;
