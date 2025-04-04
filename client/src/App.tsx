import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import NotFound from "@/pages/not-found";
import { LoadingScreen } from "./components/ui/LoadingScreen";
import { ThemeProvider } from "./context/ThemeContext";
import { HealthDataProvider } from "./context/HealthDataContext";
import BallieAssistant from "./components/BallieAssistant";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SignIn} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading for 1.5 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <HealthDataProvider>
          {loading ? <LoadingScreen /> : <Router />}
          <BallieAssistant />
          <Toaster />
        </HealthDataProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
