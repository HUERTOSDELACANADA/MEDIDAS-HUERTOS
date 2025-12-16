import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { House, FloorName } from "../types";
import { PROJECT_INFO } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction for the chat assistant
const getSystemInstruction = (house?: House) => `
You are an expert real estate sales assistant for "Residencial Huertos de la Cañada" in Almería, Spain.
Your goal is to help potential buyers understand the property layouts, measurements, and benefits.

Project Details:
${PROJECT_INFO.description}
Promoter: ${PROJECT_INFO.promoter}
Architects: ${PROJECT_INFO.architects}
Location: ${PROJECT_INFO.address}

${house ? `
CURRENT CONTEXT:
The user is currently viewing House ID: ${house.id} (${house.type}).
Parcel Area: ${house.parcelArea} m².
Total Constructed Area: ${house.totalConstructedArea} m².

Floors & Rooms:
${house.floors.map(f => `
  - ${f.name}:
    Useful Area: ${f.totalUsefulArea} m²
    Outdoor Area: ${f.outdoorArea || 0} m²
    Rooms: ${f.rooms.map(r => `${r.name} (${r.area} m²)`).join(", ")}
`).join("\n")}
` : "The user has not selected a specific house yet. Guide them to select one to see detailed measures."}

Tone: Professional, inviting, helpful, and precise with numbers. 
If asked about calculations (e.g., "Total bedroom space"), sum the numbers from the context provided accurately.
Always highlight the benefits of the "Solarium" and "Patios" as key selling points.
`;

export const sendMessageToGemini = async (
  message: string, 
  history: { role: "user" | "model", parts: { text: string }[] }[],
  currentHouse?: House,
  thinkingMode: boolean = false
): Promise<string> => {
  try {
    const modelId = thinkingMode ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
    
    // For thinking mode, we use the specific config
    const config = thinkingMode ? {
      thinkingConfig: { thinkingBudget: 16384 }, // Setting a reasonable budget
      systemInstruction: getSystemInstruction(currentHouse),
    } : {
      systemInstruction: getSystemInstruction(currentHouse),
    };

    // We need to reconstruct the chat history for the stateless API call or use chat session
    // Using chat session is better for context
    const chat = ai.chats.create({
      model: modelId,
      config: config,
      history: history,
    });

    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "I apologize, I couldn't generate a response.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the property database right now. Please try again.";
  }
};

export const analyzeImageWithGemini = async (
  base64Image: string,
  prompt: string,
  currentHouse?: House
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for better vision capabilities
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: getSystemInstruction(currentHouse) + "\n\nAnalyze the user's uploaded image in the context of the property. If it's a furniture item, estimate if it fits in the rooms. If it's a view, compare it to the renders.",
      }
    });

    return response.text || "Could not analyze the image.";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "Sorry, I couldn't analyze that image.";
  }
};
