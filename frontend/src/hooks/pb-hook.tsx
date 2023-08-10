import PocketBaseContext from "@/contexts/pb-context";
import { useContext } from "react";

export default function usePocketBase() {
  return useContext(PocketBaseContext);
}
