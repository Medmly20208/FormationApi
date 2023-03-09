const consultant = require("../models/consultant.model");
const multer = require("multer");
const excludeFromObject = require("../helpers/excludeFromObjects");
const UnauthorizedFields = require("../config/UnauthorizedFields");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profileImg") {
      cb(null, "./files/profileImgConsultant");
    } else {
      cb(null, "./files/cv");
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "profileImg") {
      const filename = `consultantImg_${Date.now()}_${Math.round(
        Math.random() * 100
      )}${file.originalname}`;
      cb(null, filename);
    } else {
      const filename = `cv_${Date.now()}_${Math.round(Math.random() * 100)}${
        file.originalname
      }`;
      cb(null, filename);
    }
  },
});

exports.uploadFiles = multer({
  storage: storage,
  limits: {
    fileSize: "2mb",
  },
}).fields([
  {
    name: "profileImg",
    maxCount: 1,
  },
  {
    name: "cv",
    maxCount: 1,
  },
]);
exports.CreateConsultant = catchAsync(async (req, res) => {
  const consultants = await consultant.create({ ...req.body });

  res.status(200).json({
    status: "success",
    data: consultants,
  });
});

exports.updateConsultant = catchAsync(async (req, res, next) => {
  if (req.files?.profileImg[0]) {
    req.body.profileImg = req.files["profileImg"][0].filename;
  }
  if (req.files?.cv[0]) {
    req.body.cv = req.files["cv"][0].filename;
  }

  const newConsultant = await consultant.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );

  if (!newConsultant) {
    return next(new AppError("this consultant doesn't exist", 404));
  }

  res.status(200).json({
    status: "success",
    data: newConsultant,
  });
});

exports.aliasTopFiveConsultants = (req, res, next) => {
  req.query.sort = "-rating";
  req.query.page = "1";
  req.query.limit = "5";

  next();
};

exports.getAllConsultants = catchAsync(async (req, res, next) => {
  let queryObj = { ...req.query };

  let queryString = JSON.stringify(queryObj);

  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (match) => `$${match}`
  );

  queryObj = JSON.parse(queryString);
  const regex = new RegExp(req.query.name, "i"); // i for case insensitive
  queryObj["name"] = { $regex: regex };

  //sort
  const querySort = !req.query.sort ? "-createdAt" : req.query.sort;

  //pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const consultants = await consultant
    .find(queryObj)
    .select("profileImg name rating city field consultantId createdAt")
    .sort(querySort)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "success",
    data: consultants,
  });
});

exports.getConsultantById = catchAsync(async (req, res, next) => {
  const consultantUser = await consultant.findById(req.params.id);

  if (!consultantUser) {
    return next(new AppError("this user doesn't exist", 404));
  }

  res.status(200).json({
    status: "success",
    data: consultantUser,
  });
});

exports.deleteConsultantById = catchAsync(async (req, res, next) => {
  const deletedConsultant = await consultant.findByIdAndDelete(req.params.id);

  if (!deletedConsultant) {
    return next(new AppError("this consultant doesn't exist", 404));
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.getAllReviews = catchAsync(async (req, res) => {
  const reviews = await consultant.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: consultant === null ? [] : consultant.reviews,
  });
});

exports.postReview = catchAsync(async (req, res, next) => {
  const consultantUser = await consultant.findById(req.params.id);
  console.log(consultantUser);
  if (!consultantUser) {
    return next(new AppError("this user doesn't exist", 404));
  }
  consultantUser.reviews.push(req.body.review);
  consultantUser.numberOfReviews = consultantUser.numberOfReviews + 1;
  consultantUser.totalRating =
    consultantUser.totalRating + req.body.review.rating;

  consultantUser.rating =
    consultantUser.totalRating / consultantUser.numberOfReviews;

  await consultantUser.save();

  res.status(200).json({
    status: "success",
    data: consultantUser,
  });
});

exports.excludeUnaouthorizedFields = (req, res, next) => {
  req.body = excludeFromObject(
    req.body,
    UnauthorizedFields.consultantUnauthorizedFields
  );

  next();
};
