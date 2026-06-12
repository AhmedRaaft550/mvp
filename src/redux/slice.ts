import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { MealItem } from "../const/menu-static-data";

type CartState = {
  cartItems: MealItem[];
  cartTotalQuantity: number;
  cartTotalAmount: number;
};

type Chatbot_Box_state = {
  chatbotBoxOpen: boolean;
  chatQuery: string;
};

const cartInitialState: CartState = {
  cartItems: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
};

const chatbot_Box_state: Chatbot_Box_state = {
  chatbotBoxOpen: false,
  chatQuery: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState: cartInitialState,
  reducers: {
    addToCart: (state, action: PayloadAction<MealItem>) => {
      const isExisiting = state.cartItems.some((item) => {
        return item.id === action.payload.id;
      });

      if (!isExisiting) {
        state.cartItems.push(action.payload);
        state.cartTotalQuantity = state.cartItems.length;
        return;
      }
    },

    removeFromCart: (state, action: PayloadAction<MealItem>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload.id,
      );
      state.cartTotalQuantity = state.cartItems.length;
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.cartTotalQuantity = 0;
    },
  },
});

const chatBotBoxReducer = createSlice({
  name: "chatBotBox",
  initialState: chatbot_Box_state,
  reducers: {
    setChatBotBoxOpen: (state, action: PayloadAction<boolean>) => {
      state.chatbotBoxOpen = action.payload;
    },

    setChatQuery: (state, action: PayloadAction<string>) => {
      state.chatQuery = action.payload;
    },
  },
});

// cart reducer
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

// chatbot reducer
export const { setChatBotBoxOpen, setChatQuery } = chatBotBoxReducer.actions;
export const chatbotReducer = chatBotBoxReducer.reducer;
