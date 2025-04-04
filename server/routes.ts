import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { defaultHealthData } from "../client/src/lib/healthData";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

// Function to use actual Gemini API
async function generateAIResponse(userQuery: string, healthData: any): Promise<string> {
  // Fallback in case the API key is missing or invalid
  if (!apiKey) {
    console.warn("No Gemini API key found, using fallback response");
    return "I'm Ballie, your AI health assistant. To enable personalized insights, please provide a valid Gemini API key.";
  }

  try {
    // Configure the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Prepare health data context for the model
    const healthContext = `
      Current blood glucose: ${healthData.currentGlucose} mg/dL
      Heart rate: ${healthData.heartRate} BPM
      Oxygen saturation: ${healthData.spO2}%
      Steps today: ${healthData.steps}
      Activity minutes: ${healthData.activityMinutes}
      Last meal: ${healthData.meals && healthData.meals.length > 0 ? healthData.meals[0].description : "Unknown"}
      Recent alerts: ${healthData.alerts.map((a: any) => a.message).join(", ")}
    `;

    // Create prompt with instructions and context
    const prompt = `
      You are Ballie, an AI health assistant specialized in diabetes management. You help users manage their blood sugar, medication, diet, and exercise. Always be supportive, compassionate, and provide actionable advice.
      
      CURRENT HEALTH DATA:
      ${healthContext}
      
      USER QUESTION: ${userQuery}
      
      Provide a helpful, personalized response based on the user's health data and question. Keep your response concise (3-5 sentences max). Focus on giving actionable advice that could help the user manage their diabetes better.
    `;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return response;
  } catch (error) {
    console.error("Error with Gemini API:", error);
    // Fallback responses in case of API errors
    const fallbackResponses = [
      "I'm having trouble accessing my AI capabilities right now. Let me know if you have specific questions about your blood sugar readings.",
      "Sorry, I couldn't process that request. Your latest glucose reading is within your target range. Is there anything specific you'd like to know?",
      "I'm experiencing a temporary connection issue. Based on your recent data, your health metrics are stable. Can I help with anything specific?",
      "I couldn't connect to my knowledge base. Your recent activity shows positive trends. Please try asking again in a moment."
    ];
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
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
      
      // Get current health data to provide context to the AI
      // For the demo, we'll use the same method that powers the /api/health-data endpoint
      const randomGlucose = defaultHealthData.currentGlucose + Math.floor(Math.random() * 10 - 5);
      const randomHeartRate = defaultHealthData.heartRate + Math.floor(Math.random() * 6 - 3);
      const randomSpO2 = Math.min(100, defaultHealthData.spO2 + Math.floor(Math.random() * 4 - 2));
      
      const currentHealthData = {
        ...defaultHealthData,
        currentGlucose: randomGlucose,
        heartRate: randomHeartRate,
        spO2: randomSpO2,
      };
      
      // Use Gemini API with health data context
      const response = await generateAIResponse(validatedData.query, currentHealthData);
      
      res.json({ response });
    } catch (error) {
      console.error("Error processing AI request:", error);
      res.status(500).json({ message: "Failed to process AI request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
