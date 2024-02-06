const express = require("express");
const router = express.Router();
const { db } = require("../db");
const fetchuser = require("../middleware/fetchuser");

router.get("/gettasks", fetchuser, async (req, res) => {
  try {
    const name = req.user.name;
    // get tasks for user by name
    let tasks;
    db.query(
        `SELECT tasks.title AS 'Task Title',
        tasks.priority AS 'Priority',
        project.name AS 'Project Name',
        admin.name AS 'Assigned By (Admin Name)',
        tasks.tId AS tId
 FROM tasks
 JOIN project ON tasks.pId = project.pId
 JOIN admin ON project.adminId = admin.adminId
 JOIN user ON tasks.uId = user.uId
 WHERE user.name = '${name}';`,
        (err, result) => {
            if (err) {
                throw err;
            }
            tasks = result; 
            return res.status(200).json({ success: true, tasks }); 
        }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

router.delete('/taskcomplete/:id', fetchuser, async (req, res) => {
    try {
        const id = req.params.id;
        db.query(`DELETE FROM tasks WHERE tId = ${id}`, (err, result) => {
            if (err) {
                throw err;
            }
            return res.status(200).json({ success: true, message: 'Task Deleted' });
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;
