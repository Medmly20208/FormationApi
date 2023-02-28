const express = require("express");
const consultantController = require("../controllers/consultantController");
const Router = express.Router();

// public route methods
Router.post("/", consultantController.CreateConsultant);
Router.get("/", consultantController.getAllConsultants);
Router.get("/:id", consultantController.getConsultantById);

//private route methods
Router.patch("/:id", consultantController.updateConsultant);
Router.delete("/:id", consultantController.deleteConsultantById);

module.exports = Router;
