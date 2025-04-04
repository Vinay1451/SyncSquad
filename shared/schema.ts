import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Health data schema
export const healthData = pgTable("health_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  glucoseValue: integer("glucose_value"),
  heartRate: integer("heart_rate"),
  spO2: integer("spo2"),
  steps: integer("steps"),
  activityMinutes: integer("activity_minutes"),
  deviceBattery: integer("device_battery"),
});

export const insertHealthDataSchema = createInsertSchema(healthData).omit({
  id: true,
  timestamp: true,
});

// Medication schema
export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  dosage: text("dosage").notNull(),
  instructions: text("instructions").notNull(),
  scheduledTime: text("scheduled_time").notNull(),
  taken: boolean("taken").default(false),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertMedicationSchema = createInsertSchema(medications).omit({
  id: true,
  timestamp: true,
});

// Meal schema
export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(),
  time: text("time").notNull(),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  nutritionDetails: jsonb("nutrition_details"),
});

export const insertMealSchema = createInsertSchema(meals).omit({
  id: true,
  timestamp: true,
});

// AI Chat schema
export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  message: text("message").notNull(),
  response: text("response").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertChatSchema = createInsertSchema(chats).omit({
  id: true,
  timestamp: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertHealthData = z.infer<typeof insertHealthDataSchema>;
export type HealthData = typeof healthData.$inferSelect;

export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type Medication = typeof medications.$inferSelect;

export type InsertMeal = z.infer<typeof insertMealSchema>;
export type Meal = typeof meals.$inferSelect;

export type InsertChat = z.infer<typeof insertChatSchema>;
export type Chat = typeof chats.$inferSelect;
