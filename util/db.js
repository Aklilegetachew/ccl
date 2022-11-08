const mysql = require("mysql2");

const config =  require('../config');

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "versavvy_prod",
//   database: "versavvy_production",
//   password: "MKt&eo]Gv6rh",
// });

//const pool = mysql.createPool({
//  host: "localhost",
//  user: "root",
 // database: "production",
 // password: "",
//});

const pool = mysql.createPool({
	host: "localhost",
   user: config.DBUSER,
   database: config.DBNAME,
   password: config.DBPASSWORD,
 });

module.exports = pool.promise();
