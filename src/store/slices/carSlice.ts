import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { CarRecord } from "../../types/car";
import {
  fuelOptions,
  transmissionOptions,
  bodyTypeOptions,
  ownershipOptions,
  cityOptions,
} from "../../data/filterOptions";

// ---------- Types ----------
export type SelectedFilters = {
  userType: "EndUser" | "Dealer" | "Owner";
  brand: string[];
  bodyType: string[];
  fuelType: string[];
  transmission: string[];
  ownership: string[];
  location: string[];
  priceRange: {min: number, max:number};
  yearRange: {min: number, max:number};
};

export type CarWithOwner = CarRecord & {
  owner?: {
    id: string;
    fullName: string;
    mobileNumber: string;
    email: string;
    userType: string;
  };
};

export type CarsState = {
  allCars: CarWithOwner[];
  cars: CarWithOwner[];
  loading: boolean;
  error: string | null;
  page: number; // ✅ current page
  hasMore: boolean;
  filters: {
    brand: string[];
    bodyType: string[];
    fuel: string[];
    transmission: string[];
    ownership: string[];
    userType: string;
    priceRange: {min: number, max:number} | null;
    yearRange: {min: number, max:number} | null;
    cityOptions?: string[];
    // stateOptions?: string[];
  };
  selectedFilters: SelectedFilters;
  searchTerm: string;
  sortOption: string;
  selectedCar: CarWithOwner | null;
};

// ---------- Initial State ----------
const initialState: CarsState = {
  allCars: [],
  cars: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
  filters: {
    priceRange: {min: 0, max:10000000}, //1cr = 1,00,00,000/-
    yearRange: {min: 2000, max:(new Date().getFullYear())},
    brand: [],
    fuel: fuelOptions,
    transmission: transmissionOptions,
    bodyType: bodyTypeOptions,
    ownership: ownershipOptions,
    userType: "EndUser",
    // stateOptions,
    cityOptions,
  },
  selectedFilters: {
    brand: [],
    bodyType: [],
    fuelType: [],
    transmission: [],
    ownership: [],
    location: [],
    priceRange: {min: 0, max:10000000}, //1cr = 1,00,00,000/-
    yearRange: {min: 2000, max:(new Date().getFullYear())},
    userType: "EndUser",
  },
  searchTerm: "",
  sortOption: "newest",
  selectedCar: null,
};

// ---------- Helper ----------
// const buildBody = (payload?: {
//   selectedFilters?: SelectedFilters;
//   searchTerm?: string;
//   sortOption?: string;
// }) => {
//   if (!payload) return {};
//   const body: any = {};
//   const sf = payload.selectedFilters;

//   if (sf) {
//     if (sf.brand?.length) body.brands = sf.brand;
//     if (sf.bodyType?.length) body.bodyType = sf.bodyType;
//     if (sf.fuelType?.length) body.fuelType = sf.fuelType;
//     if (sf.transmission?.length) body.transmissionType = sf.transmission;
//     if (sf.ownership?.length) body.ownership = sf.ownership;
//     if (sf.location?.length) body.location = sf.location;
//     if (sf.priceRange)
//       body.priceRange = { min: sf.priceRange[0], max: sf.priceRange[1] };
//     if (sf.yearRange)
//       body.modelYear = { min: sf.yearRange[0], max: sf.yearRange[1] };
//     if (sf.userType) {
//       if (sf.userType === "EndUser") {
//         body.ownerType = ["Dealer", "Owner"];
//       } else if (sf.userType === "Dealer") {
//         body.ownerType = ["Dealer"];
//       } else if (sf.userType === "Owner") {
//         body.ownerType = ["Owner"];
//       }
//     }
//   }

//   if (payload.searchTerm) body.search = payload.searchTerm;
//   if (payload.sortOption) body.sort = payload.sortOption;
//   //  body.sort =
//   //   payload.sortOption === "oldest" || payload.sortOption === "newest"
//   //     ? payload.sortOption
//   //     : "newest";

//   return body;
// };

const buildBody = (payload?: {
  selectedFilters?: SelectedFilters;
  searchTerm?: string;
  sortOption?: string;
}) => {
  if (!payload) return {};
  const body: any = {};
  const sf = payload.selectedFilters;

  if (sf) {
    // Add filters that are arrays
    if (sf.brand?.length) body.brands = sf.brand;
    if (sf.bodyType?.length) body.bodyType = sf.bodyType;
    if (sf.fuelType?.length) body.fuelType = sf.fuelType;
    if (sf.transmission?.length) body.transmissionType = sf.transmission;
    if (sf.ownership?.length) body.ownership = sf.ownership;
    if (sf.location?.length) body.location = sf.location;

    // Validate priceRange and yearRange as objects with min and max numbers
    const priceValid =
      sf.priceRange &&
      typeof sf.priceRange.min === "number" &&
      typeof sf.priceRange.max === "number";

    const yearValid =
      sf.yearRange &&
      typeof sf.yearRange.min === "number" &&
      typeof sf.yearRange.max === "number";

    // Add them only if valid
    if (priceValid && yearValid) {
      body.priceRange = { min: sf.priceRange.min, max: sf.priceRange.max };
      body.modelYear = { min: sf.yearRange.min, max: sf.yearRange.max };
    }

    if (sf.userType) {
      if (sf.userType === "EndUser") {
        body.ownerType = ["Dealer", "Owner"];
      } else if (sf.userType === "Dealer") {
        body.ownerType = ["Dealer"];
      } else if (sf.userType === "Owner") {
        body.ownerType = ["Owner"];
      }
    }
  }

  if (payload.searchTerm) body.search = payload.searchTerm;
  if (payload.sortOption) body.sort = payload.sortOption;

  console.log("Request body built:", body);

  return body;
};

