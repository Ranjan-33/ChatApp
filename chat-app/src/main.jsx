import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ReactDom from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppContextProvider from "./Context/AppContext.jsx";

ReactDom.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>
);
