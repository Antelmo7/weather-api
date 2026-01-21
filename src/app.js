import express from "express";
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import routes from './routes/index.js';

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Weather API by Antelmo Verdugo');
});

app.use('/api', routes)

export default app;