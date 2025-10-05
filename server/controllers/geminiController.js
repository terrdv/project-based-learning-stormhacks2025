import { generateAppGuide, generateProjectSuggestions, generateFeedback, generateHint, generateBoilerPlate} from "../lib/gemini.js";
import supabase from "../lib/supabase.js";

export const getAppSteps = async (req, res) => {
    const { data, authToken } = req.body;

    let user = await supabase.auth.getUser(authToken);
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    console.log(user);

    const result = await generateAppGuide(data, user.id);

    res.json(result);
}

export const getProjectSuggestions = async (req, res) => {
    const { skillLevel, learningGoal, projectDescription, interests, projectSize } = req.body.data;
  
    try {
      const result = await generateProjectSuggestions({
        data: { skillLevel, learningGoal, projectDescription, interests, projectSize }
      });
      res.json(result); // result is an array of structured projects
    } catch (err) {
      console.error("Error generating project suggestions:", err);
      res.status(500).json({ error: "Failed to generate project suggestions" });
    }
  };

export const getFeedback = async (req, res) => {
    const {code, task} = req.body.data
    const result = await generateFeedback(code, task)
    res.json(result)
} 

export const getHint = async (req, res) => {
  const {code, task} = req.body
  const result = await generateHint(code, task)
  res.json(result)
} 

export const getBoilerplate = async (req, res) => {
  const {learningGoal, skillLevel, projectDescription} = req.body
  const result = await generateBoilerPlate(learningGoal, skillLevel, projectDescription)
  res.json(result)
} 


