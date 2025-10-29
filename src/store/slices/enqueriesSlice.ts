import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Enquiry {
  id: string;
  carTitle: string;
  kmDriven: string;
  carType: string;
  mileage: string;
  fuelType: string;
  transmission: string;
  location: string;
  price: number;
  emi: string;
  owner: {
    name: string;
    role: string;
    phone: string;
    address: string;
    avatar: string;
    timeAgo: string;
  };
  image: string;
}

interface EnquiryState {
  enquiries: Enquiry[];
  loading: boolean;
  error: string | null;
}

const initialState: EnquiryState = {
  enquiries: [],
  loading: false,
  error: null,
};

// 🧠 API base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 🔹 Async thunk for fetching all car enquiries
export const fetchEnquiries = createAsyncThunk(
  "enquiries/fetchAll",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/dashboard/get-all-car-enquiries?page=${page}&limit=${limit}`
      );
      return response.data?.responseObject?.enquiries || []; // depends on your API response structure
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch enquiries"
      );
    }
  }
);

const enquiriesSlice = createSlice({
  name: "enquiries",
  initialState,
  reducers: {
    addEnquiry: (state, action: PayloadAction<Enquiry>) => {
      state.enquiries.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiries = action.payload;
      })
      .addCase(fetchEnquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addEnquiry } = enquiriesSlice.actions;
export default enquiriesSlice.reducer;



// import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// export interface Enquiry {
//   id: string;
//   carTitle: string;
//   kmDriven: string;
//   carType: string;
//   mileage: string;
//   fuelType: string;
//   transmission: string;
//   location: string;
//   price: number;
//   emi: string;
//   owner: {
//     name: string;
//     role: string;
//     phone: string;
//     address: string;
//     avatar: string;
//     timeAgo: string;
//   };
//   image: string;
// }

// interface EnquiryState {
//   enquiries: Enquiry[];
// }

// const initialState: EnquiryState = {
//   enquiries: [
//     {
//       id: "1",
//       carTitle: "2021 Renault KWID Climber 1.0 MT Opt",
//       kmDriven: "30,000 kms",
//       carType: "SUV 5 Seater",
//       mileage: "19.4 Kmpl",
//       fuelType: "Petrol",
//       transmission: "Manual",
//       location: "Kurla East, Mumbai",
//       price: 982000,
//       emi: "Rs. 6,203 / mo",
//       owner: {
//         name: "Sourav Chakraborty",
//         role: "Owner",
//         phone: "+91-9876543210",
//         address: "Kurla East, Mumbai - 700986",
//         avatar: "https://i.pravatar.cc/100?img=3",
//         timeAgo: "10 min ago",
//       },
//       image: "/fallback-car-img.png",
//     },
//     {
//       id: "2",
//       carTitle: "2021 Renault KWID Climber 1.0 MT Opt",
//       kmDriven: "30,000 kms",
//       carType: "SUV 5 Seater",
//       mileage: "19.4 Kmpl",
//       fuelType: "Petrol",
//       transmission: "Manual",
//       location: "Kurla East, Mumbai",
//       price: 562000,
//       emi: "Rs. 6,203 / mo",
//       owner: {
//         name: "Annette Black",
//         role: "Owner",
//         phone: "+91-9876543210",
//         address: "Kurla East, Mumbai - 700986",
//         avatar: "https://i.pravatar.cc/100?img=5",
//         timeAgo: "10 min ago",
//       },
//       image: "/fallback-car-img.png",
//     },
//   ],
// };

// const enquiriesSlice = createSlice({
//   name: "enquiries",
//   initialState,
//   reducers: {
//     addEnquiry: (state, action: PayloadAction<Enquiry>) => {
//       state.enquiries.push(action.payload);
//     },
//   },
// });

// export const { addEnquiry } = enquiriesSlice.actions;
// export default enquiriesSlice.reducer;
