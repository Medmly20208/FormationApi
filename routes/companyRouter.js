const express = require("express");
const companyController = require("../controllers/companyController");
const Router = express.Router();

// public route methods
Router.get("/", companyController.getAllCompanies);
Router.get("/:id", companyController.getCompanyById);

//private route methods
Router.patch("/:id", companyController.upload, companyController.updateCompany);
Router.delete("/:id", companyController.deleteCompanyById);

//Reviews controllers
Router.get("/:id/reviews", companyController.getAllReviews);
Router.post("/:id/reviews", companyController.postReview);

module.exports = Router;
