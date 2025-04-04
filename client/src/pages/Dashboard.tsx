import { useEffect, useState } from "react";
import Header from "../components/Header";
import StatusOverview from "../components/StatusOverview";
import BloodSugarMonitor from "../components/BloodSugarMonitor";
import MedicationTracker from "../components/MedicationTracker";
import NutritionAssistant from "../components/NutritionAssistant";
import WearableIntegration from "../components/WearableIntegration";
import ActivityTracker from "../components/ActivityTracker";
import AlertsSection from "../components/AlertsSection";
import BallieAssistant from "../components/BallieAssistant";
import { useSafeHealthData, useSafeTheme } from "@/hooks/use-safe-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, HeartHandshake, LightbulbIcon } from "lucide-react";
import { motion } from "framer-motion";

// AI Recommendations component 
function AIRecommendations() {
  const { healthData } = useSafeHealthData();
  const { theme } = useSafeTheme();
  
  // AI recommendation data
  const recommendations = [
    {
      title: "Glucose Management",
      description: "Based on your recent readings, consider having a small protein-rich snack before bedtime to stabilize overnight glucose levels.",
      icon: <Sparkles className="h-5 w-5 text-blue-500" />
    },
    {
      title: "Activity Suggestion",
      description: `Your heart rate patterns indicate ${healthData.heartRate > 70 ? 'potential stress. Try 5 minutes of deep breathing.' : 'good recovery. A light walk would be beneficial today.'}`,
      icon: <HeartHandshake className="h-5 w-5 text-green-500" />
    },
    {
      title: "Health Insight",
      description: `${healthData.currentGlucose > 120 ? 'Your glucose has been running slightly high. Consider reducing carbohydrate intake at your next meal.' : 'Your glucose management is on track. Keep up your current routine.'}`,
      icon: <LightbulbIcon className="h-5 w-5 text-amber-500" />
    }
  ];

  return (
    <Card className={`shadow-sm ${theme === 'light' ? 'bg-gradient-to-br from-white to-slate-50 border-slate-200/70' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className={`mr-2 h-5 w-5 ${theme === 'light' ? 'text-primary' : 'text-primary/80'}`} />
            <CardTitle className={theme === 'light' ? 'text-slate-800' : ''}>AI Recommendations</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`flex items-start rounded-lg p-3 ${
                theme === 'light' ? 'bg-slate-50 hover:bg-slate-100' : 'bg-muted/40 hover:bg-muted/60'
              } transition-colors`}
            >
              <div className="mr-3 mt-0.5">{item.icon}</div>
              <div>
                <h4 className={`text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-800' : ''}`}>
                  {item.title}
                </h4>
                <p className={`text-xs leading-tight ${theme === 'light' ? 'text-slate-600' : 'text-muted-foreground'}`}>
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { refreshData } = useSafeHealthData();
  const { theme } = useSafeTheme();
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    // Initial data fetch
    try {
      refreshData();
      setLastRefresh(new Date());
    } catch (e) {
      console.warn('Could not refresh health data');
    }
    
    // Set up interval for periodic updates - every 15 seconds
    const intervalId = setInterval(() => {
      try {
        refreshData();
        setLastRefresh(new Date());
      } catch (e) {
        console.warn('Could not refresh health data');
      }
    }, 15000); // Refresh every 15 seconds
    
    return () => clearInterval(intervalId);
  }, [refreshData]);

  return (
    <div className="min-h-screen bg-background pb-16 relative">
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
            <AIRecommendations />
          </div>
        </div>
        
        {/* Signature */}
        <motion.div 
          className={`text-sm text-right mt-8 ${
            theme === 'light' ? 'text-slate-400' : 'text-muted-foreground'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="flex items-center justify-end">
            Designed with <span className="text-red-500 mx-1">❤️</span> by SyncSquad
            <span className="text-xs ml-2 opacity-70">
              {`Last updated: ${lastRefresh.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}`}
            </span>
          </p>
        </motion.div>
      </main>
      
      <BallieAssistant />
    </div>
  );
}
