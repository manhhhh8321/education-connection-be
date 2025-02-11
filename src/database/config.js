const dotenv = require('dotenv');

dotenv.config();
const host = process.env.MYSQL_HOST || 'localhost';
const port = process.env.MYSQL_PORT || 3306;
const username = process.env.MYSQL_USERNAME || 'root';
const password = process.env.MYSQL_PASSWORD || 'root';
const database = process.env.MYSQL_DATABASE;
module.exports = {
  development: {
    dialect: 'mysql',
    host,
    port,
    username,
    password,
    database: database,
  },
  production: {
    dialect: 'mysql',
    host,
    port,
    username,
    password,
    database: database,
  },
};
