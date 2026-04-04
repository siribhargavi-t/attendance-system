const User = require('../models/User');
const Student = require('../models/student');
const Subject = require('../models/Subject');
const Settings = require('../models/Settings');
const bcrypt = require('bcryptjs');

const addStudent = async (req, res) => {
    try {
        const { username, email, password, name, rollNumber, parentEmail, branch } = req.body;
        
        // Ensure username and email don't exist
        let existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username or email already exists in User record' });
        }
        
        let existingStudent = await Student.findOne({ rollNumber });
        if (existingStudent) {
            return res.status(400).json({ success: false, message: 'Roll number already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
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
            const salt = await bcrypt.genSalt(10);
            targetAdmin.password = await bcrypt.hash(password, salt);
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

module.exports = {
    addStudent,
    getStudents,
    addSubject,
    getSubjects,
    getSettings,
    updateSettings,
    getAdmins,
    updateAdmin,
    deleteAdmin
};
