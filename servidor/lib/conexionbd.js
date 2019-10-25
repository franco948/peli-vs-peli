
var mysql      = require('mysql');

console.log(process.env.DB_HOST)

var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  port     : process.env.DB_PORT,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_DATABASE
});

module.exports = connection;

