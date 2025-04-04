import { apiRequest } from "./queryClient";

export async function generateAIResponse(userQuery: string): Promise<string> {
  try {
    const response = await apiRequest("POST", "/api/gemini", { 
      query: userQuery 
    });
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to get AI response");
  }
}
