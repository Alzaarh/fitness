const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');
const moveController = require('../controllers/move.controller');
const { pool } = require('../helpers/db');

const router = Router();

const categoryExist = async (value) => {
  const { rows } = await pool.query('SELECT id FROM categories WHERE id=$1', [value]);
  if (rows.length === 0) {
    throw new Error('Category does not exist');
  }
};

// router.post(
//   '/',
//   [body('name').isString(), body('categoryId').isUUID().custom(categoryExist), validate],
//   moveController.create
// );

// router.put('/:id', [body('name').isString(), validate], moveController.update);

// router.delete('/:id', moveController.delete);

module.exports = router;
