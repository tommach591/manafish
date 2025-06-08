import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./reset.css";
import "./index.css";
import App from "./components/App";
import { ManaProvider } from "./utils/ManaContext";
import { FishProvider } from "./utils/FishContext";
import { GardenProvider } from "./utils/GardenContext";
import { AudioProvider } from "./utils/AudioContext";
import { SocketProvider } from "./utils/SocketContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
      <ManaProvider>
        <FishProvider>
          <GardenProvider>
            <SocketProvider>
              <AudioProvider>
                <App />
              </AudioProvider>
            </SocketProvider>
          </GardenProvider>
        </FishProvider>
      </ManaProvider>
    </BrowserRouter>
);

