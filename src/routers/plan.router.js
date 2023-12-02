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
    body('name').isString().isLength({ min: 1, max: 100 }),
    body('description').optional().isString().isLength({ min: 1, max: 1000 }),
    body('startedAt').isDate({ strictMode: true }),
    body('sessions').isArray({ min: 1, max: 30 }),
    body('sessions.*').isObject(),
    body('sessions.*.moves').isArray({ min: 1, max: 20 }),
    body('sessions.*.moves.*.name').isString().isLength({ min: 1, max: 100 }),
    body('sessions.*.moves.*.quantity')
      .isString()
      .isLength({ min: 1, max: 200 }),
    validate,
  ],
  planController.create
);

router.get(
  '/',
  protect,
  [
    query('lastId').optional().isString().notEmpty(),
    query('name').optional().isString().notEmpty(),
    validate,
  ],
  planController.find
);

router.delete('/:id', protect, planController.destroy);

router.get('/:url', planController.findByUrl);

// router.get('/:url/download', planController.download);

module.exports = router;
