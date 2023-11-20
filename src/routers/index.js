const { Router } = require('express');
const moveRouter = require('./move.router');
const authRouter = require('./auth.router');
const { protect } = require('../middlewares/auth.middleware');

const router = Router();

router.use('/moves', protect, moveRouter);
router.use('/auth', authRouter);

module.exports = router;
