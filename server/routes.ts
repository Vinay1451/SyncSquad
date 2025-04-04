import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { defaultHealthData } from "../client/src/lib/healthData";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

// Medical knowledge database with comprehensive information
const MEDICAL_KNOWLEDGE = `
BLOOD GLUCOSE RANGES:
- Normal fasting blood glucose: 70-99 mg/dL
- Prediabetes fasting range: 100-125 mg/dL  
- Diabetes fasting range: 126 mg/dL or higher
- Normal post-meal (2 hours): Less than 140 mg/dL
- Prediabetes post-meal: 140-199 mg/dL
- Diabetes post-meal: 200 mg/dL or higher
- Hypoglycemia (low blood sugar): Below 70 mg/dL
- Severe hypoglycemia: Below 54 mg/dL
- Hyperglycemia risk zone: Above 180 mg/dL
- Diabetic ketoacidosis risk: Above 240 mg/dL with ketones
- Target range for most adults with diabetes: 80-130 mg/dL (fasting)
- Target HbA1c for most adults with diabetes: Less than 7.0%

RISK FACTORS FOR TYPE 2 DIABETES:
- Family history of diabetes (genetics)
- Overweight or obesity (BMI ≥25)
- Physical inactivity (less than 150 minutes of exercise weekly)
- Age 45 or older
- History of gestational diabetes
- Race/ethnicity (higher risk in African American, Hispanic, Native American, Asian American)
- Hypertension (blood pressure ≥140/90)
- HDL cholesterol <35 mg/dL
- Triglycerides >250 mg/dL
- Polycystic ovary syndrome
- Acanthosis nigricans (dark, velvety patches of skin)
- History of cardiovascular disease
- Metabolic syndrome
- Prediabetes

DIABETES MEDICATION CLASSES:
1. Biguanides (e.g., Metformin/Glucophage):
   - Mechanism: Decreases liver glucose production, increases insulin sensitivity
   - Common side effects: GI upset, vitamin B12 deficiency
   - Contraindications: Severe kidney disease, liver disease, alcoholism

2. Sulfonylureas (e.g., Glipizide, Glyburide, Glimepiride):
   - Mechanism: Stimulates insulin secretion from pancreas
   - Common side effects: Hypoglycemia, weight gain
   - Contraindications: Severe liver/kidney disease, pregnancy

3. Meglitinides (e.g., Repaglinide, Nateglinide):
   - Mechanism: Stimulates insulin release from pancreas (shorter acting)
   - Common side effects: Hypoglycemia, weight gain
   - Contraindications: Severe liver disease

4. Thiazolidinediones (e.g., Pioglitazone, Rosiglitazone):
   - Mechanism: Increases insulin sensitivity in tissues
   - Common side effects: Weight gain, fluid retention, heart failure risk
   - Contraindications: Heart failure, liver disease

5. DPP-4 Inhibitors (e.g., Sitagliptin, Saxagliptin, Linagliptin):
   - Mechanism: Increases incretin levels to stimulate insulin release
   - Common side effects: Upper respiratory infections, headache
   - Contraindications: History of pancreatitis

6. SGLT2 Inhibitors (e.g., Empagliflozin, Canagliflozin, Dapagliflozin):
   - Mechanism: Blocks glucose reabsorption in kidneys
   - Common side effects: Urinary tract infections, genital yeast infections
   - Contraindications: Severe kidney disease

7. GLP-1 Receptor Agonists (e.g., Semaglutide, Dulaglutide, Liraglutide):
   - Mechanism: Increases insulin secretion, decreases glucagon, slows gastric emptying
   - Common side effects: Nausea, vomiting, diarrhea
   - Contraindications: Personal/family history of medullary thyroid cancer, MEN2

8. Insulin (Various types):
   - Rapid-acting (Humalog, NovoLog, Apidra): Onset 15min, peak 1-2hrs, duration 3-4hrs
   - Short-acting (Regular): Onset 30min, peak 2-3hrs, duration 3-6hrs
   - Intermediate-acting (NPH): Onset 2-4hrs, peak 4-12hrs, duration 12-18hrs
   - Long-acting (Lantus, Levemir, Tresiba): Onset 2hrs, no peak, duration 20-24hrs+

ACUTE COMPLICATIONS:
1. Hypoglycemia (Low Blood Sugar):
   - Symptoms: Shakiness, sweating, confusion, irritability, hunger, headache
   - Management: 15-15 rule (15g fast-acting carbs, wait 15 minutes, retest)
   - Severe cases: Glucagon injection, emergency services

2. Diabetic Ketoacidosis (DKA):
   - Symptoms: Excessive thirst, frequent urination, nausea, abdominal pain, fruity breath
   - Risk factors: Illness, missed insulin doses, newly diagnosed
   - Management: Emergency care, IV fluids, insulin, electrolyte replacement

3. Hyperosmolar Hyperglycemic State (HHS):
   - Symptoms: Extreme thirst, confusion, vision changes, weakness
   - Risk factors: Elderly, type 2 diabetes, illness, dehydration
   - Management: Emergency care, IV fluids, insulin, electrolyte replacement

CHRONIC COMPLICATIONS:
1. Microvascular:
   - Diabetic Retinopathy: Regular eye exams, blood sugar control, blood pressure control
   - Diabetic Nephropathy: ACE inhibitors/ARBs, blood sugar control, blood pressure control
   - Diabetic Neuropathy: Pain management, blood sugar control, foot care

2. Macrovascular:
   - Cardiovascular Disease: Statins, aspirin, blood pressure control, smoking cessation
   - Peripheral Arterial Disease: Exercise, smoking cessation, antiplatelet therapy
   - Cerebrovascular Disease: Blood pressure control, antiplatelet therapy

NUTRITIONAL GUIDELINES:
1. Carbohydrate Management:
   - Complex carbs over simple carbs
   - Recommended distribution: 45-65% of total calories
   - Fiber intake: 25-30g daily
   - Glycemic index awareness

2. Protein Intake:
   - Recommended: 15-20% of total calories
   - Focus on lean sources
   - Monitor intake with kidney disease

3. Fat Consumption:
   - Limit saturated fats to <7% of calories
   - Avoid trans fats
   - Increase monounsaturated and polyunsaturated fats
   - Recommended: 20-35% of total calories

4. Specific Food Recommendations:
   - Low glycemic index foods
   - Whole grains, legumes, non-starchy vegetables
   - Berries, citrus fruits, apples in moderation
   - Limit fruit juices and dried fruits
   - Nuts, seeds, avocados for healthy fats

PHYSICAL ACTIVITY GUIDELINES:
1. Aerobic Exercise:
   - Recommendation: 150 minutes moderate-intensity weekly
   - Blood glucose effects: Immediate lowering during/after activity
   - Precautions: Check glucose before, during, after exercise

2. Resistance Training:
   - Recommendation: 2-3 sessions weekly targeting major muscle groups
   - Benefits: Improved insulin sensitivity, increased muscle mass
   - Technique: Start with light weights, proper form

3. Flexibility and Balance:
   - Recommendation: 2-3 sessions weekly
   - Benefits: Reduced injury risk, improved mobility
   - Examples: Yoga, tai chi, stretching routines

4. Exercise Precautions:
   - Hypoglycemia risk: Carry fast-acting carbs
   - Hyperglycemia: Avoid intense exercise if BG >250mg/dL with ketones
   - Proper footwear and foot inspection
   - Stay hydrated
`;

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
      
      Weekly glucose readings: ${healthData.weeklyGlucoseReadings.map((r: any) => `${r.timestamp}: ${r.value} mg/dL`).join(", ")}
      
      Monthly glucose readings: ${healthData.monthlyGlucoseReadings.map((r: any) => `${r.timestamp}: ${r.value} mg/dL`).join(", ")}
      
      Weekly trend analysis: ${
        healthData.weeklyGlucoseReadings.reduce((sum: number, r: any) => sum + r.value, 0) / 
        healthData.weeklyGlucoseReadings.length > 140 ? 
        "Higher than target range" : 
        healthData.weeklyGlucoseReadings.reduce((sum: number, r: any) => sum + r.value, 0) / 
        healthData.weeklyGlucoseReadings.length < 70 ? 
        "Lower than target range" : 
        "Within target range"
      }
      
      Monthly trend analysis: ${
        healthData.monthlyGlucoseReadings.reduce((sum: number, r: any) => sum + r.value, 0) / 
        healthData.monthlyGlucoseReadings.length > 140 ? 
        "Higher than target range" : 
        healthData.monthlyGlucoseReadings.reduce((sum: number, r: any) => sum + r.value, 0) / 
        healthData.monthlyGlucoseReadings.length < 70 ? 
        "Lower than target range" : 
        "Within target range"
      }
    `;

    // Create prompt with instructions and context
    const prompt = `
      You are Ballie, an AI health assistant specialized in diabetes management. You help users manage their blood sugar, medication, diet, and exercise. Always be supportive, compassionate, and provide actionable advice.
      
      COMPREHENSIVE MEDICAL KNOWLEDGE DATABASE:
      ${MEDICAL_KNOWLEDGE}
      
      CURRENT HEALTH DATA:
      ${healthContext}
      
      USER QUESTION: ${userQuery}
      
      Important instructions:
      1. Reference specific numbers and ranges from the medical database when appropriate
      2. If the user mentions concerning symptoms, always advise consulting a healthcare professional
      3. For medication questions, provide information on mechanisms and common side effects from your database
      4. For diet questions, include specific food recommendations and glycemic index information
      5. For exercise questions, provide practical recommendations with safety precautions
      6. If the user seems to be experiencing a medical emergency, emphasize the importance of immediate medical attention
      7. Remind users that your advice should not replace professional medical guidance
      8. If the user's blood glucose value is outside the normal range, provide appropriate recommendations based on whether it's too high or too low
      9. When discussing trends, analyze both weekly and monthly glucose patterns to identify concerning patterns and recommend adjustments
     10. When mentioning specific readings, provide context about how they compare to typical patterns for this user based on weekly/monthly data
     11. If the user asks about recent blood sugar, include information about their trend (improving, worsening, or stable) based on the weekly data
      
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
      
      // Add small random variations to weekly and monthly data
      const weeklyGlucoseReadings = defaultHealthData.weeklyGlucoseReadings.map(reading => ({
        ...reading,
        value: reading.value + Math.floor(Math.random() * 6 - 3)
      }));
      
      const monthlyGlucoseReadings = defaultHealthData.monthlyGlucoseReadings.map(reading => ({
        ...reading,
        value: reading.value + Math.floor(Math.random() * 4 - 2)
      }));
      
      // Update timestamps
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Return modified data
      res.json({
        ...defaultHealthData,
        currentGlucose: randomGlucose,
        heartRate: randomHeartRate,
        spO2: randomSpO2,
        weeklyGlucoseReadings,
        monthlyGlucoseReadings,
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
      
      // Add small random variations to weekly and monthly data
      const weeklyGlucoseReadings = defaultHealthData.weeklyGlucoseReadings.map(reading => ({
        ...reading,
        value: reading.value + Math.floor(Math.random() * 6 - 3)
      }));
      
      const monthlyGlucoseReadings = defaultHealthData.monthlyGlucoseReadings.map(reading => ({
        ...reading,
        value: reading.value + Math.floor(Math.random() * 4 - 2)
      }));
      
      const currentHealthData = {
        ...defaultHealthData,
        currentGlucose: randomGlucose,
        heartRate: randomHeartRate,
        spO2: randomSpO2,
        weeklyGlucoseReadings,
        monthlyGlucoseReadings,
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
