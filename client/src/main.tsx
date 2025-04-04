import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { HealthDataProvider } from "./context/HealthDataContext";
import { Toaster } from "@/components/ui/toaster";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <HealthDataProvider>
      <App />
      <Toaster />
    </HealthDataProvider>
  </ThemeProvider>
);
