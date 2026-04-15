// backend/routes/notificationRoutes.js
const router = require("express").Router();
const { getNotifications } = require("../controllers/notificationController");
router.get("/:email", getNotifications);
module.exports = router;
