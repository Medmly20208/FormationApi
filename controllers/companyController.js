const companyModel = require("../models/company.model");

exports.updateCompany = (req, res) => {
  companyModel
    .findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
    .then((company) => {
      res.status(200).json({
        status: "success",
        data: company,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.getAllCompanies = (req, res) => {
  companyModel
    .find()
    .then((companies) => {
      res.status(200).json({
        status: "success",
        data: companies,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.getCompanyById = (req, res) => {
  companyModel
    .findById(req.params.id)
    .then((company) => {
      res.status(200).json({
        status: "success",
        data: company,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.deleteCompanyById = (req, res) => {
  companyModel
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
  companyModel
    .findById(req.params.id)
    .then((company) => {
      res.status(200).json({
        status: "success",
        data: company === null ? [] : company.reviews,
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
  companyModel
    .findByIdAndUpdate(
      req.params.id,
      { $push: { reviews: req.body.review } },
      { new: true }
    )
    .then((company) => {
      res.status(200).json({
        status: "success",
        data: company,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};
