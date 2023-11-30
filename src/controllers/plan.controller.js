const asyncHandler = require('express-async-handler');
const randomstring = require('randomstring');
const moment = require('jalali-moment');
const { pool } = require('../helpers/db');
const { config } = require('../helpers/config');

const plan = (row) => ({
  id: row.id,
  name: row.name,
  number: row.number,
  url: `${config.domain}${row.url}`,
  createdAt: moment.from(row.created_at).locale('fa').format('YYYY/MM/DD'),
  sessions: row.sessions,
});

exports.create = asyncHandler(async (req, res) => {
  const { name, number, sessions } = req.body;
  const url = randomstring.generate({ capitalization: 'lowercase', length: 8 });
  const { rows } = await pool.query(
    'INSERT INTO plans (name,number,url,sessions) VALUES ($1,$2,$3,$4) RETURNING id,url',
    [name, number, url, JSON.stringify(sessions)]
  );
  res.status(201).send({
    data: { plan: { id: rows[0].id, url: config.domain + rows[0].url } },
  });
});

exports.find = asyncHandler(async (req, res) => {
  const { last = 1, name } = req.query;
  if (name) {
    const { rows } = await pool.query(
      'SELECT id,name,number,url,created_at,sessions FROM plans WHERE index >= $1 AND name ILIKE $2 ORDER BY index DESC LIMIT 10',
      [last, `%${name}%`]
    );
    const plans = rows.map((row) => plan(row));
    return res.send({ data: { plans } });
  }
  const { rows } = await pool.query(
    'SELECT id,name,number,url,created_at,sessions FROM plans WHERE index >= $1 ORDER BY index DESC LIMIT 10',
    [last]
  );
  const plans = rows.map((row) => plan(row));
  res.send({ data: { plans } });
});
