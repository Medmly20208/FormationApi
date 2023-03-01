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
  let queryObj = { ...req.query };

  let queryString = JSON.stringify(queryObj);

  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (match) => `$${match}`
  );

  queryObj = JSON.parse(queryString);
  const regex = new RegExp(req.query.name, "i"); // i for case insensitive
  queryObj["name"] = { $regex: regex };
  consultant
    .find(queryObj)
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

exports.getAllReviews = (req, res) => {
  consultant
    .findById(req.params.id)
    .then((consultant) => {
      res.status(200).json({
        status: "success",
        data: consultant === null ? [] : consultant.reviews,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

exports.postReview = async (req, res) => {
  try {
    const consultantUser = await consultant.findById(req.params.id);

    consultantUser.reviews.push(req.body.review);
    consultantUser.numberOfReviews = consultantUser.numberOfReviews + 1;
    consultantUser.totalRating =
      consultantUser.totalRating + req.body.review.rating;

    consultantUser.rating =
      consultantUser.totalRating / consultantUser.numberOfReviews;

    consultantUser.save();

    res.status(200).json({
      status: "success",
      data: consultantUser,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
