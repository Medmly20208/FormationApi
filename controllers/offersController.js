const offers = require("../models/offer.model");
const excludeFromObject = require("../helpers/excludeFromObjects");
const UnauthorizedFields = require("../config/UnauthorizedFields");

exports.getAllOffers = (req, res) => {
  let queryObj = { ...req.query };

  let queryString = JSON.stringify(queryObj);

  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (match) => `$${match}`
  );

  queryObj = JSON.parse(queryString);
  const employerNameregex = new RegExp(req.query.employerName, "i"); // i for case insensitive
  const titleRegex = new RegExp(req.query.title, "i"); // i for case insensitive
  queryObj["employerName"] = { $regex: employerNameregex };
  queryObj["title"] = { $regex: titleRegex };
  const querySort = !req.query.sort ? "-createdAt" : req.query.sort;
  offers
    .find(queryObj)
    .select(
      "title numberOfApplicants city employerImage employerId employerType employerName"
    )
    .sort(querySort)
    .then((offers) => {
      res.status(200).json({
        status: "success",
        results: offers.length,
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

exports.getOfferById = (req, res) => {
  offers
    .findById(req.params.id)
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

exports.excludeUnaouthorizedFields = (req, res, next) => {
  req.body = excludeFromObject(
    req.body,
    UnauthorizedFields.offerUnauthorizedFields
  );

  next();
};
