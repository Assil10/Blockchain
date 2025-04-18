// db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "korpor_dev",
  waitForConnections: true, 
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = {
  query: (sql, params) => pool.execute(sql, params),
};
