const asyncHandler = require('express-async-handler');
const { pool } = require('../helpers/db');

exports.create = asyncHandler(async (req, res) => {
  const { rows } = await pool.query('INSERT INTO moves (name) VALUES ($1) RETURNING id,name', [
    req.body.name,
  ]);
  res.status(201).send({ data: { move: rows[0] } });
});

exports.find = asyncHandler(async (_req, res) => {
  const { rows } = await pool.query('SELECT id,name FROM moves');
  res.send({ data: { moves: rows } });
});

exports.update = asyncHandler(async (req, res) => {
  const { rows } = await pool.query('UPDATE moves SET name=$1 WHERE id=$2 RETURNING id,name', [
    req.body.name,
    req.params.id,
  ]);
  res.send({ data: { move: rows[0] } });
});

exports.delete = asyncHandler(async (req, res) => {
  const { rows } = await pool.query('DELETE FROM moves WHERE id=$1 RETURNING id,name', [
    req.params.id,
  ]);
  res.send({ data: { move: rows[0] } });
});
