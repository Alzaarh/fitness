const { pool } = require('./db');

class Query {
  constructor() {
    this.query = '';
    this.params = [];
  }

  select(projection) {
    this.query = this.query.concat(`SELECT ${projection} `);
    return this;
  }

  where(field, value) {
    this.params.push(value);
    if (this.query.includes('WHERE')) {
      this.query = this.query.concat(
        `AND WHERE ${field}=$${this.params.length} `
      );
    } else {
      this.query = this.query.concat(`WHERE ${field}=$${this.params.length} `);
    }
    return this;
  }

  order(field, dir) {
    this.query = this.query.concat(`ORDER BY ${field} ${dir}`);
    return this;
  }

  limit(limit) {
    this.query = this.query.concat(`LIMIT ${limit}`);
    return this;
  }

  exec() {
    return pool.query(this.query, this.params);
  }
}

module.exports = Query;
