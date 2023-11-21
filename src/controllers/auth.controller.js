const asyncHandler = require('express-async-handler');
const { escapeIdentifier } = require('pg');
const { pool } = require('../helpers/db');
const { sign } = require('../helpers/auth');

exports.signin = asyncHandler(async (req, res) => {
  const query = `SELECT id FROM ${escapeIdentifier('Users')} WHERE username=$1`;
  const { rows } = await pool.query(query, [req.body.username]);
  const token = await sign({ id: rows[0].id });
  res.send({ data: { token } });
});
