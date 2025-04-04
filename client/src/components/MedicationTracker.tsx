import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, CheckIcon, Clock } from "lucide-react";
import { useHealthData } from "../context/HealthDataContext";
import { motion } from "framer-motion";

export default function MedicationTracker() {
  const { healthData } = useHealthData();
  
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    >
      <Card className="shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle>Insulin & Medication</CardTitle>
            <Button size="sm" className="rounded-full">
              <PlusIcon className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {healthData.medications.map((medication, index) => (
              <div key={index} className="bg-muted/40 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{medication.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {medication.dosage} - {medication.instructions}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {medication.taken ? (
                      <span className="text-sm bg-green-500/10 text-green-500 py-1 px-2 rounded flex items-center">
                        <CheckIcon className="h-3 w-3 mr-1" /> 
                        Taken {medication.scheduledTime}
                      </span>
                    ) : (
                      <span className="text-sm bg-primary/10 text-primary py-1 px-2 rounded flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> 
                        {medication.scheduledTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-border">
            <h3 className="font-medium mb-2">Weekly Summary</h3>
            <div className="flex justify-between">
              {daysOfWeek.map((day, index) => {
                const adherence = healthData.medicationAdherence[index];
                let bgColorClass = "bg-muted";
                let textColorClass = "text-muted-foreground";
                let icon = <span className="text-xs">-</span>;
                
                if (adherence === "completed") {
                  bgColorClass = "bg-green-500";
                  textColorClass = "text-white";
                  icon = <CheckIcon className="h-3 w-3" />;
                } else if (adherence === "partial") {
                  bgColorClass = "bg-primary";
                  textColorClass = "text-white";
                  icon = <CheckIcon className="h-3 w-3" />;
                }
                
                return (
                  <div key={day} className="text-center">
                    <div className="text-xs text-muted-foreground">{day}</div>
                    <div className={`w-6 h-6 rounded-full ${bgColorClass} mx-auto flex items-center justify-center ${textColorClass} text-xs`}>
                      {icon}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
