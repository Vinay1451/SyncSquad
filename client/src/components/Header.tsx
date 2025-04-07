import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useSafeTheme } from "@/hooks/use-safe-context";
import { motion } from "framer-motion";
// Using PNG image URLs for logos
const kalasalingamLogo = "https://sis.kalasalingam.ac.in/images/kare_logo.png";
const eleviumLogo =
  "https://d3j0t7vrtr92dk.cloudfront.net/elab/1731303245_1.png";

export default function Header() {
  const { theme, toggleTheme } = useSafeTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update the clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Kalasalingam Academy logo and text */}
          <div className="flex items-center space-x-3">
            <img
              src={kalasalingamLogo}
              alt="Kalasalingam Academy Logo"
              className="h-16 w-auto"
            />
            <div className="hidden md:block">
              <h3 className="text-lg font-medium leading-tight">
                Kalasalingam Academy
              </h3>
              <p className="text-sm text-muted-foreground">
                Of Research And Education
              </p>
            </div>
          </div>

          {/* Center - Project title and animated clock */}
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-center">
              AI-Powered Blood Glucose Monitoring System
            </h1>
            <div className="flex flex-col sm:flex-row items-center text-sm text-muted-foreground mt-1">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center mx-1"
              >
                {formatDate(currentTime)}
              </motion.div>
              <span className="hidden sm:block mx-1">•</span>
              <motion.div
                key={currentTime.getSeconds()}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="font-mono font-medium text-primary mx-1"
              >
                {formatTime(currentTime)}
              </motion.div>
            </div>
          </div>

          {/* Right side - Elevium logo and theme toggle */}
          <div className="flex items-center space-x-4">
            <img src={eleviumLogo} alt="Elevium Logo" className="h-16 w-auto" />
            <div className="hidden md:flex flex-col items-start">
              <h3 className="text-lg font-medium">Elevium</h3>
              <p className="text-sm text-muted-foreground">
                NanoChip Solutions
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
