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
  ownerType: "all" | "dealer" | "owner";
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
  cars: CarWithOwner[];
  loading: boolean;
  error: string | null;
  filters: {
    brand: string[];
    bodyType: string[];
    fuel: string[];
    transmission: string[];
    ownership: string[];
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
    ownerType: "all",
  },
  searchTerm: "",
  sortOption: "popularity",
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
    if (sf.ownerType && sf.ownerType !== "all") body.ownerType = sf.ownerType;
  }

  if (payload.searchTerm) body.search = payload.searchTerm;
  if (payload.sortOption) body.sort = payload.sortOption;

  return body;
};

// ---------- Fetch all cars ----------
export const fetchCars = createAsyncThunk<
  CarWithOwner[],
  { selectedFilters?: SelectedFilters; searchTerm?: string; sortOption?: string } | undefined,
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
        state.cars = action.payload;
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


// import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
// import type { RootState } from "../store";
// import type { CarRecord } from "../../types/car";
// import {
//   brandOptions,
//   fuelOptions,
//   transmissionOptions,
//   bodyTypeOptions,
//   ownershipOptions,
//   stateOptions,
//   cityOptions,
// } from "../../data/filterOptions";

// export type SelectedFilters = {
//   ownerType: "all" | "dealer" | "owner";
//   brand: string[];
//   bodyType: string[];
//   fuel: string[];
//   transmission: string[];
//   ownership: string[];
//   location: string[];
//   priceRange: [number, number];
//   yearRange: [number, number];
// };

// export type CarsState = {
//   cars: CarRecord[];
//   loading: boolean;
//   error: string | null;
//   filters: {
//     brand: string[];
//     bodyType: string[];
//     fuel: string[];
//     transmission: string[];
//     ownership: string[];
//     priceRange: [number, number] | null;
//     yearRange: [number, number] | null;
//     cityOptions?: string[];
//     stateOptions?: string[];
//   };
//   selectedFilters: SelectedFilters;
//   searchTerm: string;
//   sortOption: string;
//   selectedCar: CarRecord | null;
// };

// const initialState: CarsState = {
//   cars: [],
//   loading: false,
//   error: null,
//   filters: {
//     priceRange: null,
//     yearRange: null,
//     brand: brandOptions,
//     fuel: fuelOptions,
//     transmission: transmissionOptions,
//     bodyType: bodyTypeOptions,
//     ownership: ownershipOptions,
//     stateOptions,
//     cityOptions,
//   },
//   selectedFilters: {
//     brand: [],
//     bodyType: [],
//     fuel: [],
//     transmission: [],
//     ownership: [],
//     location: [],
//     priceRange: [0, 10000000],
//     yearRange: [2000, new Date().getFullYear()],
//     ownerType: "all",
//   },
//   searchTerm: "",
//   sortOption: "popularity",
//   selectedCar: null,
// };

// const buildBody = (payload?: {
//   selectedFilters?: SelectedFilters;
//   searchTerm?: string;
//   sortOption?: string;
// }) => {
//   if (!payload) return {};

//   const body: any = {};
//   const sf = payload.selectedFilters;

//   if (sf) {
//     if (sf.brand?.length) body.brand = sf.brand;
//     if (sf.bodyType?.length) body.bodyType = sf.bodyType;
//     if (sf.fuel?.length) body.fuel = sf.fuel;
//     if (sf.transmission?.length) body.transmission = sf.transmission;
//     if (sf.ownership?.length) body.ownership = sf.ownership;

//     if (sf.location?.length) body.location = sf.location;

//     if (sf.priceRange) {
//       body.price = {
//         min: sf.priceRange[0],
//         max: sf.priceRange[1],
//       };
//     }

//     if (sf.yearRange) {
//       body.modelYear = {
//         min: sf.yearRange[0],
//         max: sf.yearRange[1],
//       };
//     }

//     if (sf.ownerType && sf.ownerType !== "all") {
//       body.ownerType = sf.ownerType;
//     }
//   }

//   if (payload.searchTerm) body.search = payload.searchTerm;
//   if (payload.sortOption) body.sort = payload.sortOption;

//   return body;
// };

// export const fetchCars = createAsyncThunk<
//   CarRecord[],
//   | undefined
//   | {
//       selectedFilters?: SelectedFilters;
//       searchTerm?: string;
//       sortOption?: string;
//     },
//   { state: RootState }
// >("cars/fetchCars", async (arg, { rejectWithValue }) => {
//   try {
//     const backend = import.meta.env.VITE_BACKEND_URL || "";
//     const url = `${backend}/api/v1/car/getAll`;

//     const body = buildBody(arg);
//     const token = localStorage.getItem("token");

//     const res = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` :  "",
//       },
//       body: JSON.stringify(body),
//     });

//     // console.log("getAll-response",res);

//     if (!res.ok) {
//       const text = await res.text();
//       throw new Error(text || "Failed to fetch cars");
//     }

//     const data = await res.json();

//     return data.cars as CarRecord[];

//   } catch (err: any) {
//     return rejectWithValue(err.message || "Unknown error");
//   }
// });

