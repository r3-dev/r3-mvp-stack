import { PocketBaseContext } from "@/providers/pocketbase-provider";
import { useContext } from "react";

export const usePocketbase = () => {
  const context = useContext(PocketBaseContext);
  if (context === null) {
    throw new Error('usePocketbase must be used within a PocketBaseProvider');
  }
  return context;
};