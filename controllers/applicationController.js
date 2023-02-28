const applicationModel = require("../models/application.model");

exports.getApplicationByApplicantId = (req, res) => {
  applicationModel
    .find({ applicantId: req.params.id })
    .then((applications) => {
      res.status(200).json({
        status: "success",
        data: applications,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.postApplication = (req, res) => {
  applicationModel
    .create(req.body.application)
    .then((application) => {
      res.status(200).json({
        status: "success",
        data: application,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.deleteApplicationById = (req, res) => {
  applicationModel
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

exports.updateApplication = (req, res) => {
  applicationModel
    .findByIdAndUpdate(
      req.params.id,
      { ...req.body.application },
      { new: true }
    )
    .then((application) => {
      res.status(200).json({
        status: "success",
        data: application,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};
