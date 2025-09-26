import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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
}

const initialState: EnquiryState = {
  enquiries: [
    {
      id: "1",
      carTitle: "2021 Renault KWID Climber 1.0 MT Opt",
      kmDriven: "30,000 kms",
      carType: "SUV 5 Seater",
      mileage: "19.4 Kmpl",
      fuelType: "Petrol",
      transmission: "Manual",
      location: "Kurla East, Mumbai",
      price: 982000,
      emi: "Rs. 6,203 / mo",
      owner: {
        name: "Sourav Chakraborty",
        role: "Owner",
        phone: "+91-9876543210",
        address: "Kurla East, Mumbai - 700986",
        avatar: "https://i.pravatar.cc/100?img=3",
        timeAgo: "10 min ago",
      },
      image: "/fallback-car-img.png",
    },
    {
      id: "2",
      carTitle: "2021 Renault KWID Climber 1.0 MT Opt",
      kmDriven: "30,000 kms",
      carType: "SUV 5 Seater",
      mileage: "19.4 Kmpl",
      fuelType: "Petrol",
      transmission: "Manual",
      location: "Kurla East, Mumbai",
      price: 562000,
      emi: "Rs. 6,203 / mo",
      owner: {
        name: "Annette Black",
        role: "Owner",
        phone: "+91-9876543210",
        address: "Kurla East, Mumbai - 700986",
        avatar: "https://i.pravatar.cc/100?img=5",
        timeAgo: "10 min ago",
      },
      image: "/fallback-car-img.png",
    },
  ],
};

const enquiriesSlice = createSlice({
  name: "enquiries",
  initialState,
  reducers: {
    addEnquiry: (state, action: PayloadAction<Enquiry>) => {
      state.enquiries.push(action.payload);
    },
  },
});

export const { addEnquiry } = enquiriesSlice.actions;
export default enquiriesSlice.reducer;
