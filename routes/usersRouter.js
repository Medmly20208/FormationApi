const express = require("express");
const userController = require("../controllers/userControllers");

const authController = require("../controllers/authController");

const Router = express.Router();

Router.post("/forgetPassword", authController.forgetPassword);
Router.post("/resetPassword/:token", authController.resetPassword);

Router.post(
  "/updatePassword",
  authController.checkIfUserAuthenticated,
  authController.updatePassword
);

Router.post(
  "/signup",
  userController.ValidateSignUpData,
  userController.SignUp
);
Router.post("/login", userController.ValidateLogInData, userController.LogIn);

module.exports = Router;
