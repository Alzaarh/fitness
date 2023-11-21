const { Router } = require('express');
const categoryController = require('../controllers/category.controller');

const router = Router();

router.get('/', categoryController.find);

router.get('/:id', categoryController.findOne);

module.exports = router;
