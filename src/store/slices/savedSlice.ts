import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CarRecord } from "../../types/car";

interface SavedState {
  cars: CarRecord[];
  searchTerm: string;
  sortOption: string;
}

const initialState: SavedState = {
  cars: [],
  searchTerm: "",
  sortOption: "popularity",
};

const savedSlice = createSlice({
  name: "saved",
  initialState,
  reducers: {
    setSavedCars: (state, action: PayloadAction<CarRecord[]>) => { state.cars = action.payload; },
    addSavedCar: (state, action: PayloadAction<CarRecord>) => {
      if (!state.cars.find((c) => c.id === action.payload.id)) state.cars.push(action.payload);
    },
    removeSavedCar: (state, action: PayloadAction<number>) => {
      state.cars = state.cars.filter((c) => c.id !== action.payload);
    },
    setSearchTerm: (state, action: PayloadAction<string>) => { state.searchTerm = action.payload; },
    setSortOption: (state, action: PayloadAction<string>) => { state.sortOption = action.payload; },
  },
});

export const { setSavedCars, addSavedCar, removeSavedCar, setSearchTerm, setSortOption } = savedSlice.actions;
export default savedSlice.reducer;



// import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
// import type { CarRecord } from "../../types/car";

// // interface Car {
// //     id: number;
// //     brand: string;
// //     model: string;
// //     carPrice: number;
// //     manufacturingYear: number;
// //     fuelType: string;
// //     kms: number;
// //     transmission: string;
// //     bodyType: string;
// //     ownership: string;
// //     mileage?: number;
// //     seats?: number;
// //     // carImages?: { imageUrl: string }[];
// //     address?: { city?: string; state?: string };
// //     user?: { fullName?: string; userType?: string };
// //     updatedAt: string;
// //     createdAt: string;
// // }

// interface SavedState {
//     // cars: Car[];
//     cars: CarRecord[];
//     searchTerm: string;
//     sortOption: string;
// }

// const initialState: SavedState = {
//     cars: [
//         {
//             id: 1,
//             brand: "Hyundai",
//             model: "Exterior",
//             carPrice: 880000,
//             manufacturingYear: 2020,
//             fuelType: "Petrol",
//             kms: 20000,
//             transmission: "Automatic",
//             bodyType: "Hatchback",
//             ownership: "2nd",
//             mileage: 19.4,
//             seats: 5,
//              // carImages?: { imageUrl:  }[],
//             address: { city: "Indore", state: "Madhya Pradesh" },
//             user: { fullName: "Dhiraj", userType: "owner" },
//             updatedAt: "2 days ago",
//             createdAt: "2 days ago",
//         },
//         {
//             id: 2,
//             brand: "Mahindra",
//             model: "Bolero",
//             carPrice: 1050000,
//             manufacturingYear: 2020,
//             fuelType: "Diesel",
//             kms: 20000,
//             transmission: "Manual",
//             bodyType: "SUV",
//             ownership: "2nd",
//             mileage: 15.6,
//             seats: 7,
//             // carImages?: { imageUrl:  }[],
//             address: { city: "Indore", state: "Madhya Pradesh" },
//             user: { fullName: "Dhiraj", userType: "owner" },
//             updatedAt: "1 hr ago",
//             createdAt: "1 hr ago",
//         },
//         {
//             id: 3,
//             brand: "Mahindra",
//             model: "Bolero",
//             carPrice: 1050000,
//             manufacturingYear: 2020,
//             fuelType: "Petrol",
//             kms: 20000,
//             transmission: "Manual",
//             bodyType: "SUV",
//             ownership: "2nd",
//             mileage: 15.6,
//             seats: 7,
//             // carImages?: { imageUrl:  }[],
//             address: { city: "Indore", state: "Madhya Pradesh" },
//             user: { fullName: "Dhiraj", userType: "dealer" },
//             updatedAt: "3 min ago",
//             createdAt: "3 min ago",
//         }

//     ],
//     searchTerm: "",
//     sortOption: "popularity",
// };

// const savedSlice = createSlice({
//     name: "saved",
//     initialState,
//     reducers: {
//         setSavedCars: (state, action: PayloadAction<CarRecord[]>) => {
//             state.cars = action.payload;
//         },
//         addSavedCar: (state, action: PayloadAction<CarRecord>) => {
//             if (!state.cars.find((c) => c.id === action.payload.id)) {
//                 state.cars.push(action.payload);
//             }
//         },
//         removeSavedCar: (state, action: PayloadAction<number>) => {
//             state.cars = state.cars.filter((c) => c.id !== action.payload);
//         },
//         setSearchTerm: (state, action: PayloadAction<string>) => {
//             state.searchTerm = action.payload;
//         },
//         setSortOption: (state, action: PayloadAction<string>) => {
//             state.sortOption = action.payload;
//         },
//     },
// });

// export const { setSavedCars, addSavedCar, removeSavedCar, setSearchTerm, setSortOption } =
//     savedSlice.actions;

// export default savedSlice.reducer;
