const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userTypes = ["consultant", "company", "trainingOffice"];

const user = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      required: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    changedPassword: Date,
  },
  { timestamps: true }
);

user.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  let isPasswordCorrect;

  if (user) {
    isPasswordCorrect = await bcrypt.compare(password, user.password);
  }
  if (!user || !isPasswordCorrect) {
    throw Error("Password or email aren't correct");
  }

  return user;
};

user.statics.signup = async function (email, password, type) {
  const user = await this.findOne({ email });

  if (userTypes.indexOf(type) === -1) {
    throw Error(
      "this type is invalid , valid types are 'company' 'trainingOffice' 'consultant' "
    );
  }

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
