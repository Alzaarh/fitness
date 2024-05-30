const { Router } = require('express');
const { body } = require('express-validator');

const priceController = require('../controllers/price.controller');
const { validate } = require('../middlewares/validate.middleware');
const { protect } = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', priceController.find);

router.put(
  '/',
  protect,
  [
    body('exercise').isInt({ min: 1 }),
    body('meal').isInt({ min: 1 }),
    validate,
  ],
  priceController.update
);

module.exports = router;
