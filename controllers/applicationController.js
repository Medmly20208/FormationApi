const applicationModel = require("../models/application.model");
const offerModel = require("../models/offer.model");
const excludeFromObject = require("../helpers/excludeFromObjects");
const UnauthorizedFields = require("../config/UnauthorizedFields");

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
    .then(async (application) => {
      await offerModel.findByIdAndUpdate(application.offerId, {
        $inc: { numberOfApplicants: 1 },
      });

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
    .findById(req.params.id)
    .then(async (application) => {
      await offerModel.findByIdAndUpdate(application.offerId, {
        $inc: { numberOfApplicants: -1 },
      });

      await application.delete();

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

exports.excludeUnaouthorizedFields = (req, res, next) => {
  req.body.application = excludeFromObject(
    req.body.application,
    UnauthorizedFields.applicationUnauthorizedFields
  );

  next();
};
