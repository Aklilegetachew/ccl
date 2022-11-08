const mysql = require("mysql2");

const config =  require('../config');


const pool = mysql.createPool({
  host: "localhost",
  user: config.DBUSER,
  database: config.DBNAME,
  password: config.DBPASSWORD,
});

module.exports = pool.promise();
