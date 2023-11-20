const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');
const moveController = require('../controllers/move.controller');

const router = Router();

router.get('/', moveController.find);
router.post('/', [body('name').isString(), validate], moveController.create);
router.put('/:id', [body('name').isString(), validate], moveController.update);
router.delete('/:id', moveController.delete);

module.exports = router;
