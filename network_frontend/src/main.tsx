import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App
      backendUrl={import.meta.env.VITE_BACKEND_URL || "/api"}
      numPorts={import.meta.env.VITE_NUM_PORTS || 26}
      updateInterval={import.meta.env.VITE_UPDATE_INTERVAL || 10000}
    />
  </StrictMode>
);
