import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { CarRecord } from "../../types/car";
import {
  fuelOptions,
  transmissionOptions,
  bodyTypeOptions,
  ownershipOptions,
  cityOptions,
} from "../../data/filterOptions";

/* --------------------------------------------------------
   TYPES
-------------------------------------------------------- */
export type SelectedFilters = {
  userType: "EndUser" | "Dealer" | "Owner";
  brand: string[];
  model: string[];
  bodyType: string[];
  fuelType: string[];
  transmission: string[];
  ownership: string[];
  location: string[];
  priceRange: { min: number; max: number };
  yearRange: { min: number; max: number };
  brandModelsMap?: Record<string, string[]>;
};

export type CarWithOwner = CarRecord & {
  owner?: {
    id: string;
    fullName: string;
    mobileNumber: string;
    email: string;
    userType: string;
  };
  isSaved?: boolean;
};

/* --------------------------------------------------------
   STATE
-------------------------------------------------------- */
export type CarsState = {
  filterCounts: CarWithOwner[];
  cars: CarWithOwner[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  filters: {
    brand: string[];
    model: string[];
    bodyType: string[];
    fuel: string[];
    transmission: string[];
    ownership: string[];
    userType: string;
    priceRange: { min: number; max: number } | null;
    yearRange: { min: number; max: number } | null;
    cityOptions?: string[];
  };
  selectedFilters: SelectedFilters;
  searchTerm: string;
  sortOption: string;
  selectedCar: CarWithOwner | null;
};

/* --------------------------------------------------------
   INITIAL STATE
-------------------------------------------------------- */
const initialState: CarsState = {
  filterCounts: [],
  cars: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
  filters: {
    priceRange: { min: 1, max: 10000000 },
    yearRange: { min: 2000, max: new Date().getFullYear() },
    brand: [],
    model: [],
    fuel: fuelOptions,
    transmission: transmissionOptions,
    bodyType: bodyTypeOptions,
    ownership: ownershipOptions,
    userType: "EndUser",
    cityOptions,
  },
  selectedFilters: {
    brand: [],
    model: [],
    bodyType: [],
    fuelType: [],
    transmission: [],
    ownership: [],
    location: [],
    priceRange: { min: 1, max: 10000000 },
    yearRange: { min: 2000, max: new Date().getFullYear() },
    userType: "EndUser",
  },
  searchTerm: "",
  sortOption: "newest",
  selectedCar: null,
};

/* --------------------------------------------------------
   HELPER — MERGE SAVED STATUS INTO CARS
-------------------------------------------------------- */
const mergeSavedCars = (
  cars: CarWithOwner[],
  savedIds: string[]
): CarWithOwner[] => {
  const savedSet = new Set(savedIds.map(String));
  return cars.map((car) => ({
    ...car,
    isSaved: savedSet.has(String(car.id)),
  }));
};

/* --------------------------------------------------------
   BUILD REQUEST BODY
-------------------------------------------------------- */
const buildBody = (payload?: {
  selectedFilters?: SelectedFilters;
  searchTerm?: string;
  sortOption?: string;
  onlyLocation?: boolean;
}) => {
  if (!payload) return {};
  const body: any = {};

  // ⭐ If only location mode, skip all other filters
  if (payload.onlyLocation && payload.selectedFilters) {
    if (payload.selectedFilters.location.length) {
      body.location = [...payload.selectedFilters.location];
    }
    return body;
  }

  const sf = payload.selectedFilters;

  if (sf) {
    if (sf.brand.length) body.brands = sf.brand;
    if (sf.model.length) body.model = sf.model;
    if (sf.bodyType.length) body.bodyType = sf.bodyType;
    if (sf.fuelType.length) body.fuelType = sf.fuelType;
    if (sf.transmission.length) body.transmissionType = sf.transmission;
    if (sf.ownership.length) body.ownership = sf.ownership;
    if (sf.location.length) body.location = [...sf.location];

    if (sf.priceRange) {
      body.priceRange = sf.priceRange;
    }

    if (sf.yearRange) {
      body.modelYear = sf.yearRange;
    }

    if (sf.userType === "EndUser") body.ownerType = ["Dealer", "Owner"];
    if (sf.userType === "Dealer") body.ownerType = ["Dealer"];
    if (sf.userType === "Owner") body.ownerType = ["Owner"];
  }

  if (payload.searchTerm) body.search = payload.searchTerm;
  if (payload.sortOption) body.sort = payload.sortOption;

  return body;
};

/* --------------------------------------------------------
   FETCH CARS (SAFE + UPDATED)
-------------------------------------------------------- */
export const fetchCars = createAsyncThunk<
  {
    cars: CarWithOwner[];
    page: number;
    filterCounts?: CarWithOwner[];
  },
  | {
      selectedFilters?: SelectedFilters;
      searchTerm?: string;
      sortOption?: string;
      page?: number;
      limit?: number;
      onlyLocation?: boolean;
    }
  | undefined,
  { state: RootState }
>("cars/fetchCars", async (arg, { rejectWithValue, getState }) => {
  try {
    const backend = import.meta.env.VITE_BACKEND_URL || "";
    const page = arg?.page || 1;
    const limit = arg?.limit || 12;

    // 🔥 get saved ids safely from savedSlice using getState()
    const savedIds = getState().saved?.savedCarIdsByCarId?.map(String) || [];

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
    });

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();

    let cars = (data.cars || []).map((car: any) => ({
      ...car,
      owner: car.owner ?? undefined,
    }));

    // 🔥 merge saved status
    cars = mergeSavedCars(cars, savedIds);

    return { cars, page, filterCounts: data.filterCounts };
  } catch (err: any) {
    return rejectWithValue(err.message || "Unknown error");
  }
});

