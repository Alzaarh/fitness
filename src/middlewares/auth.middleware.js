const { JsonWebTokenError, NotBeforeError, TokenExpiredError } = require('jsonwebtoken');
const { verify } = require('../helpers/auth');

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  try {
    const payload = await verify(token);
    req.userId = payload.id;
    next();
  } catch (error) {
    if (
      error instanceof JsonWebTokenError ||
      error instanceof NotBeforeError ||
      error instanceof TokenExpiredError
    ) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    next(error);
  }
};
