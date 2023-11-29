const asyncHandler = require('express-async-handler');
const { pool } = require('../helpers/db');

exports.create = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'INSERT INTO moves (name,category_id) VALUES ($1,$2) RETURNING id,name,category_id',
    [req.body.name, req.params.id]
  );
  const move = rows.map((row) => ({ id: row.id, name: row.name, categoryId: row.category_id }));
  res.status(201).send({ data: { move: move[0] } });
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

exports.find = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'SELECT m.id,m.name,m.category_id,c.name AS category_name FROM moves As m INNER JOIN categories AS c ON c.id=m.category_id'
  );
  const moves = [];
  rows.forEach((row) =>
    moves.push({
      id: row.id,
      name: row.name,
      category: { id: row.category_id, name: row.category_name },
    })
  );
  res.send({ data: { moves } });
});
