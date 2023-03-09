const jwt = require("jsonwebtoken");
const user = require("../models/user.model");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email");
const isPasswordValid = require("../helpers/isPasswordValid");
const createToken = require("../utils/createToken");
const AppError = require("../utils/AppError");

const isUserAuthenticated = async (req) => {
  // check if the authorization token exists in the right form
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer") ||
    !req.headers.authorization.split(" ")[1]
  ) {
    throw new Error("you are not authorized to access this route.");
  }
  const token = req.headers.authorization.split(" ")[1];

  //  validate json
  if (!token) {
    throw new Error("you are not authorized to access this route");
  }

  const decoded = await jwt.verify(
    token,
    process.env.SECRET_JWT,
    (err, result) => {
      if (err) {
        throw new Error("you are not authorized");
      }
      return result;
    }
  );

  const freshUser = await user.findById(decoded._id);

  if (!freshUser) {
    throw new Error("the user belonging to this token doesn't longer exist");
  }
};

exports.checkIfUserAuthenticated = (req, res, next) => {
  isUserAuthenticated(req)
    .then((result) => {
      next();
    })
    .catch((err) => {
      res.status(401).json({
        status: "success",
        message: err.message,
      });
    });
};

exports.forgetPassword = async (req, res, next) => {
  const User = await user.findOne({ email: req.body.email });

  if (!User) {
    return res.status(400).json({
      sttaus: "failed",
      message: "user doesn't exist ",
    });
  }

  const resetToken = User.createPasswordResetToken();
  await User.save();

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `forget password ,if you forget your password send patch request ${resetUrl}`;
  const subject = "forget password order";

  const options = {
    email: User.email,
    message,
    subject,
  };

  try {
    await sendEmail(options);
  } catch (err) {
    User.passwordResetToken = undefined;
    User.passwordResetTokenExpires = undefined;
    return res.status(500).json({
      status: "failed",
      message: "internal server error",
    });
  }

  res.status(200).json({
    status: "succes",
    message: "token sent to email",
  });
};

exports.resetPassword = async (req, res, next) => {
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const User = await user.findOne({
    passwordResetToken,
    passwordResetTokenExpires: { $gte: Date.now() },
  });

  if (!User) {
    return res.status(400).json({
      status: "failed",
      message: "user doesn't exist or the token has been expired or invalid ",
    });
  }

  if (
    req.body.confirmPassword !== req.body.password ||
    !req.body.password ||
    !req.body.confirmPassword
  ) {
    return res.status(400).json({
      status: "failed",
      message: "please send a correct password and confirm password",
    });
  }

  try {
    isPasswordValid(req.body.password);
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      message: "your password isn't strong",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  User.password = hashedPassword;
  User.passwordResetToken = undefined;
  User.passwordResetTokenExpires = undefined;
  User.changedPassword = Date.now();

  await User.save();

  const token = await createToken(User._id, User.type);

  return res.status(200).json({
    status: "success",
    token,
    message: "successfully changed your password",
  });
};

exports.updatePassword = async function (req, res, next) {
  const User = await user.findOne({ ...req.body });

  if (!User) {
    return res.status(400).json({
      status: "failed",
      message: "user not found",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(
    req.body.currentPassword,
    User.password
  );

  if (!isPasswordCorrect) {
    return res.status(400).json({
      status: "failed",
      message: "password is not correct",
    });
  }

  if (
    !req.body.newPassword ||
    !req.body.confirmNewPassword ||
    req.body.newPassword != req.body.confirmNewPassword
  ) {
    return res.status(400).json({
      status: "failed",
      message: "newPassword and confirmNewPassword are not the same ",
    });
  }

  try {
    isPasswordValid(req.body.newPassword);
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

  try {
    User.password = hashedPassword;
    await User.save();
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: "internal server error",
    });
  }

  const token = createToken(User._id, User.type);

  return res.status(200).json({
    status: "success",
    token,
    message: "you changed your password successfully",
  });
};

exports.checkIfUserAuthorized = (req, res, next) => {
  const payload = JSON.parse(atob(req.headers.authorization.split(".")[1]));

  if (payload._id !== req.params.id) {
    return next(
      new AppError("you are not authorized to access this route", 400)
    );
  }

  next();
};
