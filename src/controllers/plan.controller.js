const asyncHandler = require('express-async-handler');
const ULID = require('ulid');
const { generate } = require('randomstring');

const { pool } = require('../helpers/db');
const planInterface = require('../interfaces/plan.interface');

exports.create = asyncHandler(async (req, res) => {
  const { name, description, sessions, startedAt, meals, requestId } = req.body;
  if (requestId) {
    const result = await pool.query(
      'SELECT id FROM plans WHERE request_id = $1',
      [requestId]
    );
    if (result.rowCount > 0)
      return res.status(400).send({ message: 'Invalid requestId' });
  }
  const plan = (
    await pool.query(
      'INSERT INTO plans(id, name, url, sessions, description, started_at, meals, request_id) VALUES ($1,$2,$3,$4,$5,$6,$7, $8) RETURNING id,url',
      [
        ULID.ulid(),
        name,
        generate({ capitalization: 'lowercase', length: 8 }),
        JSON.stringify(sessions),
        description,
        startedAt,
        JSON.stringify(meals),
        requestId,
      ]
    )
  ).rows[0];
  res.status(201).send({ data: { plan: planInterface(plan) } });
});

exports.find = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, name } = req.query;
  if (name) {
    const plans = await pool.query(
      'SELECT * FROM plans WHERE name ILIKE $1 ORDER BY created_at DESC OFFSET $2 LIMIT $3',
      [`%${name}%`, (+page - 1) * +limit, +limit]
    );
    const count = await pool.query('SELECT id FROM plans WHERE name ILIKE $1', [
      `%${name}%`,
    ]);
    return res.send({
      data: {
        plans: plans.rows.map((plan) => planInterface(plan)),
        count: count.rowCount,
      },
    });
  }
  const plans = await pool.query(
    'SELECT * FROM plans ORDER BY created_at DESC OFFSET $1 LIMIT $2',
    [(+page - 1) * +limit, +limit]
  );
  const count = await pool.query('SELECT id FROM plans');
  return res.send({
    data: {
      plans: plans.rows.map((plan) => planInterface(plan)),
      count: count.rowCount,
    },
  });
});

exports.findByUrl = asyncHandler(async (req, res) => {
  const plan = (
    await pool.query('SELECT * FROM plans WHERE url=$1', [req.params.url])
  ).rows[0];
  if (!plan) {
    return res.status(404).send({ message: 'Not Found' });
  }
  res.send({ data: { plan: planInterface(plan) } });
});

exports.destroy = asyncHandler(async (req, res) => {
  const plan = (
    await pool.query('DELETE FROM plans WHERE id=$1 RETURNING id', [
      req.params.id,
    ])
  ).rows[0];
  res.send({ data: { plan: planInterface(plan) } });
});
