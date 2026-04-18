const Leave = require('../models/Leave');
const Student = require('../models/student');

// ── Student: Submit a new leave request ──────────────────────────────────────
const submitLeave = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user.id });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found.' });
        }

        const { reason, description, fromDate, toDate, documentUrl } = req.body;

        if (!reason || !description || !fromDate || !toDate) {
            return res.status(400).json({ success: false, message: 'Reason, description, and dates are required.' });
        }

        const from = new Date(fromDate);
        const to = new Date(toDate);
        if (to < from) {
            return res.status(400).json({ success: false, message: '"To" date cannot be before "From" date.' });
        }

        // Check for overlapping pending/approved leaves for this student
        const overlap = await Leave.findOne({
            studentId: student._id,
            status: { $in: ['pending', 'approved'] },
            fromDate: { $lte: to },
            toDate: { $gte: from }
        });
        if (overlap) {
            return res.status(400).json({
                success: false,
                message: 'You already have a leave request overlapping these dates. Please check your existing requests.'
            });
        }

        const leave = new Leave({
            studentId: student._id,
            reason,
            description,
            fromDate: from,
            toDate: to,
            documentUrl: documentUrl || ''
        });

        await leave.save();
        res.status(201).json({ success: true, message: 'Leave request submitted successfully.', leave });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── Student: Fetch my leave requests ─────────────────────────────────────────
const getMyLeaves = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user.id });
        if (!student) {
            return res.status(200).json({ success: true, leaves: [] });
        }

        const leaves = await Leave.find({ studentId: student._id })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, leaves });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── Student: Cancel a pending leave ──────────────────────────────────────────
const cancelLeave = async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user.id });
        const leave = await Leave.findOne({ _id: req.params.id, studentId: student._id });

        if (!leave) {
            return res.status(404).json({ success: false, message: 'Leave request not found.' });
        }
        if (leave.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Only pending requests can be cancelled.' });
        }

        await Leave.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Leave request cancelled.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── Admin: Get all leave requests ────────────────────────────────────────────
const getAllLeaves = async (req, res) => {
    try {
        const filter = {};
        if (req.query.status && ['pending', 'approved', 'rejected'].includes(req.query.status)) {
            filter.status = req.query.status;
        }

        const leaves = await Leave.find(filter)
            .populate('studentId', 'name rollNumber branch')
            .populate('reviewedBy', 'username')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, leaves });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── Admin: Approve or reject a leave request ─────────────────────────────────
const reviewLeave = async (req, res) => {
    try {
        const { action, adminComment } = req.body; // action: 'approved' | 'rejected'

        if (!['approved', 'rejected'].includes(action)) {
            return res.status(400).json({ success: false, message: 'Invalid action. Use "approved" or "rejected".' });
        }

        const leave = await Leave.findById(req.params.id);
        if (!leave) {
            return res.status(404).json({ success: false, message: 'Leave request not found.' });
        }
        if (leave.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'This leave has already been reviewed.' });
        }

        leave.status = action;
        leave.adminComment = adminComment || '';
        leave.reviewedBy = req.user.id;
        leave.reviewedAt = new Date();

        await leave.save();
        res.status(200).json({ success: true, message: `Leave ${action} successfully.`, leave });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── Admin: Verify or reject a document ───────────────────────────────────────
const verifyDocument = async (req, res) => {
    try {
        const { verified } = req.body; // true = verified, false = not legitimate
        if (typeof verified !== 'boolean') {
            return res.status(400).json({ success: false, message: 'verified must be true or false.' });
        }

        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ success: false, message: 'Leave not found.' });
        if (!leave.documentUrl) return res.status(400).json({ success: false, message: 'No document attached to this request.' });

        leave.documentVerified = verified;
        leave.documentVerifiedBy = req.user.id;
        leave.documentVerifiedAt = new Date();
        await leave.save();

        res.status(200).json({
            success: true,
            message: `Document marked as ${verified ? 'verified ✓' : 'not legitimate ✗'}.`,
            leave
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { submitLeave, getMyLeaves, cancelLeave, getAllLeaves, reviewLeave, verifyDocument };
