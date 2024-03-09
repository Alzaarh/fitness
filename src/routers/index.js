const { Router } = require('express');

const moveRouter = require('./move.router');
const authRouter = require('./auth.router');
const categoryRouter = require('./category.router');
const planRouter = require('./plan.router');
const uploadRouter = require('./upload.router');
const { protect } = require('../middlewares/auth.middleware');

const router = Router();

// router.use('/moves', protect, moveRouter);
router.use('/auth', authRouter);
// router.use('/categories', protect, categoryRouter);
// router.use('/plans', planRouter);
router.use('/upload', uploadRouter);

module.exports = router;