// const carSlice = createSlice({
//   name: "cars",
//   initialState,
//   reducers: {
//     setFiltersMeta(state, action: PayloadAction<CarsState["filters"]>) {
//       state.filters = action.payload;
//     },
//     setSelectedFilters(state, action: PayloadAction<SelectedFilters>) {
//       state.selectedFilters = action.payload;
//     },
//     updateSelectedFilter(
//       state,
//       action: PayloadAction<{ key: keyof SelectedFilters; value: any }>
//     ) {
//       const { key, value } = action.payload;
//       (state.selectedFilters as any)[key] = value;
//     },
//     setSearchTerm(state, action: PayloadAction<string>) {
//       state.searchTerm = action.payload;
//     },
//     setSortOption(state, action: PayloadAction<string>) {
//       state.sortOption = action.payload;
//     },
//     setSelectedCar(state, action: PayloadAction<CarRecord | null>) {
//       state.selectedCar = action.payload;
//     },
//     clearAllFilters(state) {
//       state.selectedFilters = initialState.selectedFilters;
//       state.searchTerm = "";
//       state.sortOption = "popularity";
//     },
//     setCityAndStateOptions(
//       state,
//       action: PayloadAction<{ cityOptions: string[]; stateOptions: string[] }>
//     ) {
//       state.filters.cityOptions = action.payload.cityOptions;
//       state.filters.stateOptions = action.payload.stateOptions;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCars.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCars.fulfilled, (state, action) => {
//         state.loading = false;
//         state.cars = action.payload;
//       })
//       .addCase(fetchCars.rejected, (state, action) => {
//         state.loading = false;
//         state.error = (action.payload as string) || "Failed to fetch cars";
//       });
//   },
// });

// export const {
//   setFiltersMeta,
//   setSelectedFilters,
//   updateSelectedFilter,
//   setSearchTerm,
//   setSortOption,
//   setSelectedCar,
//   clearAllFilters,
//   setCityAndStateOptions,
// } = carSlice.actions;

// export default carSlice.reducer;

// import {
//   createSlice,
//   createAsyncThunk,
//   type PayloadAction,
// } from "@reduxjs/toolkit";
// import type { CarRecord, FiltersState } from "../../types/car";

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

// const initialState: CarsState = {
//   cars: [],
//   filters: {
//     brand: [],
//     fuel: [],
//     transmission: [],
//     bodyType: [],
//     ownership: [],
//     location: [],
//     priceRange: [0, 10000000],
//     yearRange: [2000, 2025],
//     ownerType: "all",
//   },
//   selectedFilters: {
//     brand: [],
//     fuel: [],
//     transmission: [],
//     bodyType: [],
//     ownership: [],
//     location: [],
//     priceRange: [0, 10000000],
//     yearRange: [2000, 2025],
//     ownerType: "all",
//   },
//   searchTerm: "",
//   sortOption: "yearNewToOld",
//   selectedCar: null,
//   loading: false,
//   error: null,
// };

// // export const fetchCars = createAsyncThunk<
// //   CarRecord[],
// //   string,
// //   { rejectValue: string }
// // >("cars/fetchCars", async (BACKEND_URL, { rejectWithValue }) => {
// //   try {
// //     const token = localStorage.getItem("token");

// //     const res = await fetch(`${BACKEND_URL}/api/v1/car/getAll`, {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: token ? `Bearer ${token}` : "",
// //       },
// //       body: JSON.stringify({}),
// //     });

// //     const data = await res.json();
// //     console.log("fetchCars response", data); //debugging

// //     if (!res.ok) return rejectWithValue(data.message || "Failed to fetch cars");

// //     return data.cars || [];
// //   } catch (err) {
// //     console.log("in carSlice", err);
// //     return rejectWithValue("Something went wrong");
// //   }
// // });

// export const fetchCars = createAsyncThunk<
//   CarRecord[],
//   FiltersState,
//   { rejectValue: string }
// >("cars/fetchCars", async (selectedFilters, { rejectWithValue }) => {
//   try {
//     const token = localStorage.getItem("token");

//     // Map frontend selectedFilters to backend expected fields
//     const body = {
//       userType: selectedFilters.ownerType !== 'all' ? selectedFilters.ownerType : undefined,
//       priceRange: selectedFilters.priceRange,
//       brands: selectedFilters.brand.length ? selectedFilters.brand : undefined,
//       modelYear: selectedFilters.yearRange,
//       location: selectedFilters.location.length ? selectedFilters.location : undefined,
//       bodyType: selectedFilters.bodyType.length ? selectedFilters.bodyType : undefined,
//       fuelType: selectedFilters.fuel.length ? selectedFilters.fuel : undefined,
//       search: undefined, // Add searchTerm here if needed
//       sort: undefined,   // Add sort option if needed
//     };

//     // Remove undefined keys so backend sees only active filters
//     const filteredBody = Object.fromEntries(
//       Object.entries(body).filter(([__, value]) => value !== undefined)
//     );

//     const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

//     const res = await fetch(`${BACKEND_URL}/api/v1/car/getAll`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "",
//       },
//       body: JSON.stringify(filteredBody),
//     });

//     const data = await res.json();
//     if (!res.ok) return rejectWithValue(data.message || "Failed to fetch cars");

//     return data.cars || [];
//   } catch (err) {
//     console.log("in carSlice", err);
//     return rejectWithValue("Something went wrong");
//   }
// });

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
//     setSortOption: (state, action: PayloadAction<CarsState["sortOption"]>) => {
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

//           if (action.payload?.length) {
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

// export const {
//   setSelectedFilters,
//   setSearchTerm,
//   setSortOption,
//   setSelectedCar,
// } = carSlice.actions;
// export default carSlice.reducer;
