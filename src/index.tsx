import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { CartProvider } from "./contexts/cart/CartProvider";
import { AppProvider } from "./contexts/user/AppProvider";
import { CaisseContextProvider } from "./contexts/caisse/CaisseContextProvider";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AppProvider>
      <CartProvider>
        <CaisseContextProvider>
          <App />
        </CaisseContextProvider>
      </CartProvider>
    </AppProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
