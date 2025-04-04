import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { defaultHealthData } from "../client/src/lib/healthData";

// Simulate Gemini API
async function simulateGeminiAPI(query: string): Promise<string> {
  const responses: Record<string, string> = {
    default: "I'm Ballie, your AI health assistant. I can provide personalized health insights based on your blood sugar data and activity levels.",
    
    high: "I noticed your blood sugar is higher than usual. Consider drinking water and going for a short walk. Make sure your next meal is balanced with protein and fiber.",
    
    low: "Your blood sugar seems to be running low. Consider having a small snack with about 15g of carbs, like a piece of fruit or a small glass of juice.",
    
    morning: "I noticed your breakfast had more carbs than usual (52g vs. your avg 35g). Also, you took your insulin just 5 mins before eating rather than the recommended 15-20 mins. Try giving insulin more time to work before eating tomorrow.",
    
    exercise: "Based on your data, moderate exercise helps lower your blood sugar by about 15 mg/dL. I recommend 20-30 minutes of walking after meals when possible.",
    
    medication: "I see you've been consistent with your medication this week. Great job! Maintaining this routine is crucial for stable blood sugar levels.",
    
    diet: "Your diet patterns show lower glucose spikes when you eat meals with protein and fat alongside carbs. Consider adding nuts, eggs, or avocado to your breakfast."
  };

  // Wait to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Check for keywords in the query
  if (query.toLowerCase().includes("high") || query.toLowerCase().includes("spike")) {
    return responses.high;
  } else if (query.toLowerCase().includes("low")) {
    return responses.low;
  } else if (query.toLowerCase().includes("breakfast") || query.toLowerCase().includes("morning")) {
    return responses.morning;
  } else if (query.toLowerCase().includes("exercise") || query.toLowerCase().includes("walk") || query.toLowerCase().includes("activity")) {
    return responses.exercise;
  } else if (query.toLowerCase().includes("medication") || query.toLowerCase().includes("insulin") || query.toLowerCase().includes("medicine")) {
    return responses.medication;
  } else if (query.toLowerCase().includes("diet") || query.toLowerCase().includes("food") || query.toLowerCase().includes("eat")) {
    return responses.diet;
  }

  return responses.default;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware for parsing JSON
  app.use(express.json());

  // API Routes
  app.get("/api/health-data", async (req, res) => {
    try {
      // For this demo, we'll use simulated data
      // In a real app, this would come from a database or actual device
      
      // Add some random variations to make the data feel "live"
      const randomGlucose = defaultHealthData.currentGlucose + Math.floor(Math.random() * 10 - 5);
      const randomHeartRate = defaultHealthData.heartRate + Math.floor(Math.random() * 6 - 3);
      const randomSpO2 = Math.min(100, defaultHealthData.spO2 + Math.floor(Math.random() * 4 - 2));
      
      // Update timestamps
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Return modified data
      res.json({
        ...defaultHealthData,
        currentGlucose: randomGlucose,
        heartRate: randomHeartRate,
        spO2: randomSpO2,
        lastReading: {
          time: timeStr,
          timeAgo: "Just now"
        }
      });
    } catch (error) {
      console.error("Error fetching health data:", error);
      res.status(500).json({ message: "Failed to fetch health data" });
    }
  });

  // API endpoint for Gemini AI assistant
  app.post("/api/gemini", async (req, res) => {
    try {
      const querySchema = z.object({
        query: z.string().min(1),
      });
      
      const validatedData = querySchema.parse(req.body);
      
      // Use simulated Gemini API for the demo
      const response = await simulateGeminiAPI(validatedData.query);
      
      res.json({ response });
    } catch (error) {
      console.error("Error processing AI request:", error);
      res.status(500).json({ message: "Failed to process AI request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
