const express = require("express");
const offersController = require("../controllers/offersController");
const Router = express.Router();

Router.post("/", offersController.CreateOffer);
Router.get("/", offersController.getAllOffers);
Router.get("/:EmployerId", offersController.getOffersByEmployerId);

Router.patch(
  "/:id",
  offersController.excludeUnaouthorizedFields,
  offersController.updateOffer
);
Router.delete("/:id", offersController.deleteOffertById);

module.exports = Router;
