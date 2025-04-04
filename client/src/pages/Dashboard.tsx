import { useEffect } from "react";
import Header from "../components/Header";
import StatusOverview from "../components/StatusOverview";
import BloodSugarMonitor from "../components/BloodSugarMonitor";
import MedicationTracker from "../components/MedicationTracker";
import NutritionAssistant from "../components/NutritionAssistant";
import WearableIntegration from "../components/WearableIntegration";
import ActivityTracker from "../components/ActivityTracker";
import AlertsSection from "../components/AlertsSection";
import BallieAssistant from "../components/BallieAssistant";
import { useHealthData } from "../context/HealthDataContext";

export default function Dashboard() {
  const { refreshData } = useHealthData();

  useEffect(() => {
    // Initial data fetch
    refreshData();
    
    // Set up interval for periodic updates
    const intervalId = setInterval(() => {
      refreshData();
    }, 60000); // Refresh every minute
    
    return () => clearInterval(intervalId);
  }, [refreshData]);

  return (
    <div className="min-h-screen bg-background pb-16">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <StatusOverview />
        
        {/* Main grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* First column (spans 2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            <BloodSugarMonitor />
            <MedicationTracker />
            <NutritionAssistant />
          </div>
          
          {/* Second column */}
          <div className="space-y-6">
            <WearableIntegration />
            <ActivityTracker />
            <AlertsSection />
          </div>
        </div>
      </main>
      
      <BallieAssistant />
    </div>
  );
}
