const company = require("../models/company.model");
const multer = require("multer");
const excludeFromObject = require("../helpers/excludeFromObjects");
const UnauthorizedFields = require("../config/UnauthorizedFields");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

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

exports.getCompanyStats = catchAsync(async (req, res, next) => {
  const result = await company.aggregate([
    {
      $group: {
        _id: "$rating",
        numCompanies: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

exports.upload = multer({ storage }).single("profileImg");

exports.updateCompany = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.profileImg = req.file.filename;
  }

  const Company = await company.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );

  if (!Company) {
    return next(new AppError("this user doesn't exist", 404));
  }

  res.status(200).json({
    status: "success",
    data: Company,
  });
});

exports.aliasTopFiveCompanies = (req, res, next) => {
  req.query.sort = "-rating";
  req.query.page = "1";
  req.query.limit = "5";

  next();
};

exports.getAllCompanies = catchAsync(async (req, res, next) => {
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

  const companies = await company
    .find(queryObj)
    .select(
      "profileImg name rating numberOfReviews field city createdAt fullname"
    )
    .sort(querySort)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "success",
    results: companies.length,
    data: companies,
  });
});

exports.getCompanyById = catchAsync(async (req, res, next) => {
  const Company = await company.findById(req.params.id);

  if (!Company) {
    return next(new AppError("this user doesn't exist", 404));
  }

  res.status(200).json({
    status: "success",
    data: Company,
  });
});

exports.deleteCompanyById = catchAsync(async (req, res, next) => {
  await company.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.getAllReviews = catchAsync((req, res, next) => {
  const Company = company
    .findById(req.params.id)
    .res.status(200)
    .json({
      status: "success",
      data: Company === null ? [] : Company.reviews,
    });
});

exports.postReview = catchAsync(async (req, res, next) => {
  const companyUser = await company.findById(req.params.id);

  if (!companyUser) {
    return new AppError("this user doesn't exist");
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
});

exports.excludeUnaouthorizedFields = (req, res, next) => {
  req.body = excludeFromObject(
    req.body,
    UnauthorizedFields.companyUnauthorizedFields
  );

  next();
};
