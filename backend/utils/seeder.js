const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Student = require("../models/student");
const Attendance = require("../models/Attendance");

const seedDemoCredentials = async () => {
  try {
    const demoUsers = [
      {
        name: "Demo Admin",
        email: "admin@example.com",
        password: "password",
        role: "admin"
      },
      {
        name: "Demo Faculty",
        email: "faculty@example.com",
        password: "password",
        role: "faculty"
      },
      {
        name: "Demo Student",
        email: "student@example.com",
        password: "password",
        role: "student"
      }
    ];

    // Seed Users
    const seededUsers = {};
    for (const u of demoUsers) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        user = new User({
          name: u.name,
          email: u.email,
          password: hashedPassword,
          role: u.role
        });
        await user.save();
        console.log(`🌱 Seeded user: ${u.email} (${u.role})`);
      }
      seededUsers[u.role] = user;
    }

    // Seed Student Profile
    const studentUser = seededUsers["student"];
    if (studentUser) {
      let studentProfile = await Student.findOne({ user: studentUser._id });
      if (!studentProfile) {
        studentProfile = new Student({
          user: studentUser._id,
          name: studentUser.name,
          rollNumber: "21CS101",
          branch: "CSE",
          year: "3rd Year",
          section: "A"
        });
        await studentProfile.save();
        console.log("🌱 Seeded Student Profile for Demo Student");
      }

      // Seed Attendance Records if none exist
      const attendanceCount = await Attendance.countDocuments({ studentEmail: studentUser.email });
      if (attendanceCount === 0) {
        const attendanceData = [
          { subject: "Computer Networks", status: "Present", date: new Date("2026-07-01") },
          { subject: "Computer Networks", status: "Present", date: new Date("2026-07-02") },
          { subject: "Computer Networks", status: "Absent", date: new Date("2026-07-03") },
          { subject: "Database Systems", status: "Present", date: new Date("2026-07-01") },
          { subject: "Database Systems", status: "Present", date: new Date("2026-07-02") },
          { subject: "Database Systems", status: "Present", date: new Date("2026-07-03") },
          { subject: "Software Engineering", status: "Present", date: new Date("2026-07-01") },
          { subject: "Software Engineering", status: "Absent", date: new Date("2026-07-02") },
          { subject: "Software Engineering", status: "Present", date: new Date("2026-07-03") },
          { subject: "Mathematics", status: "Present", date: new Date("2026-06-30") },
          { subject: "Mathematics", status: "Present", date: new Date("2026-07-01") }
        ];

        for (const item of attendanceData) {
          const att = new Attendance({
            studentName: studentUser.name,
            studentEmail: studentUser.email,
            subject: item.subject,
            date: item.date,
            status: item.status
          });
          await att.save();
        }
        console.log("🌱 Seeded Demo Attendance Records");
      }
    }
  } catch (error) {
    console.error("❌ Demo seeding failed:", error.message);
  }
};

module.exports = seedDemoCredentials;
