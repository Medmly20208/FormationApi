const trainingOffice = require("../models/trainingOffice.model");
const multer = require("multer");
const excludeFromObject = require("../helpers/excludeFromObjects");
const UnauthorizedFields = require("../config/UnauthorizedFields");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./files/profileImgTrainingOffice");
  },
  filename: (req, file, cb) => {
    const filename = `trainingoffice_${Date.now()}_${Math.round(
      Math.random() * 100
    )}${file.originalname}`;

    cb(null, filename);
  },
});

exports.upload = multer({ storage }).single("profileImg");

exports.updateTrainingOffice = catchAsync(async (req, res, next) => {
  if (req.body.profileImg) {
    req.body.profileImg = req.file.filename;
  }
  const TrainingOffice = await trainingOffice.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );

  if (!TrainingOffice) {
    return next(new AppError("this user doesn't exist", 404));
  }

  res.status(200).json({
    status: "success",
    data: TrainingOffice,
  });
});

exports.aliasTopFiveTrainingOffices = (req, res, next) => {
  req.query.sort = "-rating";
  req.query.page = "1";
  req.query.limit = "5";

  next();
};

exports.getAllTrainingOffices = catchAsync(async (req, res, next) => {
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

  const trainingOffices = await trainingOffice
    .find(queryObj)
    .select("profileImg name rating numberOfReviews city")
    .sort(querySort)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "success",
    results: trainingOffices.length,
    data: trainingOffices,
  });
});

exports.getTrainingOfficeById = catchAsync(async (req, res, next) => {
  const trainingOffices = await trainingOffice.findById(req.params.id);

  if (!trainingOffices) {
    return next(new AppError("this user doesn't exist", 404));
  }

  res.status(200).json({
    status: "success",
    data: trainingOffices,
  });
});

exports.deleteTrainingOfficeById = catchAsync(async (req, res, next) => {
  await trainingOffice.findByIdAndDelete(req.params.id).res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const trainingOffices = await trainingOffice.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: trainingOffices === null ? [] : trainingOffices.reviews,
  });
});

exports.postReview = catchAsync(async (req, res, next) => {
  const trainingOfficeUser = await trainingOffice.findById(req.params.id);
  if (!trainingOfficeUser) {
    return next(new AppError("this user doesn't exist"));
  }
  trainingOfficeUser.reviews.push(req.body.review);
  trainingOfficeUser.numberOfReviews = trainingOfficeUser.numberOfReviews + 1;
  trainingOfficeUser.totalRating =
    trainingOfficeUser.totalRating + req.body.review.rating;

  trainingOfficeUser.rating =
    trainingOfficeUser.totalRating / trainingOfficeUser.numberOfReviews;

  await trainingOfficeUser.save();

  res.status(200).json({
    status: "success",
    data: trainingOfficeUser,
  });
});

exports.excludeUnaouthorizedFields = (req, res, next) => {
  req.body = excludeFromObject(
    req.body,
    UnauthorizedFields.trainingOfficeUnauthorizedFields
  );

  next();
};
