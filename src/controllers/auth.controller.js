const asyncHandler = require('express-async-handler');
const { pool } = require('../helpers/db');
const { sign } = require('../helpers/auth');

exports.signin = asyncHandler(async (req, res) => {
  const query = 'SELECT id FROM users WHERE username=$1';
  const { rows } = await pool.query(query, [req.body.username]);
  const token = await sign({ id: rows[0].id });
  res.send({ data: { token } });
});
