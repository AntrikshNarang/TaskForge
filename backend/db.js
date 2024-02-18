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
        // Now Create tables if not exists
        db.query(`CREATE TABLE IF NOT EXISTS admin (
            adminId INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
          )`, (err, result) => {
            if (err) throw err;
            console.log('admin table created');
        });

        db.query(`CREATE TABLE IF NOT EXISTS project (
            pId INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            adminId INT,
            FOREIGN KEY (adminId) REFERENCES admin(adminId)
          )`, (err, result) => {
            if (err) throw err;
            console.log('project table created');
        });

        db.query(`CREATE TABLE IF NOT EXISTS user (
            uId INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
          )`, (err, result) => {
            if (err) throw err;
            console.log('user table created');
        });

        db.query(`CREATE TABLE IF NOT EXISTS tasks (
            tId INT PRIMARY KEY AUTO_INCREMENT,
            priority INT,
            title VARCHAR(255) NOT NULL,
            pId INT,
            uId INT,
            FOREIGN KEY (pId) REFERENCES project(pId),
            FOREIGN KEY (uId) REFERENCES user(uId)
          )`, (err, result) => {
            if (err) throw err;
            console.log('tasks table created');
        });
    });
}

module.exports = {db, connectToDB};