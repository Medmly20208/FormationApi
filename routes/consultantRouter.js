const express = require("express");
const consultantController = require("../controllers/consultantController");
const authController = require("../controllers/authController");
const Router = express.Router();

Router.get(
  "/top-5-consultants",
  consultantController.aliasTopFiveConsultants,
  consultantController.getAllConsultants
);

Router.get("/", consultantController.getAllConsultants);
Router.get(
  "/:id",
  authController.checkIfUserAuthenticated,
  consultantController.getConsultantById
);
Router.delete("/:id", consultantController.deleteConsultantById);

Router.patch(
  "/:id",
  consultantController.uploadFiles,
  consultantController.excludeUnaouthorizedFields,
  consultantController.updateConsultant
);

//Reviews controllers
Router.get("/:id/reviews", consultantController.getAllReviews);
Router.post("/:id/reviews", consultantController.postReview);

module.exports = Router;
