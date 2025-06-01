import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./reset.css";
import "./index.css";
import App from "./components/App";
import { ManaProvider } from "./utils/ManaContext";
import { FishProvider } from "./utils/FishContext";
import { GardenProvider } from "./utils/GardenContext";
import { UtilProvider } from "./utils/UtilContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
    <UtilProvider>
      <ManaProvider>
        <FishProvider>
          <GardenProvider>
            <App />
          </GardenProvider>
        </FishProvider>
      </ManaProvider>
      </UtilProvider>
    </BrowserRouter>
);

