const { Router } = require('express');
const { body, param } = require('express-validator');
const categoryController = require('../controllers/category.controller');
const moveController = require('../controllers/move.controller');
const { validate } = require('../middlewares/validate.middleware');
const { pool } = require('../helpers/db');

const router = Router();

const categoryExist = async (value) => {
  const { rows } = await pool.query('SELECT id FROM categories WHERE id=$1', [value]);
  if (rows.length === 0) {
    throw new Error('Category does not exist');
  }
};

router.get('/', categoryController.find);

router.get(
  '/:id',
  [param('id').isUUID().custom(categoryExist), validate],
  categoryController.findOne
);

// router.post('/', [body('name').isString(), validate], categoryController.create);

router.post(
  '/:id/moves',
  [body('name').isString(), param('id').isUUID().custom(categoryExist), validate],
  moveController.create
);

module.exports = router;
