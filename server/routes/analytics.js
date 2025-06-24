import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

/* GET /api/analytics/weeks  –  past 8 weeks */
router.get('/weeks', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        date_trunc('week', due_date)::date AS week_start,
        COUNT(*)                      AS completed
      FROM   tasks
      WHERE  status = 'done'
      AND    due_date >= CURRENT_DATE - INTERVAL '8 weeks'
      GROUP  BY 1
      ORDER  BY 1
    `);
    res.json(rows);                 // [{week_start:"2025-05-05",completed:3}, …]
  } catch (e) { next(e); }
});

export default router;
