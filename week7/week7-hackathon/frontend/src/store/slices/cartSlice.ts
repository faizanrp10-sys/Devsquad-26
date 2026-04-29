import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  note: string;
}

interface CartState {
  items: CartItem[];
  orderType: 'Dine In' | 'To Go' | 'Delivery';
  discount: number;
  tableNo: string;
  customerName: string;
}

const initialState: CartState = {
  items: [],
  orderType: 'Dine In',
  discount: 0,
  tableNo: '',
  customerName: '',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Omit<CartItem, 'quantity' | 'note'>>) {
      const existing = state.items.find(
        (item) => item.productId === action.payload.productId,
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1, note: '' });
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload,
      );
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId,
      );
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },
    updateNote(
      state,
      action: PayloadAction<{ productId: string; note: string }>,
    ) {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId,
      );
      if (item) {
        item.note = action.payload.note;
      }
    },
    setOrderType(state, action: PayloadAction<'Dine In' | 'To Go' | 'Delivery'>) {
      state.orderType = action.payload;
    },
    setDiscount(state, action: PayloadAction<number>) {
      state.discount = action.payload;
    },
    setTableNo(state, action: PayloadAction<string>) {
      state.tableNo = action.payload;
    },
    setCustomerName(state, action: PayloadAction<string>) {
      state.customerName = action.payload;
    },
    clearCart(state) {
      state.items = [];
      state.discount = 0;
      state.tableNo = '';
      state.customerName = '';
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  updateNote,
  setOrderType,
  setDiscount,
  setTableNo,
  setCustomerName,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
