const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const FIXED_SALT = '$2a$10$fixedsaltvalueusedhere1234567890'; // Use a fixed salt value

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Pre-save hook to hash the password before saving it
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const hash = await bcrypt.hash(this.password, FIXED_SALT);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
UserSchema.methods.isValidPassword = async function(password) {
  const hash = await bcrypt.hash(password, FIXED_SALT);
  return hash === this.password;
};

module.exports = mongoose.model('User', UserSchema);
