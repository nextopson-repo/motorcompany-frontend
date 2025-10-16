import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { CarRecord } from "../../types/car";
import {
  brandOptions,
  fuelOptions,
  transmissionOptions,
  bodyTypeOptions,
  ownershipOptions,
  stateOptions,
  cityOptions,
} from "../../data/filterOptions";

// ---------- Types ----------
export type SelectedFilters = {
  userType: "EndUser" | "Dealer" | "Owner";
  brand: string[];
  bodyType: string[];
  fuel: string[];
  transmission: string[];
  ownership: string[];
  location: string[];
  priceRange: [number, number];
  yearRange: [number, number];
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
  filters: {
    brand: string[];
    bodyType: string[];
    fuel: string[];
    transmission: string[];
    ownership: string[];
    userType: string;
    priceRange: [number, number] | null;
    yearRange: [number, number] | null;
    cityOptions?: string[];
    stateOptions?: string[];
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
  filters: {
    priceRange: null,
    yearRange: null,
    brand: brandOptions,
    fuel: fuelOptions,
    transmission: transmissionOptions,
    bodyType: bodyTypeOptions,
    ownership: ownershipOptions,
    userType: "EndUser",
    stateOptions,
    cityOptions,
  },
  selectedFilters: {
    brand: [],
    bodyType: [],
    fuel: [],
    transmission: [],
    ownership: [],
    location: [],
    priceRange: [0, 10000000],
    yearRange: [2000, new Date().getFullYear()],
    userType: "EndUser",
  },
  searchTerm: "",
  sortOption: "newest",
  selectedCar: null,
};

// ---------- Helper ----------
const buildBody = (payload?: {
  selectedFilters?: SelectedFilters;
  searchTerm?: string;
  sortOption?: string;
}) => {
  if (!payload) return {};
  const body: any = {};
  const sf = payload.selectedFilters;

  if (sf) {
    if (sf.brand?.length) body.brand = sf.brand;
    if (sf.bodyType?.length) body.bodyType = sf.bodyType;
    if (sf.fuel?.length) body.fuel = sf.fuel;
    if (sf.transmission?.length) body.transmission = sf.transmission;
    if (sf.ownership?.length) body.ownership = sf.ownership;
    if (sf.location?.length) body.location = sf.location;
    if (sf.priceRange)
      body.price = { min: sf.priceRange[0], max: sf.priceRange[1] };
    if (sf.yearRange)
      body.modelYear = { min: sf.yearRange[0], max: sf.yearRange[1] };
    if (sf.userType && sf.userType !== "EndUser") body.userType = sf.userType;
  }

  if (payload.searchTerm) body.search = payload.searchTerm;
  if (payload.sortOption) body.sort = payload.sortOption;
   body.sort =
    payload.sortOption === "oldest" || payload.sortOption === "newest"
      ? payload.sortOption
      : "newest";

  return body;
};

// ---------- Fetch all cars ----------
export const fetchCars = createAsyncThunk<
  CarWithOwner[],
  | {
      selectedFilters?: SelectedFilters;
      searchTerm?: string;
      sortOption?: string;
    }
  | undefined,
  { state: RootState }
>("cars/fetchCars", async (arg, { rejectWithValue }) => {
  try {
    const backend = import.meta.env.VITE_BACKEND_URL || "";
    const url = `${backend}/api/v1/car/getAll`;
    const body = buildBody(arg);
    const token = localStorage.getItem("token");

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

    // Assume data.cars is an array and each car has optional owner
    return data.cars.map((car: any) => ({
      ...car,
      owner: car.owner ?? undefined,
    }));
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
    setFiltersMeta(state, action: PayloadAction<CarsState["filters"]>) {
      state.filters = action.payload;
    },
    setSelectedFilters(state, action: PayloadAction<SelectedFilters>) {
      state.selectedFilters = action.payload;
    },
    updateSelectedFilter(
      state,
      action: PayloadAction<{ key: keyof SelectedFilters; value: any }>
    ) {
      const { key, value } = action.payload;
      (state.selectedFilters as any)[key] = value;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setSortOption(state, action: PayloadAction<string>) {
      state.sortOption = action.payload;
    },
    setSelectedCar(state, action: PayloadAction<CarWithOwner | null>) {
      state.selectedCar = action.payload;
    },
    clearAllFilters(state) {
      state.selectedFilters = initialState.selectedFilters;
      state.searchTerm = "";
      state.sortOption = "popularity";
    },
    setCityAndStateOptions(
      state,
      action: PayloadAction<{ cityOptions: string[]; stateOptions: string[] }>
    ) {
      state.filters.cityOptions = action.payload.cityOptions;
      state.filters.stateOptions = action.payload.stateOptions;
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
        const isFiltered =
          Object.keys(buildBody({ selectedFilters: state.selectedFilters }))
            .length > 0;

        if (isFiltered) {
          state.cars = action.payload; // filtered result
        } else {
          state.allCars = action.payload; // unfiltered result
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