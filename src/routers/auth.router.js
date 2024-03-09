const { Router } = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcrypt');

const { validate } = require('../middlewares/validate.middleware');
const authController = require('../controllers/auth.controller');
const { pool } = require('../helpers/db');

const router = Router();

const validateSignin = async (val, { req }) => {
  const { rows } = await pool.query(
    'SELECT username,password FROM users WHERE username=$1',
    [req.body.username]
  );
  if (rows.length === 0 || !(await bcrypt.compare(val, rows[0].password))) {
    throw new Error('Invalid username or password');
  }
};

router.post(
  '/signin',
  [
    body('username').isString(),
    body('password').isString().custom(validateSignin),
    validate,
  ],
  authController.signin
);

router.post(
  '/check',
  [body('phone').matches(/09[0-9]{9}/), validate],
  authController.check
);

router.post(
  '/verify',
  [body('phone').matches(/09[0-9]{9}/), body('code').isString(), validate],
  authController.verify
);

module.exports = router;
