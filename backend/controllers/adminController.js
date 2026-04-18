const User = require('../models/User');
const Student = require('../models/student');
const Subject = require('../models/Subject');
const Settings = require('../models/Settings');
const Attendance = require('../models/Attendance');

const addStudent = async (req, res) => {
    try {
        const { email, password, name, rollNumber, parentEmail, branch } = req.body;
        const username = req.body.username || rollNumber;
        
        // Ensure username and email don't exist
        let existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username (Roll Number) or email already exists in User record' });
        }
        
        let existingStudent = await Student.findOne({ rollNumber });
        if (existingStudent) {
            return res.status(400).json({ success: false, message: 'Roll number already exists' });
        }

        const newUser = new User({
            username,
            email,
            password,
            role: 'student'
        });
        await newUser.save();

        const newStudent = new Student({
            user: newUser._id,
            name,
            rollNumber,
            parentEmail,
            branch: branch || 'General'
        });
        await newStudent.save();

        res.status(201).json({ success: true, message: 'Student added successfully', student: newStudent });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getStudents = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        let students;
        if (user.isSuperAdmin) {
            students = await Student.find({}).populate('user', 'username email');
        } else {
            students = await Student.find({ branch: { $in: user.assignedBranches || [] } }).populate('user', 'username email');
        }
        res.status(200).json({ success: true, data: students });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        
        const { name, rollNumber, branch, parentEmail, password } = req.body;
        
        if (rollNumber && rollNumber !== student.rollNumber) {
            let existingStudent = await Student.findOne({ rollNumber });
            if (existingStudent) {
                return res.status(400).json({ success: false, message: 'Roll number already exists' });
            }
        }

        if (name) student.name = name;
        if (rollNumber) student.rollNumber = rollNumber;
        if (branch) student.branch = branch;
        if (parentEmail !== undefined) student.parentEmail = parentEmail;
        
        await student.save();

        if (password) {
            const linkedUser = await User.findById(student.user);
            if (linkedUser) {
                linkedUser.password = password;
                await linkedUser.save();
            }
        }
        
        res.status(200).json({ success: true, message: 'Student updated successfully', student });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        // Delete the linked User account
        await User.findByIdAndDelete(student.user);
        // Delete the Student profile
        await Student.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const addSubject = async (req, res) => {
    try {
        const { name, code } = req.body;
        let existingSub = await Subject.findOne({ code });
        if (existingSub) {
            return res.status(400).json({ success: false, message: 'Subject code already exists' });
        }

        const newSubject = new Subject({ name, code, teacher: req.user.id });
        await newSubject.save();

        res.status(201).json({ success: true, data: newSubject });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getSubjects = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        let subjects;
        if (user.isSuperAdmin) {
            subjects = await Subject.find({});
        } else {
            subjects = await Subject.find({ _id: { $in: user.assignedSubjects || [] } });
        }
        res.status(200).json({ success: true, data: subjects });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne({});
        if (!settings) {
            settings = new Settings({});
            await settings.save();
        }
        res.status(200).json({ success: true, data: settings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateSettings = async (req, res) => {
    try {
        const { lowAttendanceThreshold } = req.body;
        let settings = await Settings.findOne({});
        if (!settings) {
            settings = new Settings({ lowAttendanceThreshold });
        } else {
            settings.lowAttendanceThreshold = lowAttendanceThreshold;
        }
        await settings.save();
        res.status(200).json({ success: true, data: settings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getAdmins = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.isSuperAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied: Super Admins only' });
        }
        const admins = await User.find({ role: 'admin' }).select('-password');
        res.status(200).json({ success: true, data: admins });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.isSuperAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        
        const adminId = req.params.id;
        const { assignedBranches, assignedSubjects, password } = req.body;
        
        const targetAdmin = await User.findById(adminId);
        if (!targetAdmin || targetAdmin.role !== 'admin') {
             return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        if (assignedBranches !== undefined) targetAdmin.assignedBranches = assignedBranches;
        if (assignedSubjects !== undefined) targetAdmin.assignedSubjects = assignedSubjects;
        
        // Dynamic re-eval of SuperAdmin status based on payload if modified
        if (assignedBranches !== undefined || assignedSubjects !== undefined) {
             targetAdmin.isSuperAdmin = (!targetAdmin.assignedBranches || targetAdmin.assignedBranches.length === 0) &&
                                        (!targetAdmin.assignedSubjects || targetAdmin.assignedSubjects.length === 0);
        }

        if (password) {
            targetAdmin.password = password;
        }

        await targetAdmin.save();
        res.status(200).json({ success: true, message: 'Admin updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.isSuperAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        
        const adminId = req.params.id;
        if (req.user.id === adminId) {
             return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
        }

        const targetAdmin = await User.findById(adminId);
        if (!targetAdmin || targetAdmin.role !== 'admin') {
             return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        // Release teacher bindings in subjects
        await Subject.updateMany({ teacher: adminId }, { $unset: { teacher: "" } });
        
        await User.findByIdAndDelete(adminId);
        res.status(200).json({ success: true, message: 'Admin deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


// ── Get full attendance report with optional filters ──────────────────────────
const getAttendanceReport = async (req, res) => {
    try {
        const { startDate, endDate, subjectId, branch, status, studentId } = req.query;
        const query = {};

        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                const from = new Date(startDate); from.setUTCHours(0, 0, 0, 0);
                query.date.$gte = from;
            }
            if (endDate) {
                const to = new Date(endDate); to.setUTCHours(23, 59, 59, 999);
                query.date.$lte = to;
            }
        }
        if (subjectId) query.subjectId = subjectId;
        if (status && ['present', 'absent'].includes(status)) query.status = status;

        let records = await Attendance.find(query)
            .populate({ path: 'studentId', select: 'name rollNumber branch' })
            .populate('subjectId', 'name code')
            .sort({ date: -1, 'studentId.name': 1 });

        // Filter by branch and studentId after populate
        if (branch) records = records.filter(r => r.studentId?.branch === branch);
        if (studentId) records = records.filter(r => r.studentId?._id?.toString() === studentId);

        const totalCount = records.length;
        const presentCount = records.filter(r => r.status === 'present').length;
        const absentCount = totalCount - presentCount;
        const pct = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0;

        res.status(200).json({
            success: true,
            summary: { total: totalCount, present: presentCount, absent: absentCount, percentage: pct },
            data: records
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── Get students below attendance threshold ────────────────────────────────────
const getLowAttendanceStudents = async (req, res) => {
    try {
        const settings = await Settings.findOne({});
        const threshold = settings ? settings.lowAttendanceThreshold : 75;

        const students = await Student.find({}).populate('user', 'username email');
        const results = [];

        for (const stu of students) {
            const total = await Attendance.countDocuments({ studentId: stu._id });
            const present = await Attendance.countDocuments({ studentId: stu._id, status: 'present' });
            const pct = total > 0 ? (present / total) * 100 : 100;
            if (pct < threshold) {
                results.push({
                    _id: stu._id,
                    name: stu.name,
                    rollNumber: stu.rollNumber,
                    branch: stu.branch,
                    total,
                    present,
                    absent: total - present,
                    percentage: pct.toFixed(1)
                });
            }
        }

        results.sort((a, b) => parseFloat(a.percentage) - parseFloat(b.percentage));
        res.status(200).json({ success: true, threshold, data: results });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── Get a single student's subject-wise attendance breakdown ─────────────────
const getStudentAttendanceById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('user', 'username email');
        if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

        const records = await Attendance.find({ studentId: student._id })
            .populate('subjectId', 'name code');

        // Group by subject
        const subjectMap = {};
        for (const r of records) {
            const key = r.subjectId?._id?.toString() || 'unknown';
            if (!subjectMap[key]) {
                subjectMap[key] = {
                    subjectId: key,
                    subjectName: r.subjectId?.name || 'Unknown',
                    subjectCode: r.subjectId?.code || '',
                    total: 0, present: 0, absent: 0
                };
            }
            subjectMap[key].total++;
            if (r.status === 'present') subjectMap[key].present++;
            else subjectMap[key].absent++;
        }

        const subjects = Object.values(subjectMap).map(s => ({
            ...s,
            percentage: s.total > 0 ? ((s.present / s.total) * 100).toFixed(1) : '100.0'
        }));

        const totalAll = records.length;
        const presentAll = records.filter(r => r.status === 'present').length;

        res.status(200).json({
            success: true,
            student: { _id: student._id, name: student.name, rollNumber: student.rollNumber, branch: student.branch, email: student.user?.email },
            overall: {
                total: totalAll,
                present: presentAll,
                absent: totalAll - presentAll,
                percentage: totalAll > 0 ? ((presentAll / totalAll) * 100).toFixed(1) : '100.0'
            },
            subjects
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    addStudent,
    getStudents,
    updateStudent,
    deleteStudent,
    addSubject,
    getSubjects,
    getSettings,
    updateSettings,
    getAdmins,
    updateAdmin,
    deleteAdmin,
    getAttendanceReport,
    getLowAttendanceStudents,
    getStudentAttendanceById
};
