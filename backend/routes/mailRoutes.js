const express = require("express");
const router = express.Router();
const { getRecipients, sendMail } = require("../controllers/mailController");
const authenticateJWT = require("../middleware/authenticateJWT");

// All mail routes are protected
router.use(authenticateJWT);

router.get("/recipients", getRecipients);
router.post("/send", sendMail);

module.exports = router;
