const express = require("express");
const {
  SignUp,
  ValidateSignUpData,
  ValidateLogInData,
  LogIn,
} = require("../controllers/userControllers");

const Router = express.Router();

Router.post("/signup", ValidateSignUpData, SignUp);
Router.post("/login", ValidateLogInData, LogIn);

module.exports = Router;
