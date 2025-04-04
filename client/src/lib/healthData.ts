export type GlucoseReading = {
  timestamp: string;
  value: number;
};

export type Medication = {
  name: string;
  dosage: string;
  instructions: string;
  scheduledTime: string;
  taken: boolean;
};

export type Meal = {
  type: string;
  time: string;
  description: string;
  iconType: "breakfast" | "lunch" | "dinner" | "snack";
  iconBg: string;
  iconColor: string;
};

export type Nutrition = {
  calories: number;
  carbs: number;
  protein: number;
};

export type Alert = {
  type: "success" | "info" | "warning";
  title: string;
  message: string;
};

export type HealthData = {
  currentGlucose: number;
  heartRate: number;
  spO2: number;
  steps: number;
  activityMinutes: number;
  activityProgress: number;
  deviceBattery: number;
  glucoseReadings: GlucoseReading[];
  medications: Medication[];
  medicationAdherence: ("completed" | "partial" | "none")[];
  meals: Meal[];
  nutrition: Nutrition;
  nutritionRecommendation: string;
  weeklyActivity: { completed: boolean; percentage: number }[];
  activityImpact: string;
  alerts: Alert[];
  lastReading: {
    time: string;
    timeAgo: string;
  };
};

// Default health data for simulation
export const defaultHealthData: HealthData = {
  currentGlucose: 118,
  heartRate: 72,
  spO2: 98,
  steps: 6521,
  activityMinutes: 32,
  activityProgress: 65,
  deviceBattery: 76,
  glucoseReadings: [
    { timestamp: "06:00", value: 110 },
    { timestamp: "08:00", value: 132 },
    { timestamp: "10:00", value: 95 },
    { timestamp: "12:00", value: 118 },
    { timestamp: "14:00", value: 108 },
    { timestamp: "16:00", value: 124 },
    { timestamp: "18:00", value: 115 }
  ],
  medications: [
    {
      name: "Insulin (NovoRapid)",
      dosage: "8 units",
      instructions: "Before lunch",
      scheduledTime: "12:30 PM",
      taken: true
    },
    {
      name: "Metformin",
      dosage: "500mg",
      instructions: "With dinner",
      scheduledTime: "7:00 PM",
      taken: false
    },
    {
      name: "Insulin (Lantus)",
      dosage: "12 units",
      instructions: "Before bed",
      scheduledTime: "10:00 PM",
      taken: false
    }
  ],
  medicationAdherence: ["completed", "completed", "completed", "partial", "partial", "none", "none"],
  meals: [
    {
      type: "Breakfast",
      time: "8:30 AM",
      description: "Oatmeal with berries, Greek yogurt",
      iconType: "breakfast",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-500"
    },
    {
      type: "Lunch",
      time: "12:45 PM",
      description: "Grilled chicken, quinoa, mixed veggies",
      iconType: "lunch",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
      iconColor: "text-yellow-500"
    }
  ],
  nutrition: {
    calories: 1850,
    carbs: 152,
    protein: 86
  },
  nutritionRecommendation: "Your glucose peaks after lunch. Consider adding more fiber and reducing simple carbs at this meal.",
  weeklyActivity: [
    { completed: true, percentage: 30 },
    { completed: true, percentage: 60 },
    { completed: true, percentage: 40 },
    { completed: true, percentage: 80 },
    { completed: true, percentage: 65 },
    { completed: false, percentage: 20 },
    { completed: false, percentage: 10 }
  ],
  activityImpact: "Your morning walk reduced blood sugar by ~15 mg/dL",
  alerts: [
    {
      type: "success",
      title: "Good control today",
      message: "Blood sugar levels within target range for 80% of the day."
    },
    {
      type: "info",
      title: "New pattern detected",
      message: "Higher readings 1-2 hours after breakfast. Consider adjusting morning insulin."
    },
    {
      type: "warning",
      title: "Weather alert",
      message: "High temperatures forecasted tomorrow. Stay hydrated to avoid glucose fluctuations."
    }
  ],
  lastReading: {
    time: "12:25 PM",
    timeAgo: "5 min ago"
  }
};
