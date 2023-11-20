const { Router } = require('express');
const moveRouter = require('./move.router');
const authRouter = require('./auth.router');

const router = Router();

router.use('/moves', moveRouter);
router.use('/auth', authRouter);

module.exports = router;
