import React, { createContext, useEffect, useState } from "react";

export type CaisseContextType = {
  selectedCaisseId: number | null;
  selectedCaisseEtat: string | null;
  setSelectedCaisseId: (id: number) => void;
  // setSelectedCaisseEtat: (etat: string) => void;
  setSelectedCaisse: (id: number) => void;
};

export const CaisseContext = createContext<CaisseContextType | undefined>(
  undefined
);

export const CaisseContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedCaisseId, setSelectedCaisseId] = useState<number | null>(null);
  const [selectedCaisseEtat, setSelectedCaisseEtat] = useState<string | null>(
    null
  );

  useEffect(() => {
    const storedCaisseId = localStorage.getItem("selectedCaisseId");
    const storedCaisseEtat = localStorage.getItem("selectedCaisseEtat");
    if (storedCaisseId) {
      setSelectedCaisseId(parseInt(storedCaisseId));
    }
    if (storedCaisseEtat) {
      setSelectedCaisseEtat(storedCaisseEtat);
    }
  }, []);

  const setSelectedCaisse = (id: number) => {
    setSelectedCaisseId(id);
    // setSelectedCaisseEtat(etat);
    localStorage.setItem("selectedCaisseId", id.toString());
    // localStorage.setItem("selectedCaisseEtat", etat);
  };

  const contextValue: CaisseContextType = {
    selectedCaisseId,
    selectedCaisseEtat,
    setSelectedCaisseId,
    setSelectedCaisse,
  };

  return (
    <CaisseContext.Provider value={contextValue}>
      {children}
    </CaisseContext.Provider>
  );
};
