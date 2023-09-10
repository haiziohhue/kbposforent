import React, { createContext, useReducer } from "react";
import { IMenu } from "../../interfaces";

type CartItem = {
  id: number;
  menus: IMenu;
  quantity: number;
  component: string;
};

type CartState = {
  cartItems: CartItem[];
};

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART_ITEMS"; payload: CartItem[] };

type CartContextType = {
  cartState: CartState;
  dispatch: React.Dispatch<CartAction>;
};

const initialCartState: CartState = {
  cartItems: [],
};

const CartContext = createContext<CartContextType>({
  cartState: initialCartState,
  //   dispatch: () => {},
  dispatch: () => {
    throw new Error("Dispatch method not implemented");
  },
});

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.cartItems?.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        // Item already exists, update its quantity
        return {
          ...state,
          cartItems: state.cartItems?.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        // Item does not exist, add it to the cart
        return {
          ...state,
          cartItems: [...state.cartItems, action.payload],
        };
      }
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        cartItems: state.cartItems?.filter(
          (item) => item.id !== action.payload
        ),
      };
    case "SET_CART_ITEMS":
      return {
        ...state,
        cartItems: action.payload,
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems?.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "CLEAR_CART":
      return {
        ...state,
        cartItems: [],
      };
    default:
      return state;
  }
};
type CartProviderProps = {
  children: React.ReactNode;
};
const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);

  return (
    <CartContext.Provider value={{ cartState, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider, CartContext };
