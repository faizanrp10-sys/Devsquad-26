import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Bid {
  amount: number;
  bidder: {
    _id: string;
    name: string;
  };
  timestamp: string;
}

interface BidState {
  recentBids: Bid[];
}

const initialState: BidState = {
  recentBids: [],
};

const bidSlice = createSlice({
  name: 'bids',
  initialState,
  reducers: {
    addBid: (state, action: PayloadAction<Bid>) => {
      // Add to start of list, keep last 10
      state.recentBids = [action.payload, ...state.recentBids].slice(0, 10);
    },
    setBids: (state, action: PayloadAction<Bid[]>) => {
      state.recentBids = action.payload;
    },
    clearBids: (state) => {
      state.recentBids = [];
    }
  },
});

export const { addBid, setBids, clearBids } = bidSlice.actions;
export default bidSlice.reducer;
