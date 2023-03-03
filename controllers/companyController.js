const companyModel = require("../models/company.model");
const multer = require("multer");
const excludeFromObject = require("../helpers/excludeFromObjects");
const UnauthorizedFields = require("../config/UnauthorizedFields");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./files/profileImgCompany");
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}_${Math.round(Math.random() * 100)}${
      file.originalname
    }`;

    cb(null, filename);
  },
});

exports.upload = multer({ storage }).single("profileImg");

exports.updateCompany = (req, res) => {
  if (req.file) {
    req.body.profileImg = req.file.filename;
  }

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
  let queryObj = { ...req.query };

  let queryString = JSON.stringify(queryObj);

  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (match) => `$${match}`
  );

  queryObj = JSON.parse(queryString);
  const regex = new RegExp(req.query.name, "i"); // i for case insensitive
  queryObj["name"] = { $regex: regex };
  companyModel
    .find(queryObj)
    .select("profileImg name rating numberOfReviews field")
    .then((companies) => {
      res.status(200).json({
        status: "success",
        results: companies.length,
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
      return res.status(200).json({
        status: "success",
        data: company,
      });
    })
    .catch((err) => {
      return res.status(400).json({
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

exports.postReview = async (req, res) => {
  try {
    const company = await companyModel.findById(req.params.id);

    company.reviews.push(req.body.review);
    company.numberOfReviews = company.numberOfReviews + 1;
    company.totalRating = company.totalRating + req.body.review.rating;

    company.rating = company.totalRating / company.numberOfReviews;

    company.save();

    res.status(200).json({
      status: "success",
      data: company,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.excludeUnaouthorizedFields = (req, res, next) => {
  req.body = excludeFromObject(
    req.body,
    UnauthorizedFields.companyUnauthorizedFields
  );

  next();
};
