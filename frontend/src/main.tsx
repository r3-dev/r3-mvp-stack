import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "@tanstack/react-router";
import router from "./router/index.ts";
import { PocketBaseProvider } from "./providers/pb-provider.tsx";

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PocketBaseProvider>
      <RouterProvider router={router} />
    </PocketBaseProvider>
  </React.StrictMode>
);
