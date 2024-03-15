import { Route, Router, useNavigate } from "@solidjs/router";
import { Landing } from "./pages/Landing";
import { Features } from "./pages/Features";
import { NotFound } from "./pages/404";
import { SignIn } from "./pages/SignIn";
import PocketBase from "pocketbase";
import { TypedPocketBase, UsersResponse } from "backend-types";
import { createStore } from "solid-js/store";
import { SignOut } from "./pages/Signout";
import { MetaProvider } from "@solidjs/meta";

// Use the PocketBase instance to make API requests
export const Api = new PocketBase() as TypedPocketBase;

// Create a store to hold the user's authentication state
export const [authStore, setAuthStore] = createStore({
  token: Api.authStore.token,
  user: Api.authStore.model as UsersResponse | null,
  isValid: Api.authStore.isValid,
});

// Update the store when the user's authentication state changes
Api.authStore.onChange(() => {
  setAuthStore({
    token: Api.authStore.token,
    user: Api.authStore.model as UsersResponse | null,
    isValid: Api.authStore.isValid,
  });

  const navigate = useNavigate();

  if (!Api.authStore.isValid || !Api.authStore.token) {
    navigate("/signin");
  }
});

function App() {
  return (
    <MetaProvider>
      <Router>
        <Route path="/" component={Landing} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signout" component={SignOut} />
        <Route path="/features" component={Features} />
        <Route path="*404" component={NotFound} />
      </Router>
    </MetaProvider>
  );
}

export default App;
