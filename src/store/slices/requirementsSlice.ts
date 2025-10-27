import { createSlice } from "@reduxjs/toolkit";

interface Requirement {
  id: number;
  name: string;
  location: string;
  contact: string;
  budget: string;
  requirements: string;
  timeAgo: string;
  image: string;
}

interface RequirementState {
  data: Requirement[];
}

const initialState: RequirementState = {
  data: [
    {
      id: 1,
      name: "Sourav Chakraborty",
      location: "Bhopal, Madhya Pradesh",
      contact: "+91 9098765432",
      budget: "₹ 50–70 Lakh",
      requirements: "Maruti Suzuki, Nexon, Ford, Hyundai, Petrol",
      timeAgo: "2 days ago",
      image: "https://i.pravatar.cc/100?img=5",
    },
    {
      id: 2,
      name: "Aman Verma",
      location: "Indore, Madhya Pradesh",
      contact: "+91 9823456789",
      budget: "₹ 20–30 Lakh",
      requirements: "Tata, Mahindra, Kia, Diesel",
      timeAgo: "1 day ago",
      image: "https://i.pravatar.cc/100?img=8",
    },
  ],
};

const requirementsSlice = createSlice({
  name: "requirements",
  initialState,
  reducers: {},
});

export default requirementsSlice.reducer;
