//import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { FavoritesProvider } from "./context/FavoritesContext";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <FavoritesProvider>
    <App />
  </FavoritesProvider>
);
