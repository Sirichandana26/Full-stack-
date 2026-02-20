const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "reddys0677",
  database: "public_maintenance"
});

db.connect(err => {
  if (err) {
    console.error(err);
  } else {
    console.log("MySQL Connected Successfully");
  }
});

module.exports = db;