import { 
  users, type User, type InsertUser, 
  healthData, type HealthData, type InsertHealthData,
  medications, type Medication, type InsertMedication,
  meals, type Meal, type InsertMeal,
  chats, type Chat, type InsertChat
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Health data operations
  getHealthData(userId: number): Promise<HealthData[]>;
  getLatestHealthData(userId: number): Promise<HealthData | undefined>;
  createHealthData(data: InsertHealthData): Promise<HealthData>;
  
  // Medication operations
  getMedications(userId: number): Promise<Medication[]>;
  createMedication(medication: InsertMedication): Promise<Medication>;
  updateMedicationStatus(id: number, taken: boolean): Promise<Medication | undefined>;
  
  // Meal operations
  getMeals(userId: number): Promise<Meal[]>;
  createMeal(meal: InsertMeal): Promise<Meal>;
  
  // Chat operations
  getChats(userId: number): Promise<Chat[]>;
  createChat(chat: InsertChat): Promise<Chat>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private healthDataRecords: Map<number, HealthData>;
  private medicationRecords: Map<number, Medication>;
  private mealRecords: Map<number, Meal>;
  private chatRecords: Map<number, Chat>;
  
  private currentUserId: number;
  private currentHealthDataId: number;
  private currentMedicationId: number;
  private currentMealId: number;
  private currentChatId: number;

  constructor() {
    this.users = new Map();
    this.healthDataRecords = new Map();
    this.medicationRecords = new Map();
    this.mealRecords = new Map();
    this.chatRecords = new Map();
    
    this.currentUserId = 1;
    this.currentHealthDataId = 1;
    this.currentMedicationId = 1;
    this.currentMealId = 1;
    this.currentChatId = 1;
    
    // Initialize with a demo user
    this.createUser({
      username: "demouser",
      password: "password123"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id 
    };
    this.users.set(id, user);
    return user;
  }
  
  // Health data operations
  async getHealthData(userId: number): Promise<HealthData[]> {
    return Array.from(this.healthDataRecords.values()).filter(
      (data) => data.userId === userId
    );
  }
  
  async getLatestHealthData(userId: number): Promise<HealthData | undefined> {
    const userHealthData = await this.getHealthData(userId);
    if (userHealthData.length === 0) return undefined;
    
    return userHealthData.reduce((latest, current) => 
      new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
    );
  }
  
  async createHealthData(data: InsertHealthData): Promise<HealthData> {
    const id = this.currentHealthDataId++;
    const timestamp = new Date();
    const healthData: HealthData = {
      ...data,
      id,
      timestamp
    };
    this.healthDataRecords.set(id, healthData);
    return healthData;
  }
  
  // Medication operations
  async getMedications(userId: number): Promise<Medication[]> {
    return Array.from(this.medicationRecords.values()).filter(
      (medication) => medication.userId === userId
    );
  }
  
  async createMedication(medication: InsertMedication): Promise<Medication> {
    const id = this.currentMedicationId++;
    const timestamp = new Date();
    const newMedication: Medication = {
      ...medication,
      id,
      timestamp
    };
    this.medicationRecords.set(id, newMedication);
    return newMedication;
  }
  
  async updateMedicationStatus(id: number, taken: boolean): Promise<Medication | undefined> {
    const medication = this.medicationRecords.get(id);
    if (!medication) return undefined;
    
    const updatedMedication: Medication = {
      ...medication,
      taken
    };
    this.medicationRecords.set(id, updatedMedication);
    return updatedMedication;
  }
  
  // Meal operations
  async getMeals(userId: number): Promise<Meal[]> {
    return Array.from(this.mealRecords.values()).filter(
      (meal) => meal.userId === userId
    );
  }
  
  async createMeal(meal: InsertMeal): Promise<Meal> {
    const id = this.currentMealId++;
    const timestamp = new Date();
    const newMeal: Meal = {
      ...meal,
      id,
      timestamp
    };
    this.mealRecords.set(id, newMeal);
    return newMeal;
  }
  
  // Chat operations
  async getChats(userId: number): Promise<Chat[]> {
    return Array.from(this.chatRecords.values()).filter(
      (chat) => chat.userId === userId
    );
  }
  
  async createChat(chat: InsertChat): Promise<Chat> {
    const id = this.currentChatId++;
    const timestamp = new Date();
    const newChat: Chat = {
      ...chat,
      id,
      timestamp
    };
    this.chatRecords.set(id, newChat);
    return newChat;
  }
}

export const storage = new MemStorage();
