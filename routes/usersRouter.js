const express = require("express");
const {
  SignUp,
  ValidateSignUpData,
  ValidateLogInData,
  LogIn,
} = require("../controllers/userControllers");

const Router = express.Router();

Router.post("/Signup", ValidateSignUpData, SignUp);
Router.post("/Login", ValidateLogInData, LogIn);

module.exports = Router;
