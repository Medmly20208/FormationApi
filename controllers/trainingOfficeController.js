const trainingOfficeModel = require("../models/trainingOffice.model");
const User = require("../models/user.model");

exports.CreateTrainingOffice = (req, res) => {
  trainingOfficeModel
    .create({ ...req.body })
    .then((trainingoffice) => {
      res.status(200).json({
        status: "success",
        data: trainingoffice,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.updateTrainingOffice = (req, res) => {
  trainingOfficeModel
    .findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
    .then((trainingOffice) => {
      res.status(200).json({
        status: "success",
        data: trainingOffice,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.getAllTrainingOffices = (req, res) => {
  trainingOfficeModel
    .find()
    .then((trainingOffices) => {
      res.status(200).json({
        status: "success",
        data: trainingOffices,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
      });
    });
};

exports.getTrainingOfficeById = (req, res) => {
  trainingOfficeModel
    .findById(req.params.id)
    .then((trainingOffice) => {
      res.status(200).json({
        status: "success",
        data: trainingOffice,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.deleteTrainingOfficeById = (req, res) => {
  trainingOfficeModel
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

exports.getAllReviews = (req, res) => {
  trainingOfficeModel
    .findById(req.params.id)
    .then((trainingOffice) => {
      res.status(200).json({
        status: "success",
        data: trainingOffice === null ? [] : trainingOffice.reviews,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.postReview = (req, res) => {
  trainingOfficeModel
    .findByIdAndUpdate(
      req.params.id,
      { $push: { reviews: req.body.review } },
      { new: true }
    )
    .then((trainingOffice) => {
      res.status(200).json({
        status: "success",
        data: trainingOffice,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};
