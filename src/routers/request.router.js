const { Router } = require('express');
const requestController = require('../controllers/request.controller');

const router = Router();

router.post('/', requestController.create);

module.exports = router;
