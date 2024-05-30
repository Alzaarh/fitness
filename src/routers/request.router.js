const { Router } = require('express');
const requestController = require('../controllers/request.controller');

const router = Router();

router.post('/', requestController.create);

router.get('/', requestController.find);

module.exports = router;
