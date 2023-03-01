const express = require("express");
const consultantController = require("../controllers/consultantController");
const Router = express.Router();

// public route methods
Router.get("/", consultantController.getAllConsultants);
Router.get("/:id", consultantController.getConsultantById);

//private route methods
Router.patch(
  "/:id",
  consultantController.uploadFiles,
  consultantController.updateConsultant
);
Router.delete("/:id", consultantController.deleteConsultantById);

//Reviews controllers
Router.get("/:id/reviews", consultantController.getAllReviews);
Router.post("/:id/reviews", consultantController.postReview);

module.exports = Router;
