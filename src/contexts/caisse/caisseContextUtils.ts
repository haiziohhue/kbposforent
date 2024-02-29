import { useContext } from "react";
import { CaisseContext, CaisseContextType } from "./CaisseContextProvider";

export const useCaisseContext = (): CaisseContextType => {
  const context = useContext(CaisseContext);
  if (!context) {
    throw new Error(
      "useCaisseContext must be used within a CaisseContextProvider"
    );
  }
  return context;
};
