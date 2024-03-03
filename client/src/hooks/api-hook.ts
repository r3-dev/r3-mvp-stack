import { ApiContext } from "@/providers/api-provider";
import { useContext } from "react";

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === null) {
    throw new Error("useBe must be used within a ApiProvider");
  }
  return context;
};
