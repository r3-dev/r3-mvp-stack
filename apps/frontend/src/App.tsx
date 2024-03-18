import { Route, Router, useNavigate } from "@solidjs/router";
import { Landing } from "./pages/Landing";
import { Features } from "./pages/Features";
import { NotFound } from "./pages/404";
import { SignIn } from "./pages/SignIn";
import { UsersResponse } from "backend-api/types";
import { createStore } from "solid-js/store";
import { SignOut } from "./pages/Signout";
import { MetaProvider } from "@solidjs/meta";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { BackendApi } from "backend-api";


// Create a store to hold the user's authentication state
export const [authStore, setAuthStore] = createStore({
  token: BackendApi.authStore.token,
  user: BackendApi.authStore.model as UsersResponse | null,
  isValid: BackendApi.authStore.isValid,
});

// Update the store when the user's authentication state changes
BackendApi.authStore.onChange(() => {
  setAuthStore({
    token: BackendApi.authStore.token,
    user: BackendApi.authStore.model as UsersResponse | null,
    isValid: BackendApi.authStore.isValid,
  });

  const navigate = useNavigate();

  if (!BackendApi.authStore.isValid || !BackendApi.authStore.token) {
    navigate("/signin");
  }
});

const queryClient = new QueryClient();

function App() {
  return (
    <MetaProvider>
    <QueryClientProvider client={queryClient}>
      <Router>
        <Route path="/" component={Landing} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signout" component={SignOut} />
        <Route path="/features" component={Features} />
        <Route path="*404" component={NotFound} />
      </Router>
    </QueryClientProvider>
    </MetaProvider>
  );
}

export default App;
