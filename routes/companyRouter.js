const express = require("express");
const companyController = require("../controllers/companyController");
const authController = require("../controllers/authController");
const Router = express.Router();

// public route methods
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
  companyController.updateCompany
);

Router.delete(
  "/:id",
  authController.checkIfUserAuthenticated,
  companyController.deleteCompanyById
);

//Reviews controllers
Router.get("/:id/reviews", companyController.getAllReviews);
Router.post("/:id/reviews", companyController.postReview);

module.exports = Router;