// ---------- Fetch all cars ----------
export const fetchCars = createAsyncThunk<
  {
    cars: CarWithOwner[];
    page: number;
  },
  | {
      selectedFilters?: SelectedFilters;
      searchTerm?: string;
      sortOption?: string;
      page?: number; // ✅ pagination add kiya
      limit?: number;
    }
  | undefined,
  { state: RootState }
>("cars/fetchCars", async (arg, { rejectWithValue }) => {
  try {
    const backend = import.meta.env.VITE_BACKEND_URL || "";

    const page = arg?.page || 1;
    const limit = arg?.limit || 12;

    const url = `${backend}/api/v1/car/getAll?page=${page}&limit=${limit}`;
    const token = localStorage.getItem("token");
    const body = buildBody(arg);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(body),
      mode: "cors",
    });

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();

    // ✅ Ensure data.cars is always array
    const cars = (data.cars || []).map((car: any) => ({
      ...car,
      owner: car.owner ?? undefined,
    }));

    return { cars, page };
  } catch (err: any) {
    return rejectWithValue(err.message || "Unknown error");
  }
});
// ---------- Fetch car by ID (unique) ----------
export const fetchSelectedCarById = createAsyncThunk<
  CarWithOwner,
  string,
  { state: RootState }
>("cars/fetchSelectedCarById", async (carId, { rejectWithValue }) => {
  try {
    const backend = import.meta.env.VITE_BACKEND_URL || "";
    const url = `${backend}/api/v1/car/get-car-by-id`;
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ carId }),
      mode: "cors",
    });

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();

    return { ...data.car, owner: data.owner } as CarWithOwner;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch selected car");
  }
});

// ---------- Slice ----------
const carSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {

    clearError(state) {
      state.error = null;
    },

     setBrandOptions(state, action: PayloadAction<string[]>) {
      state.filters.brand = action.payload;
    },

    setFiltersMeta(state, action: PayloadAction<CarsState["filters"]>) {
      state.filters = action.payload;
    },

    setSelectedFilters(state, action: PayloadAction<SelectedFilters>) {
      state.selectedFilters = action.payload;
      state.page = 1; // ✅ reset pagination
      state.hasMore = true;
    },

    updateSelectedFilter(
      state,
      action: PayloadAction<{ key: keyof SelectedFilters; value: any }>
    ) {
      const { key, value } = action.payload;
      (state.selectedFilters as any)[key] = value;
      state.page = 1; // ✅ reset to first page whenever filter updates
      state.hasMore = true;
    },

    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
      state.page = 1;
      state.hasMore = true;
    },

    setSortOption(state, action: PayloadAction<string>) {
      state.sortOption = action.payload;
      state.page = 1;
      state.hasMore = true;
    },

    setSelectedCar(state, action: PayloadAction<CarWithOwner | null>) {
      state.selectedCar = action.payload;
    },

    clearAllFilters(state) {
      state.selectedFilters = initialState.selectedFilters;
      state.searchTerm = "";
      state.sortOption = "newest";
      state.page = 1;
      state.hasMore = true;
      state.cars = [];
    },

    setCityAndStateOptions(
      state,
      action: PayloadAction<{ cityOptions: string[]; stateOptions: string[] }>
    ) {
      state.filters.cityOptions = action.payload.cityOptions;
      // state.filters.stateOptions = action.payload.stateOptions;
    },

    resetCars(state) {
      state.cars = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;
        const { cars, page } = action.payload;

        // ✅ Pagination logic
        if (page === 1) {
          state.cars = cars;
        } else {
          state.cars = [...state.cars, ...cars];
        }

        // ✅ Stop loading when no more data
          state.page = page;
        state.hasMore = cars.length >= 12;

        // ✅ Filter logic only applies on first page (not while loading more)
        const isFiltered =
          Object.keys(buildBody({ selectedFilters: state.selectedFilters }))
            .length > 0;

        if (isFiltered && page === 1) {
          state.cars = cars;
          state.allCars = cars;
        }
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch cars";
      })
      .addCase(fetchSelectedCarById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSelectedCarById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCar = action.payload;
      })
      .addCase(fetchSelectedCarById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch car details";
      });
  },
});

export const {
  clearError,
  setBrandOptions,
  setFiltersMeta,
  setSelectedFilters,
  updateSelectedFilter,
  setSearchTerm,
  setSortOption,
  setSelectedCar,
  clearAllFilters,
  setCityAndStateOptions,
} = carSlice.actions;

export default carSlice.reducer;