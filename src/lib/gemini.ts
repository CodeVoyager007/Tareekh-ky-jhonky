import { GoogleGenAI } from "@google/genai";
import { Language, AnalysisResult, InscriptionResult, InstrumentResult } from "../types";

// Initialize Gemini directly in the frontend as per gemini-api skill instructions
// The platform provides process.env.GEMINI_API_KEY in the frontend for AI Studio apps
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const analyzeHeritageImage = async (base64: string, targetLang: string): Promise<AnalysisResult> => {
  // Try RAG Backend first using relative path (no secret URL needed)
  try {
    const response = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_base64: base64,
        language: targetLang || "English"
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      if (result.success) return result.data;
    }
    console.warn("RAG Backend not available or failed, falling back to direct Gemini");
  } catch (err) {
    console.warn("RAG Backend connection failed, falling back to direct Gemini", err);
  }

  // Fallback to direct Gemini
  let languageInstruction;
  if (targetLang === "Urdu") {
    languageInstruction = `The story should be in traditional Urdu script (Persian-Arabic script). Crucially, at the end of the "story" field, add a section marked exactly as [PHONETIC] followed by a Roman Urdu version of the same story. The Roman Urdu should be written phonetically to sound like a natural South Asian narrator.`;
  } else {
    languageInstruction = `The story should be in ${targetLang || "English"}. Ensure the tone is academic and factual, matching a knowledgeable documentary narrator.`;
  }

  const prompt = `Act as a senior archeologist. Analyze this image from a Pakistani/South Asian heritage site. 
  Identify its type, era, and origin. Tell a deep, documentary-style story about it.
  Provide the output strictly in JSON format with these exact keys:
  element_type, era, cultural_region, specific_name, confidence, confidence_reason, story, folk_legend, sources_hint.
  ${languageInstruction}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64.split(",")[1],
              mimeType: "image/jpeg"
            }
          }
        ]
      }],
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const responseText = response.text || "";
    const cleanJson = responseText.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error: any) {
    console.error("Gemini Frontend Error:", error);
    throw new Error(error.message || "Failed to analyze heritage image");
  }
};

export const translateStory = async (story: string, targetLang: Language): Promise<string> => {
  if (targetLang === "English") return story;

  // Try RAG Backend first
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        story,
        language: targetLang
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      if (result.success) return result.text;
    }
  } catch (err) {
    console.warn("RAG Translate connection failed, falling back to direct Gemini", err);
  }

  const prompts: Record<string, string> = {
    "Urdu": `Translate the following to daily conversational Urdu using traditional Urdu script (Persian-Arabic script). DO NOT use Roman Urdu in the main translation. 
    However, at the very end of your response, add a section marked exactly as [PHONETIC] followed by a Roman Urdu version of the same translation (using English characters) that a Hindi/English voice could read phonetically.
    ONLY return the translated text in traditional script followed by the [PHONETIC] block.
    Write all numbers and dates IN URDU WORDS. Text: ${story}`,
    "Chinese": `Translate the following to simple Mandarin Chinese. Write all numbers and dates in Chinese characters. ONLY return the translated text. Text: ${story}`,
    "German": `Translate the following to simple German. Write all numbers in German words. ONLY return the translated text. Text: ${story}`
  };

  const prompt = prompts[targetLang] || prompts["English"];
  
  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }]
    });
    return result.text?.trim() || story;
  } catch (error: any) {
    console.error("Gemini Translation Error:", error);
    throw new Error(error.message || "Translation failed");
  }
};

export const translateInscription = async (base64: string): Promise<InscriptionResult> => {
  const prompt = `Analyze the inscription in this image from a South Asian heritage site. 
  Identify script type, transliterate, translate to English, and provide context.
  Return exactly a JSON object: {script_type, original_text, transliteration, translation, context}`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { data: base64.split(",")[1], mimeType: "image/jpeg" } }
        ]
      }],
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const cleanJson = (result.text || "").replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error: any) {
    console.error("Gemini Inscription Error:", error);
    throw new Error(error.message || "Failed to analyze inscription");
  }
};

export const analyzeInstrument = async (base64: string): Promise<InstrumentResult> => {
  const prompt = `Identify this ancient Pakistani/South Asian instrument from the image.
  Provide a deep analysis. For sound_type, choose the best fit.
  For notes_suggested, provide 5-7 musical notes (like D4, F#4, G4, A4, C5) that would best represent its traditional scale or Raga.
  Return JSON: {
    instrument_name, 
    local_name, 
    era, 
    culture, 
    playing_technique, 
    sound_description, 
    modern_equivalent, 
    notes_suggested, 
    sound_type,
    historical_significance
  }`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { data: base64.split(",")[1], mimeType: "image/jpeg" } }
        ]
      }],
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const cleanJson = (result.text || "").replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error: any) {
    console.error("Gemini Instrument Error:", error);
    throw new Error(error.message || "Failed to analyze instrument");
  }
};
