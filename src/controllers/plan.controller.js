const asyncHandler = require('express-async-handler');
const randomstring = require('randomstring');
const moment = require('jalali-moment');
const pdfPrinter = require('pdfmake');
const { pool } = require('../helpers/db');

const plan = (row) => ({
  id: row.id,
  name: row.name,
  description: row.description,
  url: row.url,
  index: row.index,
  startedAt: row.started_at,
  sessions: row.sessions,
});

exports.create = asyncHandler(async (req, res) => {
  const { name, description, sessions, startedAt } = req.body;
  const url = randomstring.generate({ capitalization: 'lowercase', length: 8 });
  const { rows } = await pool.query(
    'INSERT INTO plans (name,description,url,sessions,started_at) VALUES ($1,$2,$3,$4,$5) RETURNING id,url',
    [name, description, url, JSON.stringify(sessions), startedAt]
  );
  res.status(201).send({
    data: { plan: { id: rows[0].id, url: rows[0].url } },
  });
});

exports.find = asyncHandler(async (req, res) => {
  const { last = 1, name } = req.query;
  if (name) {
    const { rows } = await pool.query(
      'SELECT id,name,description,url,sessions,index,started_at FROM plans WHERE index >= $1 AND name ILIKE $2 ORDER BY index DESC LIMIT 10',
      [last, `%${name}%`]
    );
    const plans = rows.map((row) => plan(row));
    return res.send({ data: { plans } });
  }
  const { rows } = await pool.query(
    'SELECT id,name,description,url,started_at,sessions,index FROM plans WHERE index >= $1 ORDER BY index DESC LIMIT 10',
    [last]
  );
  const plans = rows.map((row) => plan(row));
  res.send({ data: { plans } });
});

exports.findOne = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id,name,description,url,started_at,sessions FROM plans WHERE url=$1',
    [req.params.url]
  );
  if (rows.length === 0) {
    return res.status(404).send({ message: 'Not Found' });
  }
  const planData = plan(rows[0]);
  res.send({ data: { plan: planData } });
});

exports.download = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id,name,number,url,created_at,sessions FROM plans WHERE url=$1',
    [req.params.url]
  );
  if (rows.length === 0) {
    return res.status(404).send({ message: 'Not Found' });
  }
  const planData = plan(rows[0]);
  const printer = new pdfPrinter();
  const doc = printer.createPdfKitDocument({
    content: ['asd', 'نام'],
    defaultStyle: {
      font: 'Times',
    },
  });
  doc.pipe(res);
  doc.end();
});
