const company = require("../models/company.model");
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

exports.getCompanyStats = (req, res, next) => {
  company
    .aggregate([
      {
        $group: {
          _id: "$rating",
          numCompanies: { $sum: 1 },
        },
      },
    ])
    .then((result) => {
      res.status(200).json({
        status: "success",
        data: result,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        data: err.message,
      });
    });
};

exports.upload = multer({ storage }).single("profileImg");

exports.updateCompany = (req, res) => {
  if (req.file) {
    req.body.profileImg = req.file.filename;
  }

  company
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

exports.aliasTopFiveCompanies = (req, res, next) => {
  req.query.sort = "-rating";
  req.query.page = "1";
  req.query.limit = "5";

  next();
};

exports.getAllCompanies = async (req, res) => {
  let queryObj = { ...req.query };

  let queryString = JSON.stringify(queryObj);

  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (match) => `$${match}`
  );

  queryObj = JSON.parse(queryString);
  const regex = new RegExp(req.query.name, "i"); // i for case insensitive
  queryObj["name"] = { $regex: regex };
  const querySort = !req.query.sort ? "-createdAt" : req.query.sort;

  //pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  company
    .find(queryObj)
    .select(
      "profileImg name rating numberOfReviews field city createdAt fullname"
    )
    .sort(querySort)
    .skip(skip)
    .limit(limit)
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
  company
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
  company
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
  company
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
    const companyUser = await company.findById(req.params.id);

    if (!companyUser) {
      throw new Error("this user doesn't exist");
    }

    companyUser.reviews.push(req.body.review);
    companyUser.numberOfReviews = companyUser.numberOfReviews + 1;
    companyUser.totalRating = companyUser.totalRating + req.body.review.rating;

    companyUser.rating = companyUser.totalRating / companyUser.numberOfReviews;

    await companyUser.save({ runValidators: true });

    res.status(200).json({
      status: "success",
      data: companyUser,
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
