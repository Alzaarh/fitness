const { Pool } = require('pg');
const { config } = require('./config');

exports.pool = new Pool({ connectionString: config.dbString });
