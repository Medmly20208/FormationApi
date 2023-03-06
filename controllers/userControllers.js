const User = require("../models/user.model");
const Consultant = require("../models/consultant.model");
const trainingOffice = require("../models/trainingOffice.model");
const company = require("../models/company.model");
const createToken = require("../utils/createToken");
const isEmailValid = require("../helpers/isEmailValid");
const isPasswordValid = require("../helpers/isPasswordValid");

const CreateTypeUser = async (id, email, type) => {
  if (type === "consultant") {
    return Consultant.create({
      consultantId: id,
      email,
    }).catch((error) => {
      throw Error(error.message);
    });
  }
  if (type === "trainingOffice") {
    return trainingOffice
      .create({
        trainingOfficeId: id,
        email,
      })
      .catch((error) => {
        throw Error(error.message);
      });
  }

  if (type === "company") {
    return company
      .create({
        companyId: id,
        email,
      })
      .catch((error) => {
        throw Error(error.message);
      });
  }
};

exports.ValidateSignUpData = (req, res, next) => {
  try {
    isEmailValid(req.body.email);
    isPasswordValid(req.body.password);
  } catch (error) {
    return res.json({
      status: 404,
      message: error.message,
    });
  }

  next();
};

exports.ValidateLogInData = (req, res, next) => {
  try {
    isEmailValid(req.body.email);
    isPasswordValid(req.body.password);
  } catch (error) {
    return res.json({
      status: 401,
      message: error.message,
    });
  }

  next();
};

exports.SignUp = (req, res) => {
  User.signup(req.body.email, req.body.password, req.body.type)
    .then(async (user) => {
      const token = createToken(user._id, user.type);
      await CreateTypeUser(user._id, user.email, req.body.type);
      return res.json({
        status: "success",
        token,
        data: { email: user.email },
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "failed",
        error: err.message,
      });
    });
};

exports.LogIn = (req, res) => {
  User.login(req.body.email, req.body.password)
    .then((user) => {
      const token = createToken(user._id, user.type);

      return res.json({
        status: "success",
        token,
        data: { email: user.email },
      });
    })
    .catch((err) => {
      return res.status(401).json({
        status: "failed",
        message: err.message,
      });
    });
};
