const offers = require("../models/offer.model");

exports.getAllOffers = (req, res) => {
  offers
    .find()
    .then((offers) => {
      res.status(200).json({
        status: "success",
        data: offers,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.CreateOffer = (req, res) => {
  offers
    .create({ ...req.body })
    .then((consultant) => {
      res.status(200).json({
        status: "success",
        data: consultant,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.updateOffer = (req, res) => {
  offers
    .findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
    .then((offer) => {
      res.status(200).json({
        status: "success",
        data: offer,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.getOffersByEmployerId = (req, res) => {
  offers
    .findById(req.params.EmployerId)
    .then((consultant) => {
      res.status(200).json({
        status: "success",
        data: consultant,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.deleteOffertById = (req, res) => {
  offers
    .findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).json({
        status: "success",
        data: null,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};
