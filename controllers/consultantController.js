const consultant = require("../models/consultant.model");

exports.CreateConsultant = (req, res) => {
  consultant
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

exports.updateConsultant = (req, res) => {
  consultant
    .findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
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

exports.getAllConsultants = (req, res) => {
  consultant
    .find()
    .then((consultants) => {
      res.status(200).json({
        status: "success",
        data: consultants,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
      });
    });
};

exports.getConsultantById = (req, res) => {
  consultant
    .findById(req.params.id)
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

exports.deleteConsultantById = (req, res) => {
  consultant
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
