const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { submitLeave, getMyLeaves, cancelLeave, getAllLeaves, reviewLeave, verifyDocument } = require('../controllers/leaveController');

// ── Student routes (auth only) ────────────────────────────────────────────────
router.post('/', authMiddleware, submitLeave);
router.get('/my', authMiddleware, getMyLeaves);
router.delete('/:id', authMiddleware, cancelLeave);

// ── Admin routes (auth + admin) ───────────────────────────────────────────────
router.get('/all', authMiddleware, adminMiddleware, getAllLeaves);
router.put('/:id/review', authMiddleware, adminMiddleware, reviewLeave);
router.put('/:id/verify-document', authMiddleware, adminMiddleware, verifyDocument);

module.exports = router;
