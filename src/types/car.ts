export interface CarRecord {
  id: string | number;
  brand: string;
  model: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  ownership?: string;
  seats?: number;
  carPrice?: number;
  manufacturingYear?: number;
  kmDriven?: number;
  mileage?: number;
  address?: { state?: string; city?: string };
  carImages?: { imageUrl?: string }[];
  user?: { fullName?: string; userType?: string; mobileNumber?: number };
  updatedAt?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface FiltersState {
  brand: string[];
  fuel: string[];
  transmission: string[];
  bodyType: string[];
  ownership: string[];
  location: string[];
  ownerType: "all" | "owner" | "dealer"; // single value
  priceRange: [number, number]; // remove | null
  yearRange: [number, number]; // remove | null
}
