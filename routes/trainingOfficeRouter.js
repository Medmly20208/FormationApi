const express = require("express");
const trainingOfficeControllers = require("../controllers/trainingOfficeController");
const authController = require("../controllers/authController");
const Router = express.Router();

// public route methods
Router.get("/", trainingOfficeControllers.getAllTrainingOffices);
Router.get(
  "/:id",
  authController.checkIfUserAuthenticated,
  trainingOfficeControllers.getTrainingOfficeById
);

//private route methods
Router.patch(
  "/:id",
  trainingOfficeControllers.upload,
  trainingOfficeControllers.excludeUnaouthorizedFields,
  trainingOfficeControllers.updateTrainingOffice
);
Router.delete("/:id", trainingOfficeControllers.deleteTrainingOfficeById);

//Reviews controllers
Router.get("/:id/reviews", trainingOfficeControllers.getAllReviews);
Router.post("/:id/reviews", trainingOfficeControllers.postReview);

module.exports = Router;
