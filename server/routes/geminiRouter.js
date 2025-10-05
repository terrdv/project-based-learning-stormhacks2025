import express from 'express';
import { Router}  from 'express';
const router = Router();
import { getAppSteps, getFeedback, getProjectSuggestions, getHint, getBoilerplate} from '../controllers/geminiController.js';

router.post('/projects', getProjectSuggestions)
router.post('/create', getAppSteps)
router.post('/hint', getHint)
router.post('/feedback', getFeedback)




export default router;