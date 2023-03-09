const offers = require("../models/offer.model");
const excludeFromObject = require("../helpers/excludeFromObjects");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const UnauthorizedFields = require("../config/UnauthorizedFields");

exports.aliasNewOffers = (req, res, next) => {
  req.query.sort = "-createdAt";
  req.query.page = "1";
  req.query.limit = "5";

  next();
};

exports.getAllOffers = catchAsync(async (req, res, next) => {
  let queryObj = { ...req.query };

  let queryString = JSON.stringify(queryObj);

  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (match) => `$${match}`
  );

  queryObj = JSON.parse(queryString);
  const employerNameregex = new RegExp(req.query.employerName, "i"); // i for case insensitive
  const titleRegex = new RegExp(req.query.title, "i"); // i for case insensitive
  queryObj["employerName"] = { $regex: employerNameregex };
  queryObj["title"] = { $regex: titleRegex };
  const querySort = !req.query.sort ? "-createdAt" : req.query.sort;

  //pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const Offers = await offers
    .find(queryObj)
    .select(
      "title numberOfApplicants city employerImage employerId employerType employerName"
    )
    .sort(querySort)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "success",
    results: Offers.length,
    data: Offers,
  });
});

exports.CreateOffer = catchAsync(async (req, res, next) => {
  const offer = await offers.create({ ...req.body });

  res.status(200).json({
    status: "success",
    data: offer,
  });
});

exports.getOfferById = catchAsync(async (req, res, next) => {
  const offer = await offers.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: offer,
  });
});

exports.updateOffer = catchAsync(async (req, res, next) => {
  const Offer = await offers.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: Offer,
  });
});

exports.getOffersByEmployerId = catchAsync(async (req, res, next) => {
  const Offers = await offers.findById(req.params.EmployerId);

  res.status(200).json({
    status: "success",
    data: Offers,
  });
});

exports.deleteOffertById = catchAsync(async (req, res, next) => {
  await offers.findByIdAndDelete(req.params.id).then(() => {
    res.status(200).json({
      status: "success",
      data: null,
    });
  });
});

exports.excludeUnaouthorizedFields = (req, res, next) => {
  req.body = excludeFromObject(
    req.body,
    UnauthorizedFields.offerUnauthorizedFields
  );

  next();
};
