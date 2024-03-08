import { Api } from "@/App";
import { useNavigate } from "@solidjs/router";

export function SignOut() {
  const navigate = useNavigate();

  Api.authStore.clear();

  return null;
}
