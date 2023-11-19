const { Router } = require("express");
const moveRouter = require("./move.router");

const router = Router();

router.use("/moves", moveRouter);

module.exports = router;
