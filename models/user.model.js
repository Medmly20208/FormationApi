const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const user = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
});

user.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) {
    throw Error("this user doesn't exist");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw Error("incorrect password");
  }

  return user;
};

user.statics.signup = async function (email, password, type) {
  const user = await this.findOne({ email });

  if (user) {
    throw Error("this email is already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await this.create({ email, password: hashedPassword, type });

  return newUser;
};

const UserModel = mongoose.model("users", user);

module.exports = UserModel;
