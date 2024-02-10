const express = require("express");
const router = express.Router();
const { db } = require("../db");
const fetchuser = require("../middleware/fetchuser");

router.get('/gettasks', fetchuser, async (req, res) => {
    try {
        console.log(req.user)
        const id = req.user.id;
        let tasks;
        db.query(`SELECT tasks.title AS 'Task Title',
        tasks.priority AS 'Priority',
        project.name AS 'Project Name',
        user.name AS 'Assigned To (User Name)',
        tId
 FROM tasks
 JOIN project ON tasks.pId = project.pId
 JOIN user ON tasks.uId = user.uId
 WHERE project.adminId = '${id}'`, (err, result) => {
            if (err) {
                throw err;
            }
            tasks = result;
            return res.status(200).json({ success: true, tasks });
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.get('/getprojects', fetchuser, async(req, res) => {
    try {
        console.log(req.user)
        const id = req.user.id;
        let projects;
        db.query(`SELECT 
        project.pId AS 'Project ID',
        project.name AS 'Project Name',
        project.description AS 'Project Description',
        COUNT(tasks.tId) AS 'Number of Tasks Associated'
    FROM 
        project
    LEFT JOIN 
        tasks ON project.pId = tasks.pId
    WHERE 
        project.adminId = ${id}
    GROUP BY 
        project.pId;`, (err, result) => {
            if (err) {
                throw err;
            }
            projects = result;
            return res.status(200).json({ success: true, projects });
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
})

router.post('/createproject', fetchuser, async(req, res) => {
    try {
        console.log(req.user)
        const id = req.user.id;
        const {name, description} = req.body;
        let project;
        db.query(`INSERT INTO PROJECT (name, description, adminId) VALUES('${name}', '${description}', ${id});`, (err, result) => {
            if (err) {
                throw err;
            }
            project = result;
            return res.status(200).json({ success: true, project });
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
})

router.get('/getusers', fetchuser, async(req, res) => {
    try {
        console.log(req.user)
        const id = req.user.id;
        let users;
        db.query(`SELECT uId, name, (select count(*) from tasks t where t.uId = u.uId) as taskCount from user u order by taskCount`, (err, result) => {
            if (err) {
                throw err;
            }
            users = result;
            return res.status(200).json({ success: true, users });
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
})

router.post('/createtask', fetchuser, async(req, res) => {
    try {
        console.log(req.user)
        const id = req.user.id;
        const {title, priority, pId, uId} = req.body;
        let task;
        db.query(`INSERT INTO TASKS (title, priority, pId, uId) VALUES('${title}', '${priority}', ${pId}, ${uId});`, (err, result) => {
            if (err) {
                throw err;
            }
            task = result;
            return res.status(200).json({ success: true, task });
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
})


router.get('/getprojecttasks/:id', fetchuser, async(req, res) => {
    try {
        const id = req.params.id;
        let project;
        db.query(`SELECT *, (SELECT name from user where user.uId = tasks.uId) as assignedUser FROM tasks WHERE pId = ${id}`, (err, result) => {
            if (err) {
                throw err;
            }
            project = result;
            return res.status(200).json({ success: true, project });
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
})

router.delete('/removeProject/:id', fetchuser, async(req, res) => {
    try {
        const id = req.params.id;
        db.query(`DELETE FROM tasks where tasks.pId = ${id}`, (err, result) => {
            if(err) throw err;
            db.query(`DELETE FROM project WHERE pId = ${id}`, (er, resl) => {
                if(er) throw er;
                return res.status(200).json({success: true, message: 'Project Deleted successfully'});
            })
        })
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
})

module.exports = router;