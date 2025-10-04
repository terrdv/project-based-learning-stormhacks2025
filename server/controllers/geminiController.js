
import { generateAppGuide, generateProjectSuggestions, generateFeedback } from "../lib/gemini";

export const getAppSteps = async (req, res) => {
    const {answers, experience} = req.body
    const result = await generateAppGuide(answers, experience)
    res.json(result)
} 

export const getProjectSuggestions = async (req, res) => {
    const { userName, experienceLevel, interests } = req.body;

    try {
        const result = await generateProjectSuggestions({ userName, experienceLevel, interests });
        res.json(result);
    } catch (err) {
        console.error("Error generating project suggestions:", err);
        res.status(500).json({ error: "Failed to generate project suggestions" });
    }
};

export const getFeedback = async (req, res) => {
    const {code, task} = req.body
    const result = await generateFeedback(code, task)
    res.json(result)
} 


