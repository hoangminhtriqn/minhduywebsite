import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  _id: string;
  ProductID: {
    _id: string;
    Product_Name: string;
    Price: number;
    Main_Image: string;
  };
  quantity: number;
  priceAtOrder: number;
  Image: string;
}

interface Order {
  _id: string;
  UserId: string;
  Items: CartItem[];
  TotalAmount: number;
  Status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  Order_Date: string;
  Test_Drive_Date: string;
  Address: string;
  Notes?: string;
  ImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(order => order._id === action.payload._id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    removeOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(order => order._id !== action.payload);
    },
  },
});

export const { setOrders, setLoading, setError, addOrder, updateOrder, removeOrder } = orderSlice.actions;
export default orderSlice.reducer; 