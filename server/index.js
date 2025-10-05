import express from 'express';
import 'dotenv/config'
import cors from 'cors';
import geminiRouter from './routes/geminiRouter.js';

const app = express();
// Parse JSON bodies
app.use(express.json());

// Enable CORS for local development. Adjust origin in production.
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));

// sorry I just used AI to fix it

// Mount API routes
app.use('/api/gemini', geminiRouter);

// yeah it works now, thanks!
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}, http://localhost:${PORT}`)
});




