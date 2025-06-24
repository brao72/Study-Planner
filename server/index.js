import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import tasksRouter from './routes/tasks.js';
import analyticsRouter from './routes/analytics.js';

dotenv.config();                       // load .env

/* ─── App setup ─── */
const app = express();
app.use(express.json());

/* Resolve __dirname in ES-modules */
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/* Static files and API */
app.use(express.static(path.join(__dirname, '..', 'client')));
app.use('/api/tasks', tasksRouter);
+app.use('/api/analytics', analyticsRouter);

/* Error handler */
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

/* Start server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server 🟢  http://localhost:${PORT}`));
