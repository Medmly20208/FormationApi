const express = require("express");
const {
  SignUp,
  ValidateSignUpData,
  ValidateLogInData,
  LogIn,
} = require("../controllers/userControllers");

const authController = require("../controllers/authController");

const Router = express.Router();

Router.post("/forgetPassword", authController.forgetPassword);
Router.post("/resetPassword/:token", authController.resetPassword);

Router.post("/signup", ValidateSignUpData, SignUp);
Router.post("/login", ValidateLogInData, LogIn);

module.exports = Router;