/* --------------------------------------------------------
   FETCH SINGLE CAR
-------------------------------------------------------- */
export const fetchSelectedCarById = createAsyncThunk<CarWithOwner, string>(
  "cars/fetchSelectedCarById",
  async (carId, { rejectWithValue }) => {
    try {
      const backend = import.meta.env.VITE_BACKEND_URL;

      const res = await fetch(`${backend}/api/v1/car/get-car-by-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
            ? `Bearer ${localStorage.getItem("token")}`
            : "",
        },
        body: JSON.stringify({ carId }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      return { ...data.car, owner: data.owner };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/* --------------------------------------------------------
   SLICE
-------------------------------------------------------- */
const carSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setBrandOptions(state, action) {
      state.filters.brand = action.payload;
    },
    setModelOptions(state, action) {
      state.filters.model = action.payload;
    },
    setBrandModelMap(state, action) {
      (state.filters as any).brandModelsMap = action.payload;
    },
    setFiltersMeta(state, action) {
      state.filters = action.payload;
    },

    setSelectedFilters(state, action) {
      state.selectedFilters = action.payload;
      state.page = 1;
      state.hasMore = true;
    },

    updateSelectedFilter(state, action) {
      const { key, value } = action.payload;
      (state.selectedFilters as any)[key] = Array.isArray(value)
        ? [...value]
        : value;

      state.page = 1;
      state.hasMore = true;
    },

    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.page = 1;
      state.hasMore = true;
    },

    setSortOption(state, action) {
      state.sortOption = action.payload;
      state.page = 1;
      state.hasMore = true;
    },

    setSelectedCar(state, action) {
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

    setCityAndStateOptions(state, action) {
      state.filters.cityOptions = action.payload.cityOptions;
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

        let { cars } = action.payload;

        // 🔥 apply location filter
        if (state.selectedFilters.location.length > 0) {
          const loc = state.selectedFilters.location[0];
          cars = cars.filter(
            (car) =>
              car.city === loc ||
              car.location === loc ||
              car.address?.city === loc
          );
        }

        // pagination
        if (action.payload.page === 1) {
          state.cars = cars;
        } else {
          state.cars = [...state.cars, ...cars];
        }

        state.page = action.payload.page;
        state.hasMore = cars.length >= 12;

        // filterCounts
        if (
          action.payload.page === 1 &&
          state.sortOption === "newest" &&
          action.payload.filterCounts
        ) {
          state.filterCounts = action.payload.filterCounts;
        }
      })

      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchSelectedCarById.fulfilled, (state, action) => {
        state.selectedCar = action.payload;
        state.loading = false;
      })

      .addCase(fetchSelectedCarById.pending, (state) => {
        state.loading = true;
      });
  },
});

/* --------------------------------------------------------
   EXPORTS
-------------------------------------------------------- */
export const {
  clearError,
  setBrandOptions,
  setModelOptions,
  setBrandModelMap,
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

// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { store, type RootState } from "../store";
// import type { CarRecord } from "../../types/car";
// import {
//   fuelOptions,
//   transmissionOptions,
//   bodyTypeOptions,
//   ownershipOptions,
//   cityOptions,
// } from "../../data/filterOptions";

// // ---------- Types ----------
// export type SelectedFilters = {
//   userType: "EndUser" | "Dealer" | "Owner";
//   brand: string[];
//   model: string[];
//   bodyType: string[];
//   fuelType: string[];
//   transmission: string[];
//   ownership: string[];
//   location: string[];
//   priceRange: { min: number; max: number };
//   yearRange: { min: number; max: number };
//   brandModelsMap?: Record<string, string[]>;
// };

// export type CarWithOwner = CarRecord & {
//   owner?: {
//     id: string;
//     fullName: string;
//     mobileNumber: string;
//     email: string;
//     userType: string;
//   };
//   isSaved?: boolean; // 🔥 NEW
// };

// export type CarsState = {
//   filterCounts: CarWithOwner[];
//   cars: CarWithOwner[];
//   loading: boolean;
//   error: string | null;
//   page: number;
//   hasMore: boolean;
//   filters: {
//     brand: string[];
//     model: string[];
//     bodyType: string[];
//     fuel: string[];
//     transmission: string[];
//     ownership: string[];
//     userType: string;
//     priceRange: { min: number; max: number } | null;
//     yearRange: { min: number; max: number } | null;
//     cityOptions?: string[];
//   };
//   selectedFilters: SelectedFilters;
//   searchTerm: string;
//   sortOption: string;
//   selectedCar: CarWithOwner | null;
// };

// // ---------- Initial State ----------
// const initialState: CarsState = {
//   filterCounts: [],
//   cars: [],
//   loading: false,
//   error: null,
//   page: 1,
//   hasMore: true,
//   filters: {
//     priceRange: { min: 1, max: 10000000 },
//     yearRange: { min: 2000, max: new Date().getFullYear() },
//     brand: [],
//     model: [],
//     fuel: fuelOptions,
//     transmission: transmissionOptions,
//     bodyType: bodyTypeOptions,
//     ownership: ownershipOptions,
//     userType: "EndUser",
//     cityOptions,
//   },
//   selectedFilters: {
//     brand: [],
//     model: [],
//     bodyType: [],
//     fuelType: [],
//     transmission: [],
//     ownership: [],
//     location: [],
//     priceRange: { min: 1, max: 10000000 },
//     yearRange: { min: 2000, max: new Date().getFullYear() },
//     userType: "EndUser",
//   },
//   searchTerm: "",
//   sortOption: "newest",
//   selectedCar: null,
// };

// // ---------- NEW HELPER: merge saved status ----------
// const mergeSavedCars = (
//   cars: CarWithOwner[],
//   savedCarIdsByCarId: string[]
// ): CarWithOwner[] => {
//   const savedSet = new Set(savedCarIdsByCarId.map(String)); // ensure strings

//   return cars.map((car) => ({
//     ...car,
//     isSaved: savedSet.has(String(car.id)), // FIX: convert car.id to string
//   }));
// };

// // ---------- Body Builder ----------
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
//     if (sf.model?.length) body.model = sf.model;
//     if (sf.bodyType?.length) body.bodyType = sf.bodyType;
//     if (sf.fuelType?.length) body.fuelType = sf.fuelType;
//     if (sf.transmission?.length) body.transmissionType = sf.transmission;
//     if (sf.ownership?.length) body.ownership = sf.ownership;
//     if (sf.location?.length) body.location = [...sf.location];

//     const priceValid =
//       sf.priceRange &&
//       typeof sf.priceRange.min === "number" &&
//       typeof sf.priceRange.max === "number";

//     const yearValid =
//       sf.yearRange &&
//       typeof sf.yearRange.min === "number" &&
//       typeof sf.yearRange.max === "number";

//     if (priceValid) {
//       body.priceRange = {
//         min: sf.priceRange.min,
//         max: sf.priceRange.max,
//       };
//     }

//     if (yearValid) {
//       body.modelYear = {
//         min: sf.yearRange.min,
//         max: sf.yearRange.max,
//       };
//     }

//     if (sf.userType === "EndUser") {
//       body.ownerType = ["Dealer", "Owner"];
//     } else if (sf.userType === "Dealer") {
//       body.ownerType = ["Dealer"];
//     } else if (sf.userType === "Owner") {
//       body.ownerType = ["Owner"];
//     }
//   }

//   if (payload.searchTerm) body.search = payload.searchTerm;
//   if (payload.sortOption) body.sort = payload.sortOption;

//   return body;
// };

// // ---------- Fetch Cars ----------
// export const fetchCars = createAsyncThunk<
//   {
//     cars: CarWithOwner[];
//     page: number;
//     filterCounts?: CarWithOwner[];
//   },
//   | {
//       selectedFilters?: SelectedFilters;
//       searchTerm?: string;
//       sortOption?: string;
//       page?: number;
//       limit?: number;
//     }
//   | undefined,
//   { state: RootState }
// >("cars/fetchCars", async (arg, { rejectWithValue, getState }) => {
//   try {
//     const backend = import.meta.env.VITE_BACKEND_URL || "";
//     const page = arg?.page || 1;
//     const limit = arg?.limit || 12;

//       // 🔥 get saved car ids directly from global state
//       const savedIds =
//         getState().saved?.savedCarIdsByCarId?.map(String) || [];

//     const url = `${backend}/api/v1/car/getAll?page=${page}&limit=${limit}`;
//     const token = localStorage.getItem("token");
//     const body = buildBody(arg);

//     const res = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "",
//       },
//       body: JSON.stringify(body),
//       mode: "cors",
//     });

//     if (!res.ok) throw new Error(await res.text());
//     const data = await res.json();

//     let cars = (data.cars || []).map((car: any) => ({
//       ...car,
//       owner: car.owner ?? undefined,
//     }));

//        // 🔥 merge saved
//       cars = mergeSavedCars(cars, savedIds);

//     return { cars, page, filterCounts: data.filterCounts };
//   } catch (err: any) {
//     return rejectWithValue(err.message || "Unknown error");
//   }
// });

// // ---------- Fetch Single Car ----------
// export const fetchSelectedCarById = createAsyncThunk<
//   CarWithOwner,
//   string,
//   { state: RootState }
// >("cars/fetchSelectedCarById", async (carId, { rejectWithValue }) => {
//   try {
//     const backend = import.meta.env.VITE_BACKEND_URL || "";

//     const res = await fetch(`${backend}/api/v1/car/get-car-by-id`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: localStorage.getItem("token")
//           ? `Bearer ${localStorage.getItem("token")}`
//           : "",
//       },
//       body: JSON.stringify({ carId }),
//       mode: "cors",
//     });

//     if (!res.ok) throw new Error(await res.text());
//     const data = await res.json();

//     return { ...data.car, owner: data.owner };
//   } catch (err: any) {
//     return rejectWithValue(err.message);
//   }
// });

// // ---------- Slice ----------
// const carSlice = createSlice({
//   name: "cars",
//   initialState,
//   reducers: {
//     clearError(state) {
//       state.error = null;
//     },
//     setBrandOptions(state, action) {
//       state.filters.brand = action.payload;
//     },
//     setModelOptions(state, action) {
//       state.filters.model = action.payload;
//     },
//     setBrandModelMap(state, action) {
//       (state.filters as any).brandModelsMap = action.payload;
//     },
//     setFiltersMeta(state, action) {
//       state.filters = action.payload;
//     },

//     setSelectedFilters(state, action) {
//       state.selectedFilters = action.payload;
//       state.page = 1;
//       state.hasMore = true;
//     },

//     updateSelectedFilter(state, action) {
//       const { key, value } = action.payload;
//       (state.selectedFilters as any)[key] = Array.isArray(value)
//         ? [...value]
//         : value;

//       state.page = 1;
//       state.hasMore = true;
//     },

//     setSearchTerm(state, action) {
//       state.searchTerm = action.payload;
//       state.page = 1;
//       state.hasMore = true;
//     },

//     setSortOption(state, action) {
//       state.sortOption = action.payload;
//       state.page = 1;
//       state.hasMore = true;
//     },

//     setSelectedCar(state, action) {
//       state.selectedCar = action.payload;
//     },

//     clearAllFilters(state) {
//       state.selectedFilters = initialState.selectedFilters;
//       state.searchTerm = "";
//       state.sortOption = "newest";
//       state.page = 1;
//       state.hasMore = true;
//       state.cars = [];
//     },

//     setCityAndStateOptions(state, action) {
//       state.filters.cityOptions = action.payload.cityOptions;
//     },

//     resetCars(state) {
//       state.cars = [];
//       state.page = 1;
//       state.hasMore = true;
//     },
//   },

//   // ---------- Extra Reducers ----------
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCars.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })

//       // .addCase(fetchCars.fulfilled, (state, action) => {
//       //   state.loading = false;

//       //   let { cars } = action.payload;
//       //   const savedIds = store.getState().saved.savedCarIdsByCarId || []; // 🔥 read from savedSlice

//       //   // 🔥 merge saved car status
//       //   cars = mergeSavedCars(cars, savedIds);

//       //   // 🔥 apply location client-side filter
//       //   if (state.selectedFilters.location.length > 0) {
//       //     const loc = state.selectedFilters.location[0];
//       //     cars = cars.filter(
//       //       (car) =>
//       //         car.city === loc ||
//       //         car.location === loc ||
//       //         car?.address?.city === loc
//       //     );
//       //   }

//       //   // ---------- Pagination ----------
//       //   if (action.payload.page === 1) {
//       //     state.cars = cars;
//       //   } else {
//       //     state.cars = [...state.cars, ...cars];
//       //   }

//       //   state.page = action.payload.page;
//       //   state.hasMore = cars.length >= 12;

//       //   // ---------- filterCounts ----------
//       //   if (
//       //     action.payload.page === 1 &&
//       //     state.sortOption === "newest" &&
//       //     action.payload.filterCounts
//       //   ) {
//       //     state.filterCounts = action.payload.filterCounts;
//       //   }
//       // })

//       .addCase(fetchCars.fulfilled, (state, action) => {
//         state.loading = false;

//         let { cars } = action.payload;

//         // Get saved cars from savedSlice (GLOBAL store)
//         // const savedIds = store.getState().saved.savedCarIdsByCarId || [];

//         // merge saved car status
//         // cars = mergeSavedCars(cars, savedIds);

//         // location-based filter
//         if (state.selectedFilters.location.length > 0) {
//           const loc = state.selectedFilters.location[0];
//           cars = cars.filter(
//             (car) =>
//               car.city === loc ||
//               car.location === loc ||
//               car.address?.city === loc
//           );
//         }

//         // pagination
//         if (action.payload.page === 1) {
//           state.cars = cars;
//         } else {
//           state.cars = [...state.cars, ...cars];
//         }

//         state.page = action.payload.page;
//         state.hasMore = cars.length >= 12;

//         // filterCounts
//         if (
//           action.payload.page === 1 &&
//           state.sortOption === "newest" &&
//           action.payload.filterCounts
//         ) {
//           state.filterCounts = action.payload.filterCounts;
//         }
//       })

//       .addCase(fetchCars.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       .addCase(fetchSelectedCarById.fulfilled, (state, action) => {
//         state.selectedCar = action.payload;
//         state.loading = false;
//       })

//       .addCase(fetchSelectedCarById.pending, (state) => {
//         state.loading = true;
//       });
//   },
// });

// // ---------- Exports ----------
// export const {
//   clearError,
//   setBrandOptions,
//   setModelOptions,
//   setBrandModelMap,
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
