import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JSX } from "solid-js";

export function MainLayout(props: {
  children:
    | number
    | boolean
    | Node
    | JSX.ArrayElement
    | (string & {})
    | null
    | undefined;
}) {
  return (
    <div class="flex flex-col min-h-screen">
      <Header />
      <main class="flex-auto">{props.children}</main>
      <Footer />
    </div>
  );
}
