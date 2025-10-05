import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateAppGuide({ userInfo, projectDetails }, userId) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
    You are an educational AI tutor that is guiding a user through building a software project. 
    
    The user's details are as follows:

    ${JSON.stringify(userInfo)}
    
    The details of the software project are as follows:

    ${JSON.stringify(projectDetails)}

    Based on this, create instruciton
    A. A title and description for the project, including what technologies will be used.
    B. A list of files that will be needed for the project, filled with boilerplate code, comments, and placeholders where the user will need to add their own code. The boilerplate doesn't necessarily need to be completely barebones but should not implement core functionality for the user. Include only minimal code for the language the user wants to learn, just enough to illustrate structure. For other languages in the project, you may provide normal scaffolding. Use comments or placeholders to indicate where the user should write code.
    C. Create a detailed step-by-step guide for the user to follow. There should be 4-7 steps. Each step should include:
    1. A title for the step.
    2. A detailed description of what the step entails.
    3. Clear instructions on how to complete the step, which include any resources or tools that may be needed. Remember not to do the project for the user but rather to guide them, and link to resources where appropriate.
    `,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: "object",
        properties: {
            title: { type: "string" },
            description: { type: "string" },
            instructions: { type: "string" },
            files: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        filename: { type: "string" },
                        content: { type: "string" }
                    },
                    required: ["filename", "content"]
                }
            },
            steps: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        instructions: { type: "string" },
                    },
                    required: ["title", "description", "instructions"]
                }
            },
            
        },
        required: ["title", "description", "instructions", "files", "steps"] // ensures the object always has a steps array
      }
    }
  });
    let feedback = response.candidates[0].content.parts[0].text;
    feedback = JSON.parse(feedback);

    console.log(feedback)

    await supabase.from('projects').insert({
        ...feedback,
        boilerplate: feedback.files,
        user_id: userId
    });
  // otherwise check text
  if (feedback) {
    try {
      return JSON.parse(feedback);
    } catch (e) {
      console.error("Failed to parse response:", feedback);
    }
  }
  throw new Error("Could not extract steps from response");
}


export async function generateFeedback(code, task) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
    You are a precise and constructive code reviewer. Analyze the following code and return your response as a JSON object ONLY.

    Evaluate the code according to these criteria:
    1. **Correctness** – Does the code accomplish the given task accurately and without logical or runtime errors?
    2. **Readability** – Is the code clear, well-structured, and easy to follow?
    3. **Best Practices** – Does the code follow standard conventions and avoid common pitfalls?

    When generating feedback:
    - If the code is **correct**, provide clear and specific feedback highlighting what was done well and any small improvements.
    - If the code **fails correctness**, give high-level, indirect guidance that points the user in the right direction **without revealing the exact fix**. For example, suggest reviewing a certain part of the logic or approach, but do not give the exact solution.

    Finally, determine whether the code **passes** the task.
    Set "pass" to true **only if** the code is correct and fully achieves the intended functionality described in the task.

    Task: ${task}
    Code: ${code}
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          feedback: { type: "string" },
          pass: { type: "boolean" }
        },
        required: ["feedback", "pass"]
      },
    },
  });

  const feedback = response.candidates[0].content.parts[0].text;
  return JSON.parse(feedback);
}



export async function generateProjectSuggestions({ data, authToken }) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are an AI mentor that designs project-based learning paths for a user. Here are the users details:

Experience level: ${data.skillLevel}
Interests: ${data.interests}
Learning Goal: ${data.learningGoal}
Project Description: ${data.projectDescription}
Project Size: ${data.projectSize}

These projects must be able to be completed WITH SOFTWARE ONLY and using a BROWSER-BASED EDITOR.

Suggest 3 creative project ideas that would help this user improve their skills.
For each project, include:
- Title
- Icon (single emoji)
- Description
- What topics it teaches
- Estimated difficulty
- Estimated duration in hours

Return your recommendations in JSON array format ONLY.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            icon: { type: "string" },
            difficulty: { type: "string", enum: ["Beginner", "Intermediate", "Advanced"] },
            title: { type: "string" },
            description: { type: "string" },
            topics: {
              type: "array",
              items: { type: "string" },
            },
            duration: { type: "number" },
          },
          required: ["title", "icon", "description", "topics", "difficulty", "duration"],
        },
      },
    },
  });

      let feedback = response.candidates[0].content.parts[0].text;

  // The SDK will return structured JSON, so we can return it directly
  return JSON.parse(feedback);
}

export async function generateHint(code, task) {
  const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: `You are a helpful code reviewer. Provide a hint for the following code segment based on the current task in JSON format ONLY:

  Task: ${task}
  Code: ${code}

  Return your feedback like this:
  {
    "hint": "Your hint here..."
  }`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: "object",
          properties: {
            hint: { type: "string" } // feedback is a string
          },
          required: ["hint"] // ensures feedback always exists
        },
      },
    });

    let hint = response.candidates[0].content.parts[0].text;

  // Directly return the structured feedback
  return JSON.parse(hint);
}



export async function generateBoilerPlate(learningGoal, skillLevel, projectDescription) {
  try {
    const prompt = `
You are an expert developer.
Generate a project scaffold based on the user's project description, learning goal, and skill level.
- Include only minimal code for the language the user wants to learn, just enough to illustrate structure.
- For other languages in the project, you may provide normal scaffolding.
- Use comments or placeholders to indicate where the user should write code.
- Return a structured JSON format with files.

User info:
- Learning Goal: ${learningGoal}
- Skill Level: ${skillLevel}
- Project Description: ${projectDescription}

Return your response in this JSON format:
{
  "files": [
    {
      "filename": "index.html",
      "content": "<!DOCTYPE html>...</content>"
    },
    {
      "filename": "about.html",
      "content": "<!DOCTYPE html>...</content>"
    },
    {
      "filename": "styles.css",
      "content": "body { ... }"
    },
    {
      "filename": "script.js",
      "content": "console.log('Hello World');"
    }
  ]
}
`;

    const rawResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            files: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  filename: { type: "string" },
                  content: { type: "string" }
                },
                required: ["filename", "content"]
              }
            }
          },
          required: ["files"]
        }
      }
    });

    /**
     * 
     */

    // Extract the JSON from the response
    const result = rawResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!result) throw new Error("No response from Gemini API");

    // Parse JSON safely
    const json = JSON.parse(result);
    return json;

  } catch (error) {
    console.error("Error generating boilerplate:", error);
    throw error;
  }
}


