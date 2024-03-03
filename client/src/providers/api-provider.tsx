import { PropsWithChildren, createContext } from "react";
import { ApiClient } from "@/api/api";

export const ApiContext = createContext<ApiClient | null>(null);

export const ApiProvider: React.FC<PropsWithChildren<{ api: ApiClient }>> = ({
  api,
  children,
}) => {
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
