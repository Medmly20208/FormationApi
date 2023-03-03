const express = require("express");
const consultantController = require("../controllers/consultantController");
const authController = require("../controllers/authController");
const Router = express.Router();

// public route methods
Router.get("/", consultantController.getAllConsultants);
Router.get(
  "/:id",
  authController.checkIfUserAuthenticated,
  consultantController.getConsultantById
);

//private route methods
Router.patch(
  "/:id",
  consultantController.uploadFiles,
  consultantController.excludeUnaouthorizedFields,
  consultantController.updateConsultant
);
Router.delete("/:id", consultantController.deleteConsultantById);

//Reviews controllers
Router.get("/:id/reviews", consultantController.getAllReviews);
Router.post("/:id/reviews", consultantController.postReview);

module.exports = Router;
