import { createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { AppState, User, Vehicle } from '../../types';

export interface AppSliceState extends AppState {}

const initialState: AppSliceState = {
  users: [],
  vehicles: [],
  currentUser: null,
  isAuthenticated: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    addUser(state, action: PayloadAction<User>) {
      state.users.push(action.payload);
    },
    deleteUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter(u => u.id !== action.payload);
    },
    addVehicle(state, action: PayloadAction<Vehicle>) {
      state.vehicles.push(action.payload);
    },
    deleteVehicle(state, action: PayloadAction<string>) {
      state.vehicles = state.vehicles.filter(v => v.id !== action.payload);
    },
    updateVehicle(state, action: PayloadAction<Vehicle>) {
      state.vehicles = state.vehicles.map(v => v.id === action.payload.id ? action.payload : v);
    },
  },
});

export const {
  login,
  logout,
  addUser,
  deleteUser,
  addVehicle,
  deleteVehicle,
  updateVehicle,
} = appSlice.actions;

export default appSlice.reducer;


