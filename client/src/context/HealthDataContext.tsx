import { createContext, useContext, useState, useCallback } from "react";
import { apiRequest } from "../lib/queryClient";
import { HealthData, defaultHealthData } from "../lib/healthData";
import { useToast } from "@/hooks/use-toast";

interface HealthDataContextType {
  healthData: HealthData;
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export function HealthDataProvider({ children }: { children: React.ReactNode }) {
  const [healthData, setHealthData] = useState<HealthData>(defaultHealthData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest("GET", "/api/health-data", undefined);
      const data = await response.json();
      
      // Process meal data to ensure it has iconType field
      const processedMeals = data.meals.map((meal: any) => {
        // Make sure meal has the correct iconType property based on the meal type
        let iconType = "lunch"; // Default
        
        if (meal.type === "Breakfast") {
          iconType = "breakfast";
        } else if (meal.type === "Dinner") {
          iconType = "dinner";
        } else if (meal.type === "Snack") {
          iconType = "snack";
        }
        
        return {
          ...meal,
          iconType,
          iconBg: meal.iconBg || "bg-yellow-100 dark:bg-yellow-900/30",
          iconColor: meal.iconColor || "text-yellow-500"
        };
      });
      
      setHealthData({
        ...data,
        meals: processedMeals
      });
    } catch (error) {
      console.error("Error fetching health data:", error);
      toast({
        title: "Error refreshing data",
        description: "Could not fetch the latest health data. Using simulated data instead.",
        variant: "destructive"
      });
      
      // Fallback to simulated data (slightly modified)
      const modifiedData = {
        ...defaultHealthData,
        currentGlucose: defaultHealthData.currentGlucose + Math.floor(Math.random() * 10 - 5)
      };
      setHealthData(modifiedData);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return (
    <HealthDataContext.Provider value={{ healthData, refreshData, isLoading }}>
      {children}
    </HealthDataContext.Provider>
  );
}

export function useHealthData() {
  const context = useContext(HealthDataContext);
  
  if (context === undefined) {
    throw new Error("useHealthData must be used within a HealthDataProvider");
  }
  
  return context;
}
