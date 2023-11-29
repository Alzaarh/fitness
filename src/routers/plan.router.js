const { Router } = require('express');
const { body, query } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');
const { protect } = require('../middlewares/auth.middleware');
const planController = require('../controllers/plan.controller');

const router = Router();

router.post(
  '/',
  protect,
  [
    body('name').isString(),
    body('number').optional().isInt(),
    body('sessions').isArray({ min: 1 }),
    body('sessions.*').isObject(),
    body('sessions.*.moves').isArray({ min: 1 }),
    body('sessions.*.moves.*.name').isString(),
    body('sessions.*.moves.*.quantity').isString(),
    validate,
  ],
  planController.create
);

router.get(
  '/',
  protect,
  [
    query('last').optional().isInt(),
    query('name').optional().isString(),
    validate,
  ],
  planController.find
);

module.exports = router;
