exports.config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  dbString: process.env.DB_STRING,
  jwtKey: process.env.JWT_KEY,
};
