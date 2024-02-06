const mysql = require('mysql2');
require('dotenv').config();

// Create connection
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});
function connectToDB(){
    db.connect((err) => {
        if (err) {
            throw err;
        }
        console.log('MySQL connected');
    });
}

module.exports = {db, connectToDB};