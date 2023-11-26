const { Router } = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');
const moveController = require('../controllers/move.controller');
const { pool } = require('../helpers/db');

const router = Router();

const moveExist = async (value) => {
  const { rows } = await pool.query('SELECT id FROM moves WHERE id=$1', [value]);
  if (rows.length === 0) {
    throw new Error('Move does not exist');
  }
};

router.get('/', moveController.find);

router.put(
  '/:id',
  [body('name').isString(), param('id').isUUID().custom(moveExist), validate],
  moveController.update
);

router.delete('/:id', [param('id').isUUID().custom(moveExist), validate], moveController.delete);

module.exports = router;
