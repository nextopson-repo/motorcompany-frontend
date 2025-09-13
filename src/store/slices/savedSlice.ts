import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Car {
    id: number;
    brand: string;
    model: string;
    carPrice: number;
    manufacturingYear: number;
    fuelType: string;
    transmission: string;
    bodyType: string;
    ownership: string;
    mileage?: number;
    seats?: number;
    // carImages?: { imageUrl: string }[];
    address?: { city?: string; state?: string };
    user?: { fullName?: string; userType?: string };
    updatedAt: string;
    createdAt: string;
}

interface SavedState {
    cars: Car[];
    searchTerm: string;
    sortOption: string;
}

const initialState: SavedState = {
    cars: [
        {
            id: 1,
            brand: "Hyundai",
            model: "Exterior",
            carPrice: 880000,
            manufacturingYear: 2020,
            fuelType: "Petrol",
            transmission: "Automatic",
            bodyType: "Hatchback",
            ownership: "2nd",
            mileage: 19.4,
            seats: 5,
             // carImages?: { imageUrl:  }[],
            address: { city: "Indore", state: "Madhya Pradesh" },
            user: { fullName: "Dhiraj", userType: "owner" },
            updatedAt: "2 days ago",
            createdAt: "2 days ago",
        },
        {
            id: 2,
            brand: "Mahindra",
            model: "Bolero",
            carPrice: 1050000,
            manufacturingYear: 2020,
            fuelType: "Diesel",
            transmission: "Manual",
            bodyType: "SUV",
            ownership: "2nd",
            mileage: 15.6,
            seats: 7,
            // carImages?: { imageUrl:  }[],
            address: { city: "Indore", state: "Madhya Pradesh" },
            user: { fullName: "Dhiraj", userType: "owner" },
            updatedAt: "1 hr ago",
            createdAt: "1 hr ago",
        },
        {
            id: 3,
            brand: "Mahindra",
            model: "Bolero",
            carPrice: 1050000,
            manufacturingYear: 2020,
            fuelType: "Petrol",
            transmission: "Manual",
            bodyType: "SUV",
            ownership: "2nd",
            mileage: 15.6,
            seats: 7,
            // carImages?: { imageUrl:  }[],
            address: { city: "Indore", state: "Madhya Pradesh" },
            user: { fullName: "niraj", userType: "dealer" },
            updatedAt: "3 min ago",
            createdAt: "3 min ago",
        }

    ], // initially empty, will be filled by API or hardcoded defaults
    searchTerm: "",
    sortOption: "popularity",
};

const savedSlice = createSlice({
    name: "saved",
    initialState,
    reducers: {
        setSavedCars: (state, action: PayloadAction<Car[]>) => {
            state.cars = action.payload;
        },
        addSavedCar: (state, action: PayloadAction<Car>) => {
            if (!state.cars.find((c) => c.id === action.payload.id)) {
                state.cars.push(action.payload);
            }
        },
        removeSavedCar: (state, action: PayloadAction<number>) => {
            state.cars = state.cars.filter((c) => c.id !== action.payload);
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
        setSortOption: (state, action: PayloadAction<string>) => {
            state.sortOption = action.payload;
        },
    },
});

export const { setSavedCars, addSavedCar, removeSavedCar, setSearchTerm, setSortOption } =
    savedSlice.actions;

export default savedSlice.reducer;
