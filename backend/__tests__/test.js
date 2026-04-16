const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server"); // Your Express app
const Leave = require("../models/Leave");
const Notification = require("../models/Notification");

// Mock email service
jest.mock("../utils/emailService", () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

beforeAll(async () => {
  // Connect to a test database
  await mongoose.connect("mongodb://127.0.0.1:27017/leave_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Leave Controller Integration", () => {
  let leaveId;
  const leaveData = {
    studentName: "Test Student",
    studentEmail: "student@example.com",
    facultyName: "Faculty",
    facultyEmail: "faculty@example.com",
    fromDate: "2026-04-20",
    toDate: "2026-04-22",
    reason: "Medical",
    document: "",
  };

  it("should create a leave request", async () => {
    const res = await request(app)
      .post("/api/leave")
      .send(leaveData)
      .expect(201);

    expect(res.body.studentEmail).toBe(leaveData.studentEmail);
    leaveId = res.body._id;
  });

  it("should get leaves by student", async () => {
    const res = await request(app)
      .get(`/api/leave/student/${leaveData.studentEmail}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].studentEmail).toBe(leaveData.studentEmail);
  });

  it("should update leave status, send email, and create notification", async () => {
    const res = await request(app)
      .put(`/api/leave/${leaveId}/status`)
      .send({ status: "Approved" })
      .expect(200);

    expect(res.body.data.status).toBe("Approved");

    // Notification created
    const notifications = await Notification.find({ studentEmail: leaveData.studentEmail });
    expect(notifications.length).toBe(1);
    expect(notifications[0].message).toMatch(/is Approved/);
  });
});