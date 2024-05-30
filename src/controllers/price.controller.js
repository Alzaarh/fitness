const asyncHandler = require('express-async-handler');

const { pool } = require('../helpers/db');

exports.find = asyncHandler(async (req, res) => {
  const result = await pool.query('SELECT * FROM price');
  res.send({ data: { price: result.rows[0] } });
});

exports.update = asyncHandler(async (req, res) => {
  await pool.query('UPDATE price SET exercise = $1, meal = $2 WHERE id = 1', [
    req.body.exercise,
    req.body.meal,
  ]);
  res.send({ data: 'Success' });
});
