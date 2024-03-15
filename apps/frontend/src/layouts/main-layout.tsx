import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Title } from "@solidjs/meta";
import { JSX } from "solid-js";

const baseTitle = "Create R3 mvp"

export function MainLayout(props: {
  title?: string,
  children:
    | number
    | boolean
    | Node
    | JSX.ArrayElement
    | (string & {})
    | null
    | undefined;
  }) {
    const title = props.title ? `${props.title} | ${baseTitle}` : baseTitle;
  return (
    <div class="flex flex-col min-h-screen">
      <Title>{title}</Title>
      <Header />
      <main class="flex-auto">{props.children}</main>
      <Footer />
    </div>
  );
}
