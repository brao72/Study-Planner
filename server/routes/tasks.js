import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

/* ───────── POST ─ add ───────── */
router.post('/', async (req, res, next) => {
  try {
    const { title, status = 'backlog' } = req.body;
    const due_date = req.body.due_date || req.body.date;
    if (!title || !due_date)
      return res.status(400).json({ error: 'title and due_date required' });

    const { rows } = await pool.query(
      `INSERT INTO tasks (title, due_date, status)
       VALUES ($1,$2,$3) RETURNING *`,
      [title, due_date, status]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

/* ───────── PUT ─ change status ───────── */
router.put('/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    const { rows } = await pool.query(
      `UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

/* ───────── DELETE ─ remove task ───────── */
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query(`DELETE FROM tasks WHERE id = $1`, [req.params.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

/* ───────── GET ─ list all ───────── */
router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM tasks ORDER BY created_at`
    );
    res.json(rows);
  } catch (err) { next(err); }
});

export default router;
