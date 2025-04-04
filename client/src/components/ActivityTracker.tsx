import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon, TrendingUpIcon } from "lucide-react";
import { useHealthData } from "../context/HealthDataContext";
import { motion } from "framer-motion";

export default function ActivityTracker() {
  const { healthData } = useHealthData();
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      <Card className="shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle>Activity & Steps</CardTitle>
            <div className="text-sm px-3 py-1 rounded-full bg-green-500/10 text-green-500 flex items-center">
              <CheckIcon className="h-3 w-3 mr-1" /> On Track
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="hsl(var(--muted))" 
                  strokeWidth="10" 
                />
                <motion.circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="10" 
                  strokeDasharray="283" 
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ 
                    strokeDashoffset: 283 - (283 * healthData.activityProgress / 100) 
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                  transform="rotate(-90 50 50)" 
                />
                <text 
                  x="50" 
                  y="50" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  fontSize="18" 
                  fontWeight="bold" 
                  fill="currentColor"
                >
                  {healthData.activityProgress}%
                </text>
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-muted/40 rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Steps Today</div>
              <div className="text-xl font-bold">{healthData.steps.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Goal: 10,000</div>
            </div>
            <div className="bg-muted/40 rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Activity Minutes</div>
              <div className="text-xl font-bold">{healthData.activityMinutes} min</div>
              <div className="text-xs text-muted-foreground">Goal: 30 min</div>
            </div>
          </div>
          
          <h3 className="font-medium mb-2">Activity Impact</h3>
          <div className="bg-primary/5 dark:bg-primary/10 text-primary-foreground dark:text-primary-foreground p-3 rounded-lg text-sm mb-3 flex">
            <TrendingUpIcon className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
            <span>{healthData.activityImpact}</span>
          </div>
          
          <div className="pt-3 border-t border-border">
            <h3 className="font-medium mb-2">Weekly Activity</h3>
            <div className="flex justify-between h-24 items-end">
              {healthData.weeklyActivity.map((activity, index) => (
                <div key={index} className="flex flex-col items-center">
                  <motion.div 
                    className={`w-6 ${activity.completed ? "bg-primary" : "bg-muted"} rounded-t`}
                    initial={{ height: "0%" }}
                    animate={{ height: `${activity.percentage}%` }}
                    transition={{ duration: 0.7, delay: 0.1 * index }}
                  ></motion.div>
                  <div className="text-xs mt-1 text-muted-foreground">{daysOfWeek[index]}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
