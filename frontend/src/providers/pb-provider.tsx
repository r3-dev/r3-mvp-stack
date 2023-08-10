import { ReactNode, useEffect, useMemo, useState } from "react";
import PocketBase from "pocketbase";
import PocketBaseContext from "@/contexts/pb-context";

export function PocketBaseProvider({ children }: { children: ReactNode }) {
  // Make sure to register http://127.0.0.1:8090/api/oauth2-redirect as redirect url.
  const pb = useMemo(() => new PocketBase("http://127.0.0.1:8090"), []);
  const [, setToken] = useState(pb.authStore.token);
  const [, setUser] = useState(pb.authStore.model);

  useEffect(() => {
    return pb.authStore.onChange((token, model) => {
      setToken(token);
      setUser(model);
    });
  }, []);

  return (
    <PocketBaseContext.Provider value={{ pb }}>
      {children}
    </PocketBaseContext.Provider>
  );
}
