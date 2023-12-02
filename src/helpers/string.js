const { generate } = require('randomstring');

exports.random = (length = 8) => {
  return generate({ capitalization: 'lowercase', length });
};
