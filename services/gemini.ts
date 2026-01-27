
import { GoogleGenAI, Type } from "@google/genai";
import { AlumniProfile } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const findAlumniMatches = async (query: string, alumniList: AlumniProfile[]) => {
  const systemInstruction = `
    You are an expert Alumni Career Matcher. 
    Your goal is to help students or staff find relevant alumni based on natural language queries.
    
    Current Database of Alumni:
    ${JSON.stringify(alumniList)}
    
    Instructions:
    1. Analyze the user's request (e.g., "I need a mentor in Fintech").
    2. Identify the most relevant alumni based on their roles, industries, skills, and locations.
    3. Return a helpful conversational response explaining why these alumni are good matches.
    4. Provide the IDs of the suggested alumni in a structured JSON block so the UI can highlight them.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: query }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: {
              type: Type.STRING,
              description: "A natural language explanation of the matches.",
            },
            suggestedIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "The IDs of the alumni that best match the query.",
            },
          },
          required: ["answer", "suggestedIds"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      answer: "I'm sorry, I couldn't process that request right now. Please try again or refine your search.",
      suggestedIds: []
    };
  }
};
