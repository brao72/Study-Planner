import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

/* GET /api/analytics/weeks  –  last 8 calendar weeks */
router.get('/weeks', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(`
      WITH weeks AS (
        SELECT generate_series(
          date_trunc('week', CURRENT_DATE) - INTERVAL '7 weeks',
          date_trunc('week', CURRENT_DATE),
          INTERVAL '1 week'
        )::date AS week_start
      )
      SELECT
        w.week_start,
        COALESCE(COUNT(t.id), 0) AS completed
      FROM weeks w
      LEFT JOIN tasks t
        ON date_trunc('week', t.due_date)::date = w.week_start
       AND t.status = 'done'
      GROUP BY w.week_start
      ORDER BY w.week_start;
    `);
    res.json(rows);               // exactly 8 objects, ascending order
  } catch (e) { next(e); }
});

export default router;
