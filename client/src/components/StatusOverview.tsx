import { Card } from "@/components/ui/card";
import { useHealthData } from "../context/HealthDataContext";
import { Droplet, Heart, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

export default function StatusOverview() {
  const { healthData } = useHealthData();

  const renderStatusCard = (
    icon: React.ReactNode,
    title: string,
    value: number,
    unit: string,
    bgClass: string,
    fadeDelay: number
  ) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: fadeDelay, duration: 0.3 }}
    >
      <Card className="p-4 flex items-center transition-all hover:shadow-md">
        <div className={`w-12 h-12 rounded-full ${bgClass} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="flex items-end">
            <span className="text-2xl font-bold">{value}</span>
            <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {renderStatusCard(
        <Droplet className="h-6 w-6 text-primary" />,
        "Current Glucose",
        healthData.currentGlucose,
        "mg/dL",
        "bg-primary/10",
        0.1
      )}
      
      {renderStatusCard(
        <Heart className="h-6 w-6 text-green-500" />,
        "Heart Rate",
        healthData.heartRate,
        "BPM",
        "bg-green-100 dark:bg-green-900/30",
        0.2
      )}
      
      {renderStatusCard(
        <Stethoscope className="h-6 w-6 text-blue-500" />,
        "Oxygen Saturation",
        healthData.spO2,
        "%",
        "bg-blue-100 dark:bg-blue-900/30",
        0.3
      )}
    </div>
  );
}
