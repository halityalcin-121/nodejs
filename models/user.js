const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
  _id: String,
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, 'Email zorunludur!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Lütfen geçerli bir email giriniz!']
  },
  password: {
    type: String,
    required: [true, 'Sifre zorunludur'],
    minlength: 6,
    select: false
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  isAdmin: Boolean,
  createdDate: Date,
  lastActive: Date,
  gender: String,
  age: Number,
  emailConfirmed: Boolean,
  hobbies: String,
  about: String,
  imageUrls: Array,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
