const express = require("express");
const companyController = require("../controllers/companyController");
const authController = require("../controllers/authController");
const Router = express.Router();

Router.get("/companiesStats", companyController.getCompanyStats);

Router.get(
  "/top-5-companies",
  companyController.aliasTopFiveCompanies,
  companyController.getAllCompanies
);

Router.get("/", companyController.getAllCompanies);
Router.get(
  "/:id",
  authController.checkIfUserAuthenticated,
  companyController.getCompanyById
);

//private route methods
Router.patch(
  "/:id",
  companyController.upload,
  companyController.excludeUnaouthorizedFields,
  authController.checkIfUserAuthenticated,
  authController.checkIfUserAuthorized,
  companyController.updateCompany
);

Router.delete(
  "/:id",
  authController.checkIfUserAuthenticated,
  authController.checkIfUserAuthorized,
  companyController.deleteCompanyById
);

//Reviews controllers
Router.post(
  "/:id/reviews",
  authController.checkIfUserAuthenticated,
  companyController.postReview
);

//get notifications
Router.get(
  "/:id/notifications",
  authController.checkIfUserAuthenticated,
  authController.checkIfUserAuthorized,
  companyController.getNotifications
);

module.exports = Router;
