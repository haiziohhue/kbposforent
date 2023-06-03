import React, { createContext, useState, ReactNode } from 'react';

interface OrderContextType {
  selectedOrderId: number | null;
  handleEditOrder: (orderId: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

const OrderProvider = ({ children }: OrderProviderProps) => {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const handleEditOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
  };

  const orderContextValue: OrderContextType = {
    selectedOrderId,
    handleEditOrder,
  };

  return (
    <OrderContext.Provider value={orderContextValue}>
      {children}
    </OrderContext.Provider>
  );
};

export { OrderContext, OrderProvider };