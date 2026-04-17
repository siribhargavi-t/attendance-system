const { register, login, updatePassword } = require("../controllers/authController");
const authenticateJWT = require("../middleware/authenticateJWT");

router.post("/register", register);
router.post("/login", login);
router.put("/update-password", authenticateJWT, updatePassword);

module.exports = router;