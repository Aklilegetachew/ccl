const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "versavvy_prod",
//   database: "versavvy_production",
//   password: "MKt&eo]Gv6rh",
// });

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "production",
  password: "",
});

module.exports = pool.promise();
