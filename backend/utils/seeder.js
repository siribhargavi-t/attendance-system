const bcrypt = require("bcryptjs");
const User = require("../models/User");

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

    for (const u of demoUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        const newUser = new User({
          name: u.name,
          email: u.email,
          password: hashedPassword,
          role: u.role
        });
        await newUser.save();
        console.log(`🌱 Seeded demo user: ${u.email} (${u.role})`);
      }
    }
  } catch (error) {
    console.error("❌ Demo seeding failed:", error.message);
  }
};

module.exports = seedDemoCredentials;
