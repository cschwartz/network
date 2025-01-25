import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App
      numPorts={import.meta.env.VITE_NUM_PORTS}
      updateInterval={import.meta.env.VITE_UPDATE_INTERVAL}
    />
  </StrictMode>
);
