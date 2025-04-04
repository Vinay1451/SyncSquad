import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellIcon, CheckCircleIcon, InfoIcon, AlertTriangleIcon } from "lucide-react";
import { useHealthData } from "../context/HealthDataContext";
import { motion } from "framer-motion";

export default function AlertsSection() {
  const { healthData } = useHealthData();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="flex-shrink-0 text-green-500 mr-2" />;
      case "info":
        return <InfoIcon className="flex-shrink-0 text-blue-500 mr-2" />;
      case "warning":
        return <AlertTriangleIcon className="flex-shrink-0 text-yellow-500 mr-2" />;
      default:
        return <InfoIcon className="flex-shrink-0 text-blue-500 mr-2" />;
    }
  };

  const getAlertBgClass = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500";
      case "info":
        return "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500";
      default:
        return "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500";
    }
  };

  const getAlertTitleClass = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-700 dark:text-green-300";
      case "info":
        return "text-blue-700 dark:text-blue-300";
      case "warning":
        return "text-yellow-700 dark:text-yellow-300";
      default:
        return "text-blue-700 dark:text-blue-300";
    }
  };

  const getAlertTextClass = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600 dark:text-green-400";
      case "info":
        return "text-blue-600 dark:text-blue-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-blue-600 dark:text-blue-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <Card className="shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle>Alerts & Insights</CardTitle>
            <Button variant="ghost" size="sm" className="rounded-full">
              <BellIcon className="h-4 w-4 mr-1" /> Manage
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {healthData.alerts.map((alert, index) => (
              <motion.div
                key={index}
                className={`${getAlertBgClass(alert.type)} p-3 rounded-r-lg`}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index + 0.5, duration: 0.4 }}
              >
                <div className="flex">
                  {getAlertIcon(alert.type)}
                  <div>
                    <h3 className={`font-medium ${getAlertTitleClass(alert.type)}`}>
                      {alert.title}
                    </h3>
                    <p className={`text-sm ${getAlertTextClass(alert.type)}`}>
                      {alert.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
