const asyncHandler = require('express-async-handler');
const ULID = require('ulid');
const { generate } = require('randomstring');

const { pool } = require('../helpers/db');
const planInterface = require('../interfaces/plan.interface');

exports.create = asyncHandler(async (req, res) => {
  const { name, description, sessions, startedAt } = req.body;
  const plan = (
    await pool.query(
      'INSERT INTO plans(id, name, url, sessions, description, started_at) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id,url',
      [
        ULID.ulid(),
        name,
        generate({ capitalization: 'lowercase', length: 8 }),
        JSON.stringify(sessions),
        description,
        startedAt,
      ]
    )
  ).rows[0];
  res.status(201).send({ data: { plan: planInterface(plan) } });
});

exports.find = asyncHandler(async (req, res) => {
  const { lastId, name } = req.query;
  let query =
    'SELECT id,name,description,url,started_at,created_at,sessions FROM plans WHERE 1=1 ';
  let params = [];
  if (lastId) {
    params.push(lastId);
    query = query.concat(`AND id > $${params.length} `);
  }
  if (name) {
    params.push(`%${name}%`);
    query = query.concat(`AND name ILIKE $${params.length} `);
  }
  query = query.concat('ORDER BY id DESC LIMIT 10');
  let plans = (await pool.query(query, params)).rows;
  plans = plans.map((plan) => planInterface(plan));
  query = 'SELECT COUNT(*) AS count FROM plans WHERE 1=1 ';
  params = [];
  if (name) {
    params.push(`%${name}%`);
    query = query.concat(`AND name ILIKE $${params.length} `);
  }
  const count = parseInt((await pool.query(query, params)).rows[0].count);
  res.send({ data: { plans, count } });
});

exports.findByUrl = asyncHandler(async (req, res) => {
  const plan = (
    await pool.query(
      'SELECT id,name,description,url,started_at,created_at,sessions FROM plans WHERE url=$1',
      [req.params.url]
    )
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
