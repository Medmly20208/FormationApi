const express = require("express");
const trainingOfficeControllers = require("../controllers/trainingOfficeController");
const authController = require("../controllers/authController");
const Router = express.Router();

Router.get(
  "/top-5-trainingOffices",
  trainingOfficeControllers.aliasTopFiveTrainingOffices,
  trainingOfficeControllers.getAllTrainingOffices
);

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
  authController.checkIfUserAuthenticated,
  authController.checkIfUserAuthorized,
  trainingOfficeControllers.updateTrainingOffice
);
Router.delete(
  "/:id",
  authController.checkIfUserAuthenticated,
  authController.checkIfUserAuthorized,
  trainingOfficeControllers.deleteTrainingOfficeById
);

//Reviews controllers
Router.post(
  "/:id/reviews",
  authController.checkIfUserAuthenticated,
  trainingOfficeControllers.postReview
);

module.exports = Router;
