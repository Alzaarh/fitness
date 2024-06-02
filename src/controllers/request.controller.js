const asyncHandler = require('express-async-handler');
const ZarinpalCheckout = require('zarinpal-checkout');

const { pool } = require('../helpers/db');

exports.create = asyncHandler(async (req, res) => {
  const query = `
        INSERT INTO requests (
            name, city, age, weight, height, goal, plan_no,
            exercisehistory, injury1, injury2, activity,
            sleep_schedule, exercise_schedule, img1, img2, img3,
            size, alergies, cook, budget, supplements,
            blood_type, description, type, phone
        )
        VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
            $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
        )
    `;
  await pool.query(query, [
    req.body.name,
    req.body.city,
    req.body.age,
    req.body.weight,
    req.body.height,
    req.body.goal,
    req.body.planNo,
    req.body.excerciseHistory,
    req.body.injury1,
    req.body.injury2,
    req.body.activity,
    req.body.sleepSchedule,
    req.body.exerciseSchedule,
    req.body.img1,
    req.body.img2,
    req.body.img3,
    req.body.size,
    req.body.alergies,
    req.body.cook,
    req.body.budget,
    req.body.supplements,
    req.body.bloodType,
    req.body.description,
    req.body.type,
    req.body.phone,
  ]);
  const zarinpal = ZarinpalCheckout.create(
    'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    true
  );
  const priceResult = await pool.query('SELECT * FROM price');
  let amount = 0;
  if (req.body.type === 1) amount = priceResult.rows[0].exercise;
  else if (req.body.type === 2) amount = priceResult.rows[0].meal;
  else amount = priceResult.rows[0].exercise + priceResult.rows[0].meal;
  const zarinpalResponse = await zarinpal.PaymentRequest({
    Amount: amount.toString(),
    CallbackURL: process.env.ZARINPAL_REDIRECT_URL,
    Description: 'درخواست برنامه - اندام سازان',
    Email: 'hi@siamak.work',
    Mobile: '09120000000',
  });
  if (zarinpalResponse.status === 100) {
    await pool.query(
      'INSERT INTO transactions (authority, amount, is_verified) VALUES ($1, $2, $3)',
      [zarinpalResponse.authority, amount, false]
    );
    return res.status(201).send({ data: { url: zarinpalResponse.url } });
  }
  res.status(500).send({ message: 'Server Error' });
});

exports.find = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  if (req.query.name) {
    const result = await pool.query(
      'SELECT * FROM requests WHERE name ILIKE $3 OFFSET $1 LIMIT $2',
      [(+page - 1) * +limit, +limit, `%${req.query.name}%`]
    );
    const totalResult = await pool.query(
      'SELECT id FROM requests WHERE name ILIKE $1',
      [`%${req.query.name}%`]
    );
    res.send({
      data: { requests: result.rows, rowCount: totalResult.rowCount },
    });
  } else {
    const result = await pool.query(
      'SELECT * FROM requests OFFSET $1 LIMIT $2',
      [(+page - 1) * +limit, +limit]
    );
    const totalResult = await pool.query('SELECT id FROM requests');
    res.send({
      data: { requests: result.rows, rowCount: totalResult.rowCount },
    });
  }
});

exports.findOne = asyncHandler(async (req, res) => {
  const result = await pool.query('SELECT * FROM requests WHERE id = $1', [
    req.params.id,
  ]);
  if (result.rows.length === 0)
    return res.status(404).send({ message: 'Not Found' });
  res.send({ data: { request: result.rows[0] } });
});
