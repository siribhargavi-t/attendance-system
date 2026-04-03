const express = require("express");
const router = express.Router();

const { registerStudent, loginStudent, getAllStudents } = require("../controllers/studentController");

router.get("/", getAllStudents);
router.post("/register", registerStudent);
router.post("/login", loginStudent);

module.exports = router;