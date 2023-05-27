import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { CartProvider } from './contexts/cart/CartProvider';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);
