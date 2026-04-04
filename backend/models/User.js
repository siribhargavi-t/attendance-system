const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'student'],
    required: true,
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
  // Add any other fields you might need for a user
  // For example:
  // email: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },
});

// Pre-save hook to hash password before saving a new user
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', UserSchema);
