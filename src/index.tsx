import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { CartProvider } from "./contexts/cart/CartProvider";
import { AppProvider } from "./contexts/user/AppProvider";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AppProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AppProvider>
  </React.StrictMode>
);
