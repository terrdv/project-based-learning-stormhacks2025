import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateAppGuide(appName, experience) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert developer in HTML, CSS, JavaScript, React. I want to build a ${appName} app. 
  I am a ${experience}. Provide a **step-by-step guide** for building this app.
  
  Return your response in **JSON ONLY**, using this format:
  
  {
    "steps": [
      "Step 1 ...",
      "Step 2 ..."
    ]
  }`,
    });
  
    // Try to parse JSON safely
    try {
      const parsed = JSON.parse(response.text);
      return parsed.steps; // return as array
    } catch {
      // fallback: return raw text if parsing fails
      return response.text;
    }
}


export async function generateFeedback(code, task) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a helpful code reviewer. Provide feedback for the following code based on the current task.
      
  Task: ${task}
  Code:
  ${code}
  
  Return your feedback in JSON format ONLY, like this:
  {
    "feedback": "..."
  }`,
    });
  
    // Optionally parse JSON if you want structured output
    try {
      return JSON.parse(response.text).feedback;
    } catch {
      // fallback: return raw text
      return response.text;
    }
}


export async function generateProjectSuggestions({ userName, experienceLevel, interests }) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an AI mentor that designs project-based learning paths.

        The user profile is:
        Name: ${userName}
        Experience level: ${experienceLevel}
        Interests: ${interests}

        Suggest 3 creative project ideas that would help this user improve their skills.
        For each project, include:
        - Title
        - Description
        - What skills it teaches
        - Estimated difficulty (1–5)
        - Estimated duration in days

        Return your recommendations in JSON array format ONLY.`,
    });

    // Parse JSON if possible
    try {
        return JSON.parse(response.text);
    } catch (err) {
        console.warn("Failed to parse AI response as JSON:", err);
        return response.text; // fallback to raw text
    }
}

