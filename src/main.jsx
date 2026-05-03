import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App.jsx";
import { BackendDataProvider } from "./shared/hooks/useLocalizedCatalog.js";
import { AppPreferencesProvider } from "./shared/i18n/AppPreferences.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppPreferencesProvider>
      <BackendDataProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </BackendDataProvider>
    </AppPreferencesProvider>
  </React.StrictMode>
);
