import { RootRoute, Route, Router } from "@tanstack/react-router";
import App from "../pages/App";
import Root from "./root";

// Create a root route
export const rootRoute = new RootRoute({
  component: Root,
});

// Create an index route
export const appRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([appRoute]);

// Create the router using your route tree
const router = new Router({ routeTree });

export default router;
