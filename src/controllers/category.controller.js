const asyncHandler = require('express-async-handler');
const { pool } = require('../helpers/db');
const { config } = require('../helpers/config');

exports.find = asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT id,name,image FROM categories');
  const categories = rows.map((row) => ({
    id: row.id,
    name: row.name,
    image: config.domain + row.image,
  }));
  res.send({ data: { categories } });
});

exports.findOne = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'SELECT c.id AS cid,c.name AS cname,c.image AS cimage,m.id AS mid,m.name AS mname FROM categories AS c INNER JOIN moves AS m ON c.id=m.category_id WHERE c.id=$1',
    [req.params.id]
  );
  const category = {
    id: rows[0].cid,
    name: rows[0].cname,
    image: config.domain + rows[0].cimage,
    moves: [],
  };
  rows.forEach((row) => category.moves.push({ id: row.mid, name: row.mname }));
  res.send({ data: { category } });
});

// exports.create = asyncHandler(async (req, res) => {
//   const { rows } = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING id', [
//     req.body.name,
//   ]);
//   res.status(201).send({ data: { category: { id: rows[0].id } } });
// });
