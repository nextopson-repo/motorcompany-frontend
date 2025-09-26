import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PackageData {
  id: number;
  ads: string;
  date: string;     // format: "DD/MM/YYYY"
  validity: string; // format: "DD/MM/YYYY"
  price: string;
  status: "Active" | "Expired";
}

interface PackagesState {
  packages: PackageData[];
  sortBy: "currentYear" | "oldest" | "newest";
}

const initialState: PackagesState = {
  packages: [
    {
      id: 1,
      ads: "280 Ads",
      date: "12/05/2025",
      validity: "21/10/2025",
      price: "49,999/-",
      status: "Active",
    },
    {
      id: 2,
      ads: "280 Ads",
      date: "12/05/2025",
      validity: "21/07/2025",
      price: "49,999/-",
      status: "Expired",
    },
    {
      id: 3,
      ads: "100 Ads",
      date: "15/03/2024",
      validity: "15/09/2024",
      price: "19,999/-",
      status: "Expired",
    },
  ],
  sortBy: "currentYear",
};

export function parseDate(dateStr: string) {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
}

const boughtPackagesSlice = createSlice({
  name: "boughtPackages",
  initialState,
  reducers: {
    renewPackage: (state, action: PayloadAction<number>) => {
      const pkg = state.packages.find((p) => p.id === action.payload);
      if (pkg) {
        pkg.status = "Active";
        pkg.validity = "21/12/2025";
      }
    },
    setSortBy: (state, action: PayloadAction<PackagesState["sortBy"]>) => {
      state.sortBy = action.payload;
    },
  },
});

export const { renewPackage, setSortBy } = boughtPackagesSlice.actions;
export const selectSortedPackages = (state: { boughtPackages: PackagesState }) => {
  const { packages, sortBy } = state.boughtPackages;
  let sorted = [...packages];

  if (sortBy === "newest") {
    sorted.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
  } else if (sortBy === "oldest") {
    sorted.sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());
  } else if (sortBy === "currentYear") {
    const year = new Date().getFullYear();
    sorted = sorted.filter((p) => parseDate(p.date).getFullYear() === year);
  }
  return sorted;
};

export default boughtPackagesSlice.reducer;
