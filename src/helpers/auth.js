const { sign, verify } = require('jsonwebtoken');
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

exports.verify = (token) => {
  return new Promise((resolve, reject) => {
    verify(token, config.jwtKey, (error, payload) => {
      if (error) {
        return reject(error);
      }
      resolve(payload);
    });
  });
};
