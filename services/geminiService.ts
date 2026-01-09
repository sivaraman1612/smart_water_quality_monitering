
import { GoogleGenAI, Type } from "@google/genai";
import { WaterParameters, Language } from "../types";

// Initialize the GoogleGenAI client with the API key from environment variables.
// Always use process.env.API_KEY directly as a hard requirement.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getDiseasePrediction(params: WaterParameters, lang: Language) {
  // Guidelines state that API_KEY availability should be assumed.
  // We construct the prompt and use the recommended structured JSON output configuration.
  const prompt = `Analyze these water quality parameters: 
  pH: ${params.ph}, 
  Temp: ${params.temp}°C, 
  Turbidity: ${params.turbidity} NTU, 
  TDS: ${params.tds} ppm. 
  
  Predict potential water-borne disease risks and provide safety recommendations in ${lang === 'en' ? 'English' : lang === 'ta' ? 'Tamil' : 'Hindi'}. 
  Return a structured JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diseases: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            riskLevel: { type: Type.STRING }
          },
          required: ["diseases", "recommendations", "confidence", "riskLevel"]
        }
      }
    });

    // Extract text from response.text property (not a method).
    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Prediction Error:", error);
    // Returning a fallback state instead of null for better UI stability
    return {
      diseases: ["Analysis Unavailable"],
      recommendations: "Please check water quality manually and consult authorities.",
      confidence: 0,
      riskLevel: "UNKNOWN"
    };
  }
}
