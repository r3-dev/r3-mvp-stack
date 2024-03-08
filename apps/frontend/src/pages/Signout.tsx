import { Api } from "@/App";

export function SignOut() {
  Api.authStore.clear();

  return null;
}
