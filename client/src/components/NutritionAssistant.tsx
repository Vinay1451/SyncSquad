import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, LightbulbIcon, Apple, Drumstick, Coffee, Pizza } from "lucide-react";
import { useHealthData } from "../context/HealthDataContext";
import { motion } from "framer-motion";

export default function NutritionAssistant() {
  const { healthData } = useHealthData();

  // Function to render icon based on meal type
  const getMealIcon = (iconType: string) => {
    switch (iconType) {
      case "breakfast":
        return <Apple className="h-6 w-6" />;
      case "lunch":
        return <Drumstick className="h-6 w-6" />;
      case "dinner":
        return <Pizza className="h-6 w-6" />;
      case "snack":
        return <Coffee className="h-6 w-6" />;
      default:
        return <Utensils className="h-6 w-6" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <Card className="shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle>Diet & Nutrition</CardTitle>
            <Button size="sm" className="rounded-full">
              <Utensils className="h-4 w-4 mr-1" /> Log Meal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="font-medium mb-2">Today's Nutrition</h3>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: "Calories", value: healthData.nutrition.calories, unit: "" },
                { label: "Carbs", value: healthData.nutrition.carbs, unit: "g" },
                { label: "Protein", value: healthData.nutrition.protein, unit: "g" },
              ].map((item, index) => (
                <div key={index} className="bg-muted/40 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold">
                    {item.value}{item.unit}
                  </div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Recent Meals</h3>
            <div className="space-y-3">
              {healthData.meals.map((meal, index) => (
                <div key={index} className="flex items-center bg-muted/40 rounded-lg p-3">
                  <div className={`w-12 h-12 rounded-lg ${meal.iconBg} flex items-center justify-center ${meal.iconColor}`}>
                    {getMealIcon(meal.iconType)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{meal.type}</h4>
                      <span className="text-xs text-muted-foreground">{meal.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{meal.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-3 border-t border-border">
            <h3 className="font-medium mb-2">AI Recommendations</h3>
            <div className="bg-primary/5 dark:bg-primary/10 text-primary-foreground dark:text-primary-foreground p-3 rounded-lg text-sm">
              <p className="flex">
                <LightbulbIcon className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                <span>{healthData.nutritionRecommendation}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
