import { Route, Router } from "@solidjs/router";
import { Landing } from "./pages/Landing";
import { Features } from "./pages/Features";
import { NotFound } from "./pages/404";
import { SignIn } from "./pages/SignIn";
import PocketBase from "pocketbase";

const api = new PocketBase();

function App() {
  return (
    <Router>
      <Route path="/" component={Landing} />
      <Route path="/signin" component={SignIn} />
      <Route path="/features" component={Features} />
      <Route path="*404" component={NotFound} />
    </Router>
  );
}

export default App;
