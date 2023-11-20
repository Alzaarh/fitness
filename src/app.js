const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const router = require('./routers');

const app = express();
app.enable('trust proxy');
const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send({ message: 'Server Error' });
});

module.exports = app;
