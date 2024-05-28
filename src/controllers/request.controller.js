const asyncHandler = require('express-async-handler');

const { pool } = require('../helpers/db');

exports.create = asyncHandler(async (req, res) => {
  const query = `
        INSERT INTO requests (
            name, city, age, weight, height, goal, plan_no,
            exercisehistory, injury1, injury2, activity,
            sleep_schedule, exercise_schedule, img1, img2, img3,
            size, alergies, cook, budget, supplements,
            blood_type, description, type
        )
        VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
            $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24
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
  ]);
  res.status(201).send({ data: 'Success' });
});
