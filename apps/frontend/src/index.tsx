/* @refresh reload */
import { render } from "solid-js/web";

import App from "./App";
import "@/styles/global.css";

const root = document.getElementById("root");

render(() => <App />, root!);
