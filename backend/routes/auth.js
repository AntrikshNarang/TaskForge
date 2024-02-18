const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { db } = require("../db");

// Create a user using: POST "/api/auth/createuser".
function checkIfUserExistsAlready(name) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM user WHERE name = ?", [name], (err, result) => {
      if (err) {
        reject(err);
      }
      if (result.length > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}
function checkIfAdminExistsAlready(name) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM admin WHERE name = ?", [name], (err, result) => {
      if (err) {
        reject(err);
      }
      if (result.length > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}
function hashPassword(password) {
  return new Promise(async (resolve, reject) => {
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);
    resolve(secPass);
  });
}
function addUserToDB(user) {
  return new Promise((resolve, reject) => {
    let sql = "INSERT INTO users SET ?";
    db.query(sql, user, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}
router.post(
  "/createuser",
  [
    body("name", "Enter a username").isLength({ min: 3, max: 30 }),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
    body("role", "Role must be either admin or user").isIn(["admin", "user"]),
  ],
  async (req, res) => {
    try {
      console.log(body);
      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors.array());
        return res
          .status(400)
          .json({ success: false, error: errors.array()[0].msg });
      }
      if (await checkIfAdminExistsAlready(req.body.name)) {
        return res
          .status(400)
          .json({ success: false, error: "Sorry a admin with this username already exists" });
      }
      if (await checkIfUserExistsAlready(req.body.name)) {
        return res
          .status(400)
          .json({ success: false, error: "Sorry a user with this username already exists" });
      }
      const secPass = await hashPassword(req.body.password);
      if (req.body.role == "admin") {
        admin = {
          name: req.body.name,
          password: secPass,
        };
        let sql = "INSERT INTO admin SET ?";
        db.query(sql, admin, (err, result) => {
          if (err) throw err;
          const authToken = jwt.sign({ user: { name: req.body.name, id: result.insertId }}, JWT_SECRET);
          res
            .status(200)
            .json({ success: true, message: "Admin has been created successfully", role: 'admin' , authToken});
        });
      } else {
        user = {
          name: req.body.name,
          password: secPass,
        };
        let sql = "INSERT INTO user SET ?";
        db.query(sql, user, (err, result) => {
          if (err) throw err;
          console.log(result);
          const authToken = jwt.sign({ user: { name: req.body.name, id: result.insertId }}, JWT_SECRET);
          res
            .status(200)
            .json({ success: true, message: "User has been created successfully", role: 'user' , authToken});
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, error:"Internal Server Error" });
    }
  }
);

// Authenticate a user using: POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("name", "Enter a valid username").isLength({ min: 3 }),
    body("password", "Password cannot be blank").exists(),
    body("role", "Role must be either admin or user").isIn(["admin", "user"])
  ],
  async (req, res) => {
    try {
      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors.array());
        return res
          .status(400)
          .json({ success: false, error: errors.array()[0].msg });
      }
      const { name, password, role } = req.body;
      console.log(req.body);
      if(role == 'user'){
          let sql = "SELECT * FROM user WHERE name = ?";
          db.query(sql, [name], async (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
              return res
                .status(400)
                .json({ success: false, error: "Invalid Credentials" });
            }
            const isMatch = await bcrypt.compare(password, result[0].password);
            if (!isMatch) {
              return res
                .status(400)
                .json({ success: false, error: "Invalid Credentials" });
            }
            const data = {
              user: {
                name: result[0].name,
                id: result[0].uId
              },
            };
            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({ success: true, authToken, role });
          });
      } else {
        let sql = "SELECT * FROM admin WHERE name = ?";
          db.query(sql, [name], async (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
              return res
                .status(400)
                .json({ success: false, error: "Invalid Credentials" });
            }
            const isMatch = await bcrypt.compare(password, result[0].password);
            if (!isMatch) {
              return res
                .status(400)
                .json({ success: false, error: "Invalid Credentials" });
            }
            const data = {
              user: {
                name: result[0].name,
                id: result[0].adminId
              },
            };
            const authToken = jwt.sign(data, JWT_SECRET);
            return res.status(200).json({ success: true, authToken, role });
          });
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

module.exports = router;
