import { BackendApi } from "backend-api";


export function SignOut() {
  BackendApi.authStore.clear();

  return null;
}
