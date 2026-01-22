
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  // Chat Advisor
  async chat(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: "You are an expert autonomous scholarship agent. Your goal is to help students optimize their profiles and approve AI-generated application drafts."
      }
    });
    return response.text;
  },

  // Intelligent Match Scoring
  async getScoredMatches(profile: any) {
    const ai = getAI();
    const prompt = `Based on this student profile: ${JSON.stringify(profile)}, find 5 highly relevant real-world scholarships for 2025.
    Calculate a matchScore (0-100) based on eligibility overlap.
    Determine if canAutoApply is true (no complex essay required). 
    Return as a JSON array of objects.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              amount: { type: Type.STRING },
              deadline: { type: Type.STRING },
              matchScore: { type: Type.NUMBER },
              reason: { type: Type.STRING },
              canAutoApply: { type: Type.BOOLEAN },
              requirements: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["id", "name", "amount", "deadline", "matchScore", "reason", "canAutoApply", "requirements"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  },

  // Autonomous Essay Drafting
  async draftApplication(matchName: string, requirements: string[], profile: any) {
    const ai = getAI();
    const prompt = `Draft a personalized scholarship application response for "${matchName}". 
    Requirements: ${requirements.join(', ')}. 
    Using Student Context: ${JSON.stringify(profile)}.
    Focus on authenticity and alignment with the scholarship goals.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 8000 }
      }
    });
    return response.text;
  }
};
