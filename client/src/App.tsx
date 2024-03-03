import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./app.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { PocketBaseProvider } from "./providers/pocketbase-provider";
import Pocketbase from "pocketbase";
import { TypedPocketBase } from "./types/pocketbase-types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiProvider } from "./providers/api-provider";
import { createApiClient } from "./api/api";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
  const pb = new Pocketbase("http://localhost:3000") as TypedPocketBase;
  const queryClient = new QueryClient();
  const api = createApiClient(pb);

  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <PocketBaseProvider pb={pb}>
          <ApiProvider api={api}>
            <RouterProvider router={router} />
          </ApiProvider>
        </PocketBaseProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
