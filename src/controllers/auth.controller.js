const asyncHandler = require('express-async-handler');
const axios = require('axios');

const { pool } = require('../helpers/db');
const { sign } = require('../helpers/auth');

exports.signin = asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT id FROM users WHERE username=$1', [
    req.body.username,
  ]);
  const token = await sign({ id: rows[0].id });
  res.send({ data: { token } });
});

exports.check = asyncHandler(async (req, res) => {
  const code = Math.floor(Math.random() * 90_000) + 10_000;
  await pool.query(
    'INSERT INTO otps (phone,code,isverified,createdat) VALUES ($1,$2,$3,$4)',
    [req.body.phone, code, false, new Date()]
  );
  await axios.default.post(
    'https://api.sms.ir/v1/send/verify',
    {
      mobile: req.body.phone,
      templateId: 860291,
      parameters: [
        {
          name: 'code',
          value: code.toString(),
        },
      ],
    },
    { headers: { 'x-api-key': process.env.SMS_API_KEY } }
  );
  res.status(201).send({ data: 'Success' });
});

exports.verify = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM otps WHERE phone=$1 ORDER BY createdat DESC',
    [req.body.phone]
  );
  if (rows.length === 0 || rows[0].code !== req.body.code)
    return res.status(400).send({ message: 'کد تایید اشتباه است' });
  if (Date.now() - rows[0].createdat.getTime() > 1000 * 60 * 2)
    return res.status(400).send({ message: 'کد تایید منقضی شده است' });
  await pool.query('UPDATE otps SET isverified=$1 WHERE id=$2', [
    true,
    rows[0].id,
  ]);
  res.send({ message: 'Success' });
});
