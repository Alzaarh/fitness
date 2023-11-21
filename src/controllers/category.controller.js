const asyncHandler = require('express-async-handler');
const { escapeIdentifier } = require('pg');
const { pool } = require('../helpers/db');

exports.find = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(`SELECT id,name FROM ${escapeIdentifier('Categories')}`);
  res.send({ data: { categories: rows } });
});

exports.findOne = asyncHandler(async (req, res) => {
  const category = escapeIdentifier('Categories');
  const move = escapeIdentifier('Moves');
  const categoryId = escapeIdentifier('CategoryId');
  const { rows } = await pool.query(
    `SELECT ${category}.id,${category}.name,${move}.id,${move}.name FROM ${category} INNER JOIN ${move} ON ${category}.id = ${move}.${categoryId} WHERE ${category}.id = $1 ORDER BY ${move}.name`,
    [req.params.id]
  );
  if (rows.length === 0) {
    return res.status(404).send({ message: 'Category not found' });
  }
  res.send({ data: { category: rows } });
});
