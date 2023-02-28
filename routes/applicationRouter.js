const express = require("express");
const applicationController = require("../controllers/applicationController");
const Router = express.Router();

Router.get("/:id", applicationController.getApplicationByApplicantId);
Router.post("/", applicationController.postApplication);
Router.delete("/:id", applicationController.deleteApplicationById);
Router.patch("/:id", applicationController.updateApplication);

module.exports = Router;
