const { join } = require('node:path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { rateLimit } = require('express-rate-limit');
const router = require('./routers');

const app = express();
const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

app.set('trust proxy', 1);
app.use(limiter);
app.use(
  '/api/auth/check',
  rateLimit({
    windowMs: 60 * 1000,
    limit: 1,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  })
);
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, '..', 'public')));

app.use('/api', router);

app.get('/ip', (req, res) => res.send(req.ip));

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send({ message: 'Server Error' });
});

module.exports = app;
