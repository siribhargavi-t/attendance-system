const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: false,
    sparse: true,   // allows multiple null values
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
  assignedBranches: {
    type: [String],
    default: [],
  },
  assignedSubjects: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Subject',
    default: [],
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Pre-save hook to hash password before saving a new user
UserSchema.pre('save', async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);
