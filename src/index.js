import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./reset.css";
import "./index.css";
import App from "./components/App";
import { ManaProvider } from "./utils/ManaContext";
import { FishProvider } from "./utils/FishContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ManaProvider>
        <FishProvider>
          <App />
        </FishProvider>
      </ManaProvider>
    </BrowserRouter>
  </React.StrictMode>
);

