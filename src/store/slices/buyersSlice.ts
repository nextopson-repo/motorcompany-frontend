import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Buyer {
  id: number;
  name: string;
  role: string;
  phone: string;
  location: string;
  preferences: string[];
  imageUrl: string;
}

interface BuyersState {
  buyers: Buyer[];
}

const initialState: BuyersState = {
  buyers: [
    {
      id: 1,
      name: "Sourav Chakraborty",
      role: "Owner",
      phone: "9876543210",
      location: "Kurla, Mumbai - 700008",
      preferences: ["Maruti Suzuki", "Nexon", "Ford", "Mahindra", "Hyundai"],
      imageUrl: "/path/to/image.jpg"
    },
    {
      id: 2,
      name: "Sourav Chakraborty",
      role: "Owner",
      phone: "9876543210",
      location: "Kurla, Mumbai - 700008",
      preferences: ["Maruti Suzuki", "Nexon", "Ford", "Mahindra", "Hyundai"],
      imageUrl: "/path/to/image.jpg"
    },
    {
      id: 3,
      name: "Sourav Chakraborty",
      role: "Owner",
      phone: "9876543210",
      location: "Kurla, Mumbai - 700008",
      preferences: ["Maruti Suzuki", "Nexon", "Ford", "Mahindra", "Hyundai"],
      imageUrl: "/path/to/image.jpg"
    },
    {
      id: 4,
      name: "Sourav Chakraborty",
      role: "Owner",
      phone: "9876543210",
      location: "Kurla, Mumbai - 700008",
      preferences: ["Maruti Suzuki", "Nexon", "Ford", "Mahindra", "Hyundai"],
      imageUrl: "/path/to/image.jpg"
    },
  ]
};

const buyersSlice = createSlice({
  name: 'buyers',
  initialState,
  reducers: {
    setBuyers(state, action: PayloadAction<Buyer[]>) {
      state.buyers = action.payload;
    }
  }
});

export const { setBuyers } = buyersSlice.actions;
export default buyersSlice.reducer;
