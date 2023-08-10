import { createContext } from "react";
import PocketBase from "pocketbase";

interface IPocketBaseContext {
  pb: PocketBase;
}

const PocketBaseContext = createContext<IPocketBaseContext>(
  {} as IPocketBaseContext
);

export default PocketBaseContext;
