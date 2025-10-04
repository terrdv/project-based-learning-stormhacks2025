import express from 'express';
import 'dotenv/config'
import geminiRouter from './routes/geminiRouter';


app.use(express.json()); 

app.use('/api/gemini', geminiRouter);


