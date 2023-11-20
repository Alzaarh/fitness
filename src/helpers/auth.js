const { sign } = require('jsonwebtoken');
const { config } = require('./config');

exports.sign = (userData) => {
  return new Promise((resolve, reject) => {
    sign(userData, config.jwtKey, { expiresIn: '7d' }, (error, token) => {
      if (error) {
        return reject(error);
      }
      resolve(token);
    });
  });
};
