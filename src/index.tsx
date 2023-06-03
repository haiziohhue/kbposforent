import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { CartProvider } from "./contexts/cart/CartProvider";
import { OrderProvider } from "./contexts/order/OrderContext";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <OrderProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </OrderProvider>
  </React.StrictMode>
);
