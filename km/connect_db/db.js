// get the client
const mysql = require('mysql2');


// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    database: 'db_km',
    password:'password'
  });

  //return connection to the file make require to db
  module.exports = connection;