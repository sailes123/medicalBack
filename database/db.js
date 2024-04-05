const mysql = require("mysql2/promise");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "dev_user",
//   database: "my_dev_db",
//   password: "password",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// mysql -u dev_user -p my_dev_db

// const pool = mysql.createPool({
//   host: "sql6.freesqldatabase.com",
//   port: "3306",
//   user: "sql6693707",
//   database: "sql6693707",
//   password: "LPqvHXRuCc",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

const pool = mysql.createPool({
  host: 'localhost',
  port:'3306',
  user: 'root', 
  database: 'my_dev_db',
  password: '', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
