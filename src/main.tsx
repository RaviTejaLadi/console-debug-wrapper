import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ConsoleDebugWrapper from "./components/ConsoleDebugWrapper/components/ConsoleDebugWrapper.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConsoleDebugWrapper>
      <App />
    </ConsoleDebugWrapper>
  </StrictMode>
);
