const { Router } = require('express');

const mealController = require('../controllers/meal.controller');

const router = Router();

router.get('/', mealController.find);

router.post('/', mealController.create);

router.put('/:id', mealController.update);

router.delete('/:id', mealController.destroy);

module.exports = router;
