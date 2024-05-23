const asyncHandler = require('express-async-handler');

const { pool } = require('../helpers/db');

exports.find = asyncHandler(async (_req, res) => {
  const meals = await pool.query('SELECT * FROM meals');
  res.send({ data: { meals: meals.rows } });
});

exports.create = asyncHandler(async (req, res) => {
  await pool.query('INSERT INTO meals (title) VALUES ($1)', [req.body.title]);
  res.status(201).send({ data: 'Success' });
});

exports.update = asyncHandler(async (req, res) => {
  const meals = await pool.query('SELECT id FROM meals WHERE id=$1', [
    req.params.id,
  ]);
  if (meals.rows.length === 0)
    return res.status(404).send({ message: 'شناسه غذا اشتباه است.' });
  await pool.query('UPDATE meals SET title = $1 WHERE id = $2', [
    req.body.title,
    req.params.id,
  ]);
  res.send({ data: 'Success' });
});

exports.destroy = asyncHandler(async (req, res) => {
  await pool.query('DELETE FROM meals WHERE id = $1', [req.params.id]);
  res.send({ data: 'Success' });
});
