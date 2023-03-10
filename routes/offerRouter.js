const express = require("express");
const offersController = require("../controllers/offersController");
const authController = require("../controllers/authController");
const Router = express.Router();

Router.post("/", offersController.CreateOffer);

Router.get(
  "/newOffers",
  offersController.aliasNewOffers,
  offersController.getAllOffers
);

Router.get("/", offersController.getAllOffers);
Router.get(
  "/:id",
  authController.checkIfUserAuthenticated,
  offersController.getOfferById
);

Router.get("/:EmployerId", offersController.getOffersByEmployerId);

Router.patch(
  "/:id",
  offersController.excludeUnaouthorizedFields,
  offersController.updateOffer
);
Router.delete("/:id", offersController.deleteOffertById);

module.exports = Router;
