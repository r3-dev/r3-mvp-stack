import { A } from "@solidjs/router";
import { NavBar } from "./nav-bar";

export function Header() {
  return (
    <header class="border-b">
      <div class="container flex items-center justify-between h-[60px] px-4 sm:px-6">
        <A class="font-medium" href="#">
          r3-dev
        </A>
        <NavBar />
      </div>
    </header>
  );
}
