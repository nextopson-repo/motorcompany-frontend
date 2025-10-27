import { createSlice } from "@reduxjs/toolkit";

interface Lead {
  id: number;
  name: string;
  city: string;
  timeAgo: string;
  image: string;
}

interface LeadsState {
  leads: Lead[];
}

const initialState: LeadsState = {
  leads: [
    {
      id: 1,
      name: "Sourav Chakraborty",
      city: "Mumbai",
      timeAgo: "3 weeks ago",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      name: "Marvin McKinney",
      city: "Mumbai",
      timeAgo: "3 weeks ago",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: 3,
      name: "Arlene McCoy",
      city: "Mumbai",
      timeAgo: "3 weeks ago",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      id: 4,
      name: "Theresa Webb",
      city: "Mumbai",
      timeAgo: "3 weeks ago",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      id: 5,
      name: "Jerome Bell",
      city: "Mumbai",
      timeAgo: "3 weeks ago",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
    },
  ],
};

const leadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {},
});

export default leadsSlice.reducer;
