import express from 'express';
const router = express().Router();

router.get('/feedback', generateFeedback)



export default router;