const { Router } = require('express');
const requestController = require('../controllers/request.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = Router();

router.post('/', requestController.create);

router.get('/', protect, requestController.find);

router.get('/:id', protect, requestController.findOne);

router.post('/verify', requestController.verify);

module.exports = router;
