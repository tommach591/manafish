import React from "react";
import ReactDOM from "react-dom/client";
import "./reset.css";
import "./index.css";
import App from "./components/App";
import { IncomeProvider } from "./utils/IncomeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <IncomeProvider>
      <App />
    </IncomeProvider>
  </React.StrictMode>
);

