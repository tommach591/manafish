import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./reset.css";
import "./index.css";
import App from "./components/App";
import { IncomeProvider } from "./utils/AccountContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <IncomeProvider>
        <App />
      </IncomeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

