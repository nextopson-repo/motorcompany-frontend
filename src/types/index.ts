export interface User {
  id: string;
  name: string;
  fullName?: string;
  email: string;
  mobile: string;
  mobileNumber?: string;
  type: 'Owner' | 'Dealer' | 'EndUser';
  userType?: 'Owner' | 'Dealer' | 'EndUser';
  createdAt: string;
  accountType?: string;
  isMobileVerified?: boolean;
}

export interface Vehicle {
  id?: string; // optional because new vehicles won't have an id yet
  title?: string; // optional, can generate from carName or model
  carName: string;
  brand: string;
  model: string;
  variant?: string;
  bodyType?: string;
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric';
  transmission: 'Manual' | 'Automatic';
  ownership: '1st' | '2nd' | '3rd' | '3+';
  manufacturingYear: number;
  registrationYear: number;
  kmDriven?: string;
  seats: '2' | '4' | '5' | '6' | '7' | '8';
  isSale: 'Sell' | 'Rent';
  carPrice: string;
  image?: string; // main image or first image
  carImages?: { id: string; imageKey: File; presignedUrl?: string }[]; // optional array of images
  address?: {
    state: string;
    city: string;
    locality: string;
  };
  owner?: string; // userId
  isActive?: boolean;
  createdBy?: string;
  updatedBy?: string;
}


export interface AppState {
  users: User[];
  vehicles: Vehicle[];
  currentUser: User | null;
  isAuthenticated: boolean;
}

export type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'ADD_VEHICLE'; payload: Vehicle }
  | { type: 'DELETE_VEHICLE'; payload: string }
  | { type: 'UPDATE_VEHICLE'; payload: Vehicle };
